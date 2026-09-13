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
  const service = params.get("service") || "Airport";
  const [sort, setSort] = useState<"recommended" | "price" | "capacity">("recommended");

  const sorted = createTransferOptions(from, to, pickupTime).sort((a, b) => {
    if (sort === "price") return (a.price || 99999) - (b.price || 99999);
    if (sort === "capacity") return b.bus.capacity - a.bus.capacity;
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
          <div className="mt-2 flex items-center gap-2 text-xl font-extrabold">
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

        <div className="mt-4 grid grid-cols-1 gap-4">
          {sorted.map((trip) => (
            <Link
              key={trip.id}
              to={`/book/${trip.id}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&passengers=${passengers}&date=${date}&pickupTime=${pickupTime}&pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`}
              className="block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-b from-[#f7f6f0] via-[#e9edf2] to-[#d9dee7]">
                <div className="absolute inset-x-5 bottom-12 h-12 rounded-full bg-black/15 blur-xl" />
                <img src={trip.bus.imageUrl} alt={`${trip.bus.name} vehicle`} className="absolute left-1/2 top-7 h-32 w-[118%] -translate-x-1/2 scale-[1.55] object-contain drop-shadow-2xl" />
                <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold text-accent-foreground shadow-sm">
                  {recommendationLabel(service, trip.bus.id) || trip.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-primary">
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground">Vehicle</p>
                    <h2 className="text-lg font-extrabold">{trip.bus.name}</h2>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-xs font-extrabold backdrop-blur shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {trip.bus.rating}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3">
                  <TimeBlock city={shortPlace(trip.from)} time={trip.departure} />
                  <div className="flex flex-1 flex-col items-center">
                    <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {trip.duration}
                    </div>
                    <div className="relative h-px w-full bg-border">
                      <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
                      <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
                    </div>
                  </div>
                  <TimeBlock city={shortPlace(trip.to)} time={trip.arrival} align="right" />
                </div>

                <div className="mt-4 rounded-xl bg-secondary p-3">
                  <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-primary">
                    <span>{trip.bus.model}</span>
                    <span>{trip.serviceType}</span>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">{trip.stops.join(" · ")}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {trip.bus.amenities.slice(0, 5).map((amenity) => (
                    <AmenityIcon key={amenity} a={amenity} />
                  ))}
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0 text-xs font-semibold text-muted-foreground">
                    <p className="mt-1 flex items-center gap-1 text-success">
                      <Users className="h-3.5 w-3.5" /> Up to {trip.bus.capacity} passengers
                    </p>
                    <p className="mt-1 flex items-center gap-1">
                      <Luggage className="h-3.5 w-3.5 text-primary" /> {trip.bus.luggageCapacity} luggage
                    </p>
                    <p className="mt-1 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Air-conditioned private transfer
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase text-muted-foreground">{trip.quoteOnly ? "Pricing" : "Starting from"}</p>
                    <p className="text-2xl font-extrabold text-primary">{trip.quoteOnly ? "Request Quote" : `N$${trip.price}`}</p>
                  </div>
                </div>

                <div className="mt-4 flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground">
                  Select Vehicle
                </div>
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
