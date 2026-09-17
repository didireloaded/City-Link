import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PICKUP_POINTS, ROUTES } from "@/data/trips";
import { ArrowLeftRight, ArrowRight, Calendar, Luggage, MapPin, Plane, Sparkles, Tag } from "lucide-react";

export const SearchCard = ({ compact = false }: { compact?: boolean }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);

  const [from, setFrom] = useState("Hosea Kutako International Airport");
  const [to, setTo] = useState("Windhoek");
  const [pickup, setPickup] = useState(PICKUP_POINTS["Hosea Kutako International Airport"]?.[0] || "Arrivals Hall Meet & Greet");
  const [dropoff, setDropoff] = useState(PICKUP_POINTS.Windhoek?.[0] || "Hotel pickup");
  const [date, setDate] = useState(today);
  const [pickupTime, setPickupTime] = useState("14:30");
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [returnTime, setReturnTime] = useState("09:00");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(2);
  const [flightNumber, setFlightNumber] = useState("");
  const [tripType, setTripType] = useState<"one-way" | "return">("one-way");
  const airportMode = from === "Hosea Kutako International Airport" || to === "Hosea Kutako International Airport";

  useEffect(() => {
    setPickup(PICKUP_POINTS[from]?.[0] || `${from} address`);
  }, [from]);

  useEffect(() => {
    setDropoff(PICKUP_POINTS[to]?.[0] || `${to} address`);
  }, [to]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from,
      to,
      date,
      pickup,
      dropoff,
      pickupTime,
      passengers: String(passengers),
      luggage: String(luggage),
      tripType,
    });
    if (tripType === "return") {
      params.set("returnDate", returnDate);
      params.set("returnTime", returnTime);
    }
    if (airportMode && flightNumber) params.set("flightNumber", flightNumber);
    navigate(`/results?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className={`rounded-3xl border border-border bg-card p-5 transition-all ${
        compact ? "" : "shadow-[var(--shadow-elegant)] ring-1 ring-accent/10"
      }`}
    >
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-secondary p-1 flex-1">
          {(["one-way", "return"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTripType(type)}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-xs font-extrabold transition-all ${
                tripType === type ? "bg-card text-primary shadow-sm scale-[1.02]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${tripType === type ? "bg-accent shadow-[var(--shadow-glow)]" : "border border-muted-foreground"}`} />
              {type === "one-way" ? "One Way" : "Return"}
            </button>
          ))}
        </div>
        {!compact && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-extrabold text-accent">
            <Tag className="h-3 w-3" /> Private vehicle
          </span>
        )}
      </div>

      <div className="relative mt-4 space-y-3">
        <Field label="Pickup location" icon={<MapPin className="h-4 w-4 text-accent" />}>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="field-control">
            {ROUTES.map((route) => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </Field>

        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="absolute right-4 top-[52px] z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-md transition-transform active:scale-95 hover:border-accent hover:text-accent"
          aria-label="Swap pickup and destination"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <Field label="Where to?" icon={<MapPin className="h-4 w-4 text-accent" />}>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="field-control">
            {ROUTES.filter((route) => route !== from).map((route) => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="Pickup point">
          <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="field-control text-xs">
            {(PICKUP_POINTS[from] || [`${from} address`]).map((point) => (
              <option key={point}>{point}</option>
            ))}
          </select>
        </Field>
        <Field label="Drop-off point">
          <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="field-control text-xs">
            {(PICKUP_POINTS[to] || [`${to} address`]).map((point) => (
              <option key={point}>{point}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="Pickup date" icon={<Calendar className="h-4 w-4 text-accent" />}>
          <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className="field-control" />
        </Field>
        <Field label="Pickup time">
          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="field-control" />
        </Field>
        <Field label="Passengers">
          <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="field-control">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
              <option key={count} value={count}>{count} {count === 1 ? "Passenger" : "Passengers"}</option>
            ))}
          </select>
        </Field>
        <Field label="Luggage" icon={<Luggage className="h-4 w-4 text-accent" />}>
          <select value={luggage} onChange={(e) => setLuggage(Number(e.target.value))} className="field-control">
            {[0, 1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>{count} bag{count === 1 ? "" : "s"}</option>
            ))}
          </select>
        </Field>
      </div>

      {tripType === "return" && (
        <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-up">
          <Field label="Return date" icon={<Calendar className="h-4 w-4 text-accent" />}>
            <input type="date" value={returnDate} min={date} onChange={(e) => setReturnDate(e.target.value)} className="field-control" />
          </Field>
          <Field label="Return time">
            <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="field-control" />
          </Field>
        </div>
      )}

      {airportMode && (
        <div className="mt-3 rounded-2xl border border-accent/30 bg-accent/10 p-3.5 animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-accent">
              <Plane className="h-3.5 w-3.5" /> Meet & Greet available
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">Optional flight details</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Flight number">
              <input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value.toUpperCase())} placeholder="e.g. 4Z 124" className="field-control" />
            </Field>
            <Field label="Arrival / Departure">
              <select className="field-control">
                <option>Arrival</option>
                <option>Departure</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {date > today && (
        <div className="mt-3.5 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-3.5 text-xs font-extrabold text-primary animate-fade-up">
          <Sparkles className="h-4 w-4 shrink-0 text-success" />
          <div className="min-w-0">
            <span className="text-success block text-xs">Advance Reservation</span>
            <span className="text-[11px] font-semibold text-muted-foreground block mt-0.5">
              City Cab will confirm your driver assignment for the selected pickup time.
            </span>
          </div>
        </div>
      )}

      <button type="submit" className="mt-5 flex h-16 w-full items-center justify-center gap-2.5 rounded-2xl bg-accent text-lg font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] transition-all hover:brightness-110 active:scale-[0.98]">
        <Sparkles className="h-5 w-5" /> Find a Transfer <ArrowRight className="h-5 w-5" />
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

const Field = ({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <label className="block min-w-0">
    <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
      {icon} {label}
    </span>
    {children}
  </label>
);
