import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AmenityIcon } from "@/components/Brand";
import { TopBar } from "@/components/TopBar";
import { TRIPS } from "@/data/trips";
import heroBus from "@/assets/hero-bus.jpg";
import { ArrowRight, Clock, MapPin, ShieldCheck, Star, Users } from "lucide-react";

const Results = () => {
  const [params] = useSearchParams();
  const from = params.get("from") || "Windhoek";
  const to = params.get("to") || "Oshakati";
  const date = params.get("date") || new Date().toISOString().slice(0, 10);
  const passengers = params.get("passengers") || "1";
  const pickup = params.get("pickup") || "CityLink Windhoek Terminal";
  const dropoff = params.get("dropoff") || "Oshakati Open Market";
  const [sort, setSort] = useState<"time" | "price" | "luxury">("time");

  const filtered = TRIPS.filter((trip) => trip.from === from && trip.to === to);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price") return a.price - b.price;
    if (sort === "luxury") return b.bus.rating - a.bus.rating;
    return a.departure.localeCompare(b.departure);
  });

  return (
    <div className="safe-page bg-background">
      <TopBar
        title={`${from} to ${to}`}
        subtitle={`${formatDate(date)} - ${passengers} passenger${passengers === "1" ? "" : "s"}`}
        back="/"
      />

      <main className="mx-auto max-w-md px-4 pt-4">
        <section className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <p className="text-[11px] font-extrabold uppercase text-white/70">Selected Journey</p>
          <div className="mt-2 flex items-center gap-2 text-xl font-extrabold">
            {from} <ArrowRight className="h-5 w-5 text-accent" /> {to}
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
            ["time", "Earliest"],
            ["price", "Cheapest"],
            ["luxury", "Luxury Only"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSort(id as "time" | "price" | "luxury")}
              className={`h-11 min-w-[108px] rounded-full border px-4 text-sm font-extrabold ${
                sort === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">No trips found for this route yet.</p>
            <Link
              to="/book"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-extrabold text-accent-foreground"
            >
              Modify Search
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {sorted.map((trip) => {
              const seatsLeft = trip.bus.capacity - trip.bookedSeats.length;
              return (
                <Link
                  key={trip.id}
                  to={`/book/${trip.id}?passengers=${passengers}&date=${date}`}
                  className="block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform active:scale-[0.99]"
                >
                  <div className="relative h-40">
                    <img src={heroBus} alt={trip.bus.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                    {trip.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold text-accent-foreground">
                        {trip.badge}
                      </span>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <p className="text-[11px] font-bold text-white/75">Coach</p>
                        <h2 className="text-lg font-extrabold">{trip.bus.name}</h2>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-white/18 px-2.5 py-1 text-xs font-extrabold backdrop-blur">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {trip.bus.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <TimeBlock city={trip.from} time={trip.departure} />
                      <div className="flex flex-1 flex-col items-center">
                        <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {trip.duration}
                        </div>
                        <div className="relative h-px w-full bg-border">
                          <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
                          <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
                        </div>
                      </div>
                      <TimeBlock city={trip.to} time={trip.arrival} align="right" />
                    </div>

                    <div className="mt-4 rounded-xl bg-secondary p-3">
                      <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-primary">
                        <span>Route stops</span>
                        <span>{trip.stops.length} stops</span>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">{trip.stops.join(" - ")}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {trip.bus.amenities.slice(0, 5).map((amenity) => (
                        <AmenityIcon key={amenity} a={amenity} />
                      ))}
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div className="min-w-0 text-xs font-semibold text-muted-foreground">
                        <p className="truncate">{trip.bus.model}</p>
                        <p className="mt-1 flex items-center gap-1 text-success">
                          <Users className="h-3.5 w-3.5" /> {seatsLeft} seats available
                        </p>
                        <p className="mt-1 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Safety checked
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold uppercase text-muted-foreground">Starting from</p>
                        <p className="text-3xl font-extrabold text-primary">N${trip.price}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground">
                      Select Journey
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const TimeBlock = ({ city, time, align = "left" }: { city: string; time: string; align?: "left" | "right" }) => (
  <div className={align === "right" ? "text-right" : ""}>
    <div className="text-2xl font-extrabold text-primary">{time}</div>
    <div className="mt-1 text-[11px] font-bold uppercase text-muted-foreground">{city.slice(0, 3)}</div>
  </div>
);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export default Results;
