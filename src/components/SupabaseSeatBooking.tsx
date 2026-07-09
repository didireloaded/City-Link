import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { CircleUser, Clock, ShieldCheck, Tag } from "lucide-react";
import { toast } from "sonner";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const HOLD_MINUTES = 10;

const DISCOUNTS: Record<string, number> = {
  regular: 0,
  student: 5,
  senior: 8,
};

export interface SeatItem {
  id: string;
  seat_number: string;
  seat_type: string;
}

interface SupabaseSeatBookingProps {
  tripId: string;
  routePrice: number;
  userId?: string;
  onSeatSelected?: (seatNumber: string, finalPrice: number, heldUntil?: string) => void;
}

export const SupabaseSeatBooking = ({
  tripId,
  routePrice,
  userId = "demo-user-id",
  onSeatSelected,
}: SupabaseSeatBookingProps) => {
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<SeatItem | null>(null);
  const [passengerType, setPassengerType] = useState<string>("regular");
  const [passengerName, setPassengerName] = useState<string>("");
  const [returnTicket, setReturnTicket] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [heldUntilTime, setHeldUntilTime] = useState<Date | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);

  // Countdown timer for seat hold
  useEffect(() => {
    if (!heldUntilTime) {
      setTimeLeftSec(0);
      return;
    }
    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((heldUntilTime.getTime() - Date.now()) / 1000));
      setTimeLeftSec(diff);
      if (diff === 0) {
        setHeldUntilTime(null);
        toast.error("Seat hold expired. Please select again.");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [heldUntilTime]);

  // Generate fallback 49-seat layout (13 rows x 4 = 52, row 13 trimmed to A/B only)
  const generateFallbackSeats = useCallback((): SeatItem[] => {
    const list: SeatItem[] = [];
    const letters = ["A", "B", "C", "D"];
    for (let r = 1; r <= 13; r++) {
      for (const s of letters) {
        if (!(r === 13 && (s === "C" || s === "D"))) {
          list.push({
            id: `seat-${r}${s}`,
            seat_number: `${r}${s}`,
            seat_type: s === "A" || s === "D" ? "window" : "aisle",
          });
        }
      }
    }
    return list;
  }, []);

  const loadSeats = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If Supabase is connected, fetch live schema table data
    if (supabase) {
      try {
        const { data: trip, error: tripErr } = await supabase
          .from("trips")
          .select("bus_id")
          .eq("id", tripId)
          .single();

        if (tripErr || !trip) {
          console.warn("Trip not found on network, using local coach seating schedule.");
          setSeats(generateFallbackSeats());
          setTaken(new Set(["seat-1A", "seat-2B", "seat-3C", "seat-4D", "seat-6A", "seat-8B"]));
          setLoading(false);
          return;
        }

        const { data: seatRows, error: seatErr } = await supabase
          .from("seats")
          .select("id, seat_number, seat_type")
          .eq("bus_id", trip.bus_id)
          .order("seat_number");

        const { data: bookingRows, error: bookingErr } = await supabase
          .from("bookings")
          .select("seat_id, status, held_until")
          .eq("trip_id", tripId)
          .in("status", ["held", "confirmed"]);

        if (seatErr || bookingErr) {
          setError("Couldn't check live seat availability.");
          setLoading(false);
          return;
        }

        const now = new Date();
        const takenIds = new Set<string>(
          (bookingRows || [])
            .filter(
              (b: any) =>
                b.status === "confirmed" ||
                (b.status === "held" && new Date(b.held_until) > now)
            )
            .map((b: any) => b.seat_id)
        );

        setSeats(seatRows || []);
        setTaken(takenIds);
        setLoading(false);
        return;
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local simulation:", err);
      }
    }

    // Fallback standalone mode
    setSeats(generateFallbackSeats());
    setTaken(new Set(["seat-1A", "seat-2B", "seat-3C", "seat-4D", "seat-6A", "seat-8B"]));
    setLoading(false);
  }, [tripId, generateFallbackSeats]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  const discountPercent = DISCOUNTS[passengerType] + (returnTicket ? 6 : 0);
  const finalPrice = Math.round(routePrice * (1 - discountPercent / 100));

  function handleSelectSeat(seat: SeatItem) {
    if (taken.has(seat.id) || submitting) return;
    setSelected(seat);
    setError(null);
  }

  async function handleConfirm() {
    if (!selected) {
      setError("Choose a seat first.");
      toast.error("Please pick an available seat on the coach diagram.");
      return;
    }
    if (!passengerName.trim()) {
      setError("Enter the passenger name.");
      toast.error("Please enter passenger full name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const heldUntil = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

    if (supabase) {
      const { data, error: insertErr } = await supabase
        .from("bookings")
        .insert({
          trip_id: tripId,
          user_id: userId,
          seat_id: selected.id,
          passenger_name: passengerName.trim(),
          passenger_type: passengerType,
          discount_applied: discountPercent,
          price_paid: finalPrice,
          status: "held",
          held_until: heldUntil.toISOString(),
        })
        .select()
        .single();

      if (insertErr) {
        if (insertErr.code === "23505") {
          setError("That seat was just taken by another passenger. Pick another.");
          await loadSeats();
          setSelected(null);
        } else {
          setError("Couldn't hold that seat right now. Try again.");
        }
        setSubmitting(false);
        return;
      }

      setHeldUntilTime(heldUntil);
      setSubmitting(false);
      toast.success(`Seat ${selected.seat_number} held for ${HOLD_MINUTES} minutes!`);
      if (onSeatSelected) onSeatSelected(selected.seat_number, finalPrice, heldUntil.toISOString());
      return;
    }

    // Standalone simulation confirm
    setTimeout(() => {
      setTaken((prev) => new Set([...prev, selected.id]));
      setHeldUntilTime(heldUntil);
      setSubmitting(false);
      toast.success(`Seat ${selected.seat_number} locked & held for ${HOLD_MINUTES} min!`);
      if (onSeatSelected) onSeatSelected(selected.seat_number, finalPrice, heldUntil.toISOString());
    }, 400);
  }

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-muted-foreground">Loading 49-seat luxury diagram...</div>;
  }

  const rows = groupIntoRows(seats);

  return (
    <div className="mx-auto max-w-md space-y-5 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-base font-extrabold text-primary">Interactive 49-Seat Diagram</h3>
          <p className="text-xs font-semibold text-muted-foreground">
            2-2 Layout · Row 13 Single Pair
          </p>
        </div>
        {heldUntilTime && timeLeftSec > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-extrabold text-accent animate-pulse">
            <Clock className="h-3.5 w-3.5" />
            {Math.floor(timeLeftSec / 60)}:{(timeLeftSec % 60).toString().padStart(2, "0")} Held
          </div>
        )}
      </div>

      {/* Coach Layout Box */}
      <div className="rounded-2xl border border-border bg-secondary/70 p-4">
        <div className="mb-4 flex items-center justify-between px-2 text-[10px] font-extrabold uppercase text-muted-foreground">
          <span>Door / Front</span>
          <div className="flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1 text-primary shadow-sm" title="Driver">
            <CircleUser className="h-4 w-4 text-accent" /> Driver Seat
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((row, i) => {
            const rowNum = i + 1;
            const [a, b, c, d] = row;
            return (
              <div key={rowNum} className="flex items-center justify-center gap-2">
                <span className="w-5 text-right font-mono text-[10px] font-bold text-muted-foreground">
                  {rowNum}
                </span>
                <SeatButton seat={a} taken={taken} selected={selected} onSelect={handleSelectSeat} />
                <SeatButton seat={b} taken={taken} selected={selected} onSelect={handleSelectSeat} />
                <div className="w-5" />
                <SeatButton seat={c} taken={taken} selected={selected} onSelect={handleSelectSeat} />
                <SeatButton seat={d} taken={taken} selected={selected} onSelect={handleSelectSeat} />
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap justify-center gap-4 border-t border-border/60 pt-3 text-xs font-bold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-card border border-primary" /> Available
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-accent shadow-[var(--shadow-glow)]" /> Selected
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-destructive/30 border border-destructive line-through" /> Taken
          </div>
        </div>
      </div>

      {/* Passenger Name & Discount Options */}
      <div className="space-y-3 rounded-2xl border border-border bg-secondary/30 p-4">
        <label className="block">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground">
            Passenger Full Name
          </span>
          <input
            type="text"
            placeholder="e.g. Haikali Ndatulumukwa"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-bold outline-none focus:border-accent"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground">
              Passenger Fare Type
            </span>
            <select
              value={passengerType}
              onChange={(e) => setPassengerType(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-bold text-primary outline-none focus:border-accent"
            >
              <option value="regular">Regular Fare (N${routePrice})</option>
              <option value="student">Student (5% off)</option>
              <option value="senior">Senior Citizen (8% off)</option>
            </select>
          </label>

          <label className="flex flex-col justify-end">
            <div
              onClick={() => setReturnTicket(!returnTicket)}
              className={`flex h-11 cursor-pointer items-center justify-between rounded-xl border px-3 text-xs font-extrabold transition-all ${
                returnTicket ? "border-accent bg-accent/15 text-primary" : "border-border bg-card text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-accent" /> Return (-6%)
              </span>
              <input type="checkbox" checked={returnTicket} onChange={() => {}} className="accent-accent" />
            </div>
          </label>
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-xs font-bold text-muted-foreground">
            {selected ? `Seat ${selected.seat_number} Locked` : "No seat selected"}
          </span>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-primary">N${finalPrice}</span>
            {discountPercent > 0 && (
              <span className="ml-2 text-xs font-bold text-success">
                (-{discountPercent}%)
              </span>
            )}
          </div>
        </div>

        {error && <p className="text-xs font-bold text-destructive">{error}</p>}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting || !selected}
          className="h-12 w-full rounded-xl bg-accent text-xs font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95 disabled:opacity-50"
        >
          {submitting ? "Holding seat..." : `Hold Seat ${selected?.seat_number || ""} for ${HOLD_MINUTES} min`}
        </button>
      </div>
    </div>
  );
};

const SeatButton = ({
  seat,
  taken,
  selected,
  onSelect,
}: {
  seat?: SeatItem;
  taken: Set<string>;
  selected: SeatItem | null;
  onSelect: (s: SeatItem) => void;
}) => {
  if (!seat) return <div className="h-9 w-9" />;

  const isTaken = taken.has(seat.id);
  const isSelected = selected?.id === seat.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(seat)}
      disabled={isTaken}
      title={`Seat ${seat.seat_number} (${seat.seat_type})`}
      className={`h-9 w-9 rounded-lg border text-[11px] font-extrabold transition-all ${
        isTaken
          ? "bg-destructive/20 text-destructive border-transparent cursor-not-allowed line-through opacity-70"
          : isSelected
          ? "bg-accent text-accent-foreground border-accent shadow-[var(--shadow-glow)] scale-105"
          : "bg-card text-primary border-primary/40 hover:border-accent hover:scale-105 shadow-2xs"
      }`}
    >
      {seat.seat_number}
    </button>
  );
};

// Group into rows of 4 [A, B, C, D] honoring the last-row C & D exception
function groupIntoRows(seats: SeatItem[]): (SeatItem | undefined)[][] {
  const byRow: Record<string, Record<string, SeatItem>> = {};
  seats.forEach((s) => {
    const rowNum = s.seat_number.slice(0, -1);
    const letter = s.seat_number.slice(-1);
    byRow[rowNum] = byRow[rowNum] || {};
    byRow[rowNum][letter] = s;
  });
  return Object.keys(byRow)
    .sort((x, y) => Number(x) - Number(y))
    .map((r) => [byRow[r].A, byRow[r].B, byRow[r].C, byRow[r].D]);
}

export default SupabaseSeatBooking;
