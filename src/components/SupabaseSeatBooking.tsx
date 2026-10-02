import { useState, useEffect } from "react";
import { CircleUser, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";

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

interface SeatBookingProps {
  tripId: string;
  routePrice: number;
  travelDate?: string;
  onSeatSelected?: (seatNumber: string, finalPrice: number, heldUntil?: string) => void;
}

/** 49-seat layout: 12 rows of 4 + final pair (A/B only). Deterministic and shared with the server contract. */
function generateSeats(): SeatItem[] {
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
}

const SEATS = generateSeats();

export const SupabaseSeatBooking = ({
  tripId,
  routePrice,
  travelDate,
  onSeatSelected,
}: SeatBookingProps) => {
  const date = travelDate ?? new Date().toISOString().slice(0, 10);
  const utils = trpc.useUtils();

  const availability = trpc.bookings.availability.useQuery(
    { tripId, travelDate: date },
    { refetchInterval: 30_000 },
  );
  const holdSeat = trpc.bookings.holdSeat.useMutation();

  const [selected, setSelected] = useState<SeatItem | null>(null);
  const [passengerType, setPassengerType] = useState<string>("regular");
  const [passengerName, setPassengerName] = useState<string>("");
  const [returnTicket, setReturnTicket] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [heldUntilTime, setHeldUntilTime] = useState<Date | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);

  const taken = new Set(
    (availability.data?.taken ?? []).map((seatNumber) => `seat-${seatNumber}`),
  );

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
        utils.bookings.availability.invalidate({ tripId, travelDate: date });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [heldUntilTime, tripId, date, utils]);

  const discountPercent = DISCOUNTS[passengerType] + (returnTicket ? 6 : 0);
  const finalPrice = Math.round(routePrice * (1 - discountPercent / 100));

  function handleSelectSeat(seat: SeatItem) {
    if (taken.has(seat.id) || holdSeat.isPending) return;
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

    setError(null);
    try {
      const result = await holdSeat.mutateAsync({
        tripId,
        travelDate: date,
        seatNumber: selected.seat_number,
        passengerName: passengerName.trim(),
        passengerType,
        priceNad: finalPrice,
      });
      const heldUntil = new Date(result.heldUntil);
      setHeldUntilTime(heldUntil);
      toast.success(`Seat ${selected.seat_number} held for 10 minutes!`);
      onSeatSelected?.(selected.seat_number, finalPrice, heldUntil.toISOString());
      utils.bookings.availability.invalidate({ tripId, travelDate: date });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't hold that seat right now. Try again.");
      setSelected(null);
      utils.bookings.availability.invalidate({ tripId, travelDate: date });
    }
  }

  if (availability.isLoading) {
    return <div className="p-8 text-center text-xs font-bold text-muted-foreground">Loading 49-seat luxury diagram...</div>;
  }

  const rows = groupIntoRows(SEATS);

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
            <span className="h-3.5 w-3.5 rounded bg-accent border border-accent" /> Selected
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-muted-foreground/40 border border-muted-foreground/40" /> Occupied
          </div>
        </div>
      </div>

      {/* Passenger & Pricing */}
      <div className="space-y-3.5">
        <label className="block">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Passenger Full Name</span>
          <input
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            placeholder="e.g. Tangeni Shilongo"
            className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-3.5 text-xs font-bold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          <label className="block">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Passenger Type</span>
            <select
              value={passengerType}
              onChange={(e) => setPassengerType(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-3 text-xs font-bold capitalize outline-none focus:border-accent"
            >
              <option value="regular">Regular</option>
              <option value="student">Student (−5%)</option>
              <option value="senior">Senior 60+ (−8%)</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setReturnTicket(!returnTicket)}
            className={`mt-5 h-12 rounded-xl border text-xs font-extrabold transition-all ${
              returnTicket
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            Return Ticket {returnTicket ? "−6% Applied" : "(Save 6%)"}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3.5">
          <span className="text-xs font-extrabold text-muted-foreground">
            Seat {selected ? selected.seat_number : "—"} · {discountPercent}% off
          </span>
          <span className="text-lg font-extrabold text-primary">N${finalPrice}</span>
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-center text-xs font-extrabold text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected || holdSeat.isPending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-elegant)] active:scale-[0.98] disabled:opacity-50 transition-transform"
        >
          <ShieldCheck className="h-4 w-4 text-accent" />
          {holdSeat.isPending ? "Holding seat…" : selected ? `Hold Seat ${selected.seat_number}` : "Select a Seat"}
        </button>
      </div>
    </div>
  );
};

function groupIntoRows(seats: SeatItem[]): SeatItem[][] {
  const rows: SeatItem[][] = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }
  // Final row has only seats A/B — pad for layout
  const last = rows[rows.length - 1];
  while (last.length < 4) last.push(undefined as unknown as SeatItem);
  return rows;
}

const SeatButton = ({
  seat,
  taken,
  selected,
  onSelect,
}: {
  seat: SeatItem | undefined;
  taken: Set<string>;
  selected: SeatItem | null;
  onSelect: (seat: SeatItem) => void;
}) => {
  if (!seat) return <div className="h-10 w-10" />;
  const isTaken = taken.has(seat.id);
  const isSelected = selected?.id === seat.id;
  return (
    <button
      type="button"
      disabled={isTaken}
      onClick={() => onSelect(seat)}
      title={`Seat ${seat.seat_number} · ${seat.seat_type}`}
      className={`flex h-11 w-11 items-center justify-center rounded-xl text-[10px] font-extrabold transition-all active:scale-95 ${
        isTaken
          ? "cursor-not-allowed bg-muted-foreground/40 text-white/70"
          : isSelected
          ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)] ring-2 ring-accent/50"
          : "bg-card text-primary border border-primary/30 hover:border-accent"
      }`}
    >
      {seat.seat_number}
    </button>
  );
};

export default SupabaseSeatBooking;
