import { inferService, serviceDefaults } from "@/lib/transfer-service";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AmenityIcon } from "@/components/Brand";
import { TopBar } from "@/components/TopBar";
import { createTransferOptions } from "@/data/trips";
import { ArrowRight, Clock, Luggage, MapPin, ShieldCheck, Star, Users } from "lucide-react";

const Results = () => {
  const [params] = useSearchParams();
  const from = params.get("from") || "Hosea Kutako International Airport";
  const to = params.get("to") || "Windhoek";
  const date = params.get("date") || new Date().toISOString().slice(0, 10);
  const passengers = params.get("passengers") || "1";
  const pickup = params.get("pickup") || "Arrivals Hall Meet & Greet";
  const dropoff = params.get("dropoff") || "Hotel pickup";
  const pickupTime = params.get("pickupTime") || "14:30";
  const service = params.get("service") || inferService(from, to);
  const [sort, setSort] = useState<"recommended" | "price" | "capacity">("recommended");

  const sorted = createTransferOptions(from, to, pickupTime).filter(trip => (!serviceDefaults[service] || serviceDefaults[service].vehicles.includes(trip.bus.id)) && trip.bus.capacity >= Number(passengers) && trip.bus.luggageCapacity >= Number(params.get("luggage") || 0)).sort((a, b) => {
    if (sort === "price") return (a.price || 99999) - (b.price || 99999);
    if (sort === "capacity") return b.bus.capacity - a.bus.capacity;
    if (a.bus.id === params.get("vehicle")) return -1;
    if (b.bus.id === params.get("vehicle")) return 1;
    const serviceRank = recommendedRank(service);
    return (serviceRank[a.bus.id] ?? 10) - (serviceRank[b.bus.id] ?? 10);
  });

  return (
    <div className="safe-page bg-background">
      <TopBar
        title={`${shortPlace(from)} to ${shortPlace(to)}`}
        subtitle={`${service} · ${formatDate(date)} · ${pickupTime} · ${passengers} passenger${passengers === "1" ? "" : "s"}`}
        back="/"
      />

      <main className="mx-auto max-w-md px-4 pt-4">
        <section className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <p className="text-[11px] font-extrabold uppercase text-white/70">{service} Transfer</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-lg font-extrabold">
            {shortPlace(from)} <ArrowRight className="h-5 w-5 text-accent" /> {shortPlace(to)}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-semibold text-white/75">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent" /> {pickup}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent" /> {dropoff}
            </span>
          </div>
        </section>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {[
            ["recommended", "Recommended"],
            ["price", "Lowest Price"],
            ["capacity", "Most Space"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSort(id as "recommended" | "price" | "capacity")}
              className={`h-11 min-w-[116px] rounded-full border px-4 text-sm font-extrabold ${
                sort === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {sorted.length === 0 && <div className="col-span-2 rounded-2xl bg-card p-5"><h2 className="font-extrabold text-primary">Try another vehicle</h2><p className="mt-2 text-sm text-muted-foreground">No matching vehicle has room for this group.</p><Link to={`/book?${params.toString()}`} className="mt-4 inline-block font-bold text-primary">Edit ride details</Link></div>}
          {sorted.map((trip) => (
            <Link
              key={trip.id}
              to={`/book/${trip.id}?${params.toString()}`}
              className="block overflow-hidden rounded-lg border border-border vehicle-white shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="vehicle-white relative h-36 overflow-hidden">
                <img src={trip.bus.imageUrl} alt={trip.bus.model} className="absolute inset-0 h-full w-full object-contain p-3 pt-8" />
                {recommendationLabel(service, trip.bus.id) && <span className="absolute left-2 top-2 rounded-lg bg-accent px-2 py-1 text-[9px] font-bold text-primary">{recommendationLabel(service, trip.bus.id)}</span>}
              </div>
              <div className="p-3">
                <h2 className="text-base font-extrabold text-primary">{trip.bus.name}</h2>
                <p className="mt-1 min-h-8 text-[11px] leading-4 text-muted-foreground">{trip.bus.model}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{trip.bus.capacity}</span><span className="flex items-center gap-1"><Luggage className="h-3.5 w-3.5" />{trip.bus.luggageCapacity}</span></div>
                <p className="mt-3 text-lg font-extrabold text-primary">{trip.quoteOnly ? "Fare unavailable" : `N$${trip.price}`}</p>
                <div className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-white">Select <ArrowRight className="h-3.5 w-3.5" /></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

const TimeBlock = ({ city, time, align = "left" }: { city: string; time: string; align?: "left" | "right" }) => (
  <div className={align === "right" ? "text-right" : ""}>
    <div className="text-xl font-extrabold text-primary">{time}</div>
    <div className="mt-1 text-[11px] font-bold uppercase text-muted-foreground">{city.slice(0, 8)}</div>
  </div>
);

const shortPlace = (value: string) => value.replace("Hosea Kutako International Airport", "HKIA");

const recommendedRank = (service: string): Record<string, number> => {
  if (service === "City") return { sedan: 0, "compact-suv": 1, suv: 2, "mini-bus": 3 };
  if (service === "Lodge") return { suv: 0, "compact-suv": 1, "mini-bus": 2, sedan: 3 };
  if (service === "Safari") return { suv: 0, "mini-bus": 1, "compact-suv": 2, sedan: 3 };
  return { sedan: 0, "compact-suv": 1, suv: 2, "mini-bus": 3 };
};

const recommendationLabel = (service: string, vehicleId: string) => {
  if (service === "City" && vehicleId === "sedan") return "Best for City";
  if (service === "Airport" && vehicleId === "sedan") return "Best Value";
  if (service === "Lodge" && vehicleId === "suv") return "Lodge Recommended";
  if (service === "Safari" && vehicleId === "suv") return "Safari Recommended";
  if (service === "Safari" && vehicleId === "mini-bus") return "Group Safari";
  return "";
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export default Results;
