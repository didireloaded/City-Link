import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PICKUP_POINTS, ROUTES } from "@/data/trips";
import { ArrowLeftRight, ArrowRight, Calendar, MapPin, Sparkles, Tag } from "lucide-react";

export const SearchCard = ({ compact = false }: { compact?: boolean }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);

  const [from, setFrom] = useState("Windhoek");
  const [to, setTo] = useState("Oshakati");
  const [pickup, setPickup] = useState(PICKUP_POINTS.Windhoek?.[0] || "Windhoek Terminal");
  const [dropoff, setDropoff] = useState(PICKUP_POINTS.Oshakati?.[0] || "Oshakati Ekuku Mall");
  const [date, setDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<"one-way" | "return">("one-way");

  useEffect(() => {
    setPickup(PICKUP_POINTS[from]?.[0] || `${from} terminal`);
  }, [from]);

  useEffect(() => {
    setDropoff(PICKUP_POINTS[to]?.[0] || `${to} terminal`);
  }, [to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from,
      to,
      date,
      pickup,
      dropoff,
      passengers: String(passengers),
      tripType,
    });
    if (tripType === "return" && returnDate) params.set("returnDate", returnDate);
    navigate(`/results?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className={`rounded-3xl border border-border bg-card p-5 transition-all ${
        compact ? "" : "shadow-[var(--shadow-elegant)] ring-1 ring-accent/10"
      }`}
    >
      {/* Return Toggle Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-secondary p-1 flex-1">
          {(["one-way", "return"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTripType(type)}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-xs font-extrabold transition-all ${
                tripType === type
                  ? "bg-card text-primary shadow-sm scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  tripType === type ? "bg-accent shadow-[var(--shadow-glow)]" : "border border-muted-foreground"
                }`}
              />
              {type === "one-way" ? "One Way" : "Return (-6% Off)"}
            </button>
          ))}
        </div>
        {!compact && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-extrabold text-accent">
            <Tag className="h-3 w-3" /> Luxury Sleeper Guaranteed
          </span>
        )}
      </div>

      {/* From / To Fields */}
      <div className="relative mt-4 space-y-3">
        <Field label="From (Departure City)" icon={<MapPin className="h-4 w-4 text-accent" />}>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="field-control"
          >
            {ROUTES.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="button"
          onClick={swap}
          className="absolute right-4 top-[52px] z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-md transition-transform active:scale-95 hover:border-accent hover:text-accent"
          aria-label="Swap origin and destination"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <Field label="To (Destination City)" icon={<MapPin className="h-4 w-4 text-accent" />}>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="field-control"
          >
            {ROUTES.filter((route) => route !== from).map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Pickup & Dropoff specific terminals */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="Pickup Point">
          <select
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="field-control text-xs"
          >
            {(PICKUP_POINTS[from] || [`${from} terminal`]).map((point) => (
              <option key={point}>{point}</option>
            ))}
          </select>
        </Field>
        <Field label="Drop-off Terminal">
          <select
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="field-control text-xs"
          >
            {(PICKUP_POINTS[to] || [`${to} terminal`]).map((point) => (
              <option key={point}>{point}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Advance Booking Quick Options */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-accent" /> Advance Booking Options
          </span>
          {date > today && (
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-extrabold text-success border border-success/30">
              Early Priority Locked
            </span>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: "Today", offset: 0 },
            { label: "Tomorrow", offset: 1 },
            { label: "This Friday", offset: (5 - new Date().getDay() + 7) % 7 || 7 },
            { label: "In 1 Week", offset: 7 },
            { label: "In 2 Weeks", offset: 14 },
            { label: "Next Month", offset: 30 },
          ].map((item) => {
            const targetDate = new Date(Date.now() + 86400000 * item.offset).toISOString().slice(0, 10);
            const active = date === targetDate;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setDate(targetDate);
                  if (returnDate < targetDate) {
                    setReturnDate(new Date(Date.now() + 86400000 * (item.offset + 3)).toISOString().slice(0, 10));
                  }
                }}
                className={`flex shrink-0 items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95 ${
                  active
                    ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)]"
                    : "border border-border bg-secondary/80 text-primary hover:border-accent/40"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date and Passengers */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="Departure Date" icon={<Calendar className="h-4 w-4 text-accent" />}>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="field-control"
          />
        </Field>

        {tripType === "return" ? (
          <Field label="Return Date" icon={<Calendar className="h-4 w-4 text-accent" />}>
            <input
              type="date"
              value={returnDate}
              min={date}
              onChange={(e) => setReturnDate(e.target.value)}
              className="field-control"
            />
          </Field>
        ) : (
          <Field label="Passengers">
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="field-control"
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "Passenger" : "Passengers"}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {/* Advance Booking Benefit Banner */}
      {date > today && (
        <div className="mt-3.5 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-3.5 text-xs font-extrabold text-primary animate-fade-up">
          <Sparkles className="h-4 w-4 shrink-0 text-success" />
          <div className="min-w-0">
            <span className="text-success block text-xs">Advance Reservation Guaranteed</span>
            <span className="text-[11px] font-semibold text-muted-foreground block mt-0.5">
              Scheduled for {new Date(date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · Priority seat selection locked.
            </span>
          </div>
        </div>
      )}

      {/* Huge Search CTA Button (Impossible to miss!) */}
      <button
        type="submit"
        className="mt-5 flex h-16 w-full items-center justify-center gap-2.5 rounded-2xl bg-accent text-lg font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] transition-all hover:brightness-110 active:scale-[0.98]"
      >
        <Sparkles className="h-5 w-5" /> Search Trips <ArrowRight className="h-5 w-5" />
      </button>

      <style>{`
        .field-control {
          width: 100%;
          min-width: 0;
          height: 52px;
          background: hsl(var(--input));
          border: 1px solid hsl(var(--border));
          border-radius: 0.85rem;
          padding: 0 0.85rem;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
          font-weight: 700;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-control:focus {
          border-color: hsl(var(--accent));
          box-shadow: 0 0 0 3px hsl(var(--accent) / 0.16);
        }
      `}</style>
    </form>
  );
};

const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <label className="block min-w-0">
    <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
      {icon} {label}
    </span>
    {children}
  </label>
);
