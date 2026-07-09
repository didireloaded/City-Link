import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { SearchCard } from "@/components/SearchCard";
import { loadProfile } from "@/lib/profile";
import { POPULAR_ROUTES } from "@/data/trips";
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import heroBus from "@/assets/hero-bus.jpg";

export const BookingPortal = () => {
  const navigate = useNavigate();
  const profile = loadProfile();
  const savedRoutes = profile.savedRoutes || [];
  const today = new Date().toISOString().slice(0, 10);

  const quickSearch = (from: string, to: string) => {
    navigate(`/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${today}&passengers=1&tripType=one-way`);
  };

  return (
    <div className="safe-page bg-background pb-32">
      <TopBar
        title="Coach Search & Booking"
        subtitle="Select route, travel date & passengers"
        back="/"
      />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-6 animate-fade-up">
        {/* Active Corridor & Guarantee Header */}
        <section className="rounded-3xl border border-border bg-card p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent font-extrabold">
              <Bus className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent block">
                Live Inventory Active
              </span>
              <p className="text-xs font-extrabold text-primary truncate">
                Windhoek ⇄ Northern & Coastal Corridors
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-extrabold text-success uppercase">
            Instant Issue
          </span>
        </section>

        {/* Primary Interactive Search Card */}
        <section className="relative z-20">
          <SearchCard />
        </section>

        {/* Saved Favorite Routes (If Any) */}
        {savedRoutes.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" /> Your Saved Routes
              </h3>
              <Link to="/profile" className="text-[11px] font-extrabold text-accent hover:underline">
                Manage
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {savedRoutes.map((r, i) => (
                <button
                  key={i}
                  onClick={() => quickSearch(r.from, r.to)}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 shadow-xs hover:border-accent active:scale-[0.99] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-primary flex items-center gap-2">
                        <span>{r.from}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-accent" />
                        <span>{r.to}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        Tap for instant seat & timetable check
                      </span>
                    </div>
                  </div>
                  <span className="rounded-xl bg-accent px-3 py-1.5 text-xs font-extrabold text-accent-foreground shadow-xs">
                    Search Now
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Popular Express Corridors with Coach Photos */}
        <section className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">
            Popular Express Corridors & Coach Class
          </h3>
          <div className="space-y-3">
            {POPULAR_ROUTES.map((route, idx) => (
              <div
                key={`${route.from}-${route.to}`}
                onClick={() => quickSearch(route.from, route.to)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:border-accent active:scale-[0.99]"
              >
                {/* Coach Preview Banner */}
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src={heroBus}
                    alt="CityLink Luxury Sleeper Coach"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <span className="rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-extrabold text-accent-foreground shadow-sm">
                      {idx === 0 ? "Platinum Marcopolo G8" : idx === 1 ? "Scania Sleeper Cruiser" : "Executive 2+1 Coach"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-white/90">
                      <Sparkles className="h-3 w-3 text-accent" /> 49 Sleeper Recliners
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-base font-extrabold text-primary">
                        <span>{route.from}</span>
                        <ArrowRight className="h-4 w-4 text-accent" />
                        <span>{route.to}</span>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">{route.duration} • Luxury Sleeper</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">One-Way</p>
                    <p className="text-lg font-extrabold text-primary">N${route.price}</p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3 text-[11px] font-extrabold text-muted-foreground">
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 20kg Checked Luggage Included
                  </span>
                  <span className="flex items-center gap-1 text-accent">
                    <span>Select Seats</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BookingPortal;
