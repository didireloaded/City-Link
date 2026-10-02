import { lazy, Suspense, useState } from "react";
import { bookingLink, serviceDefaults } from "@/lib/transfer-service";
import { Link, useNavigate } from "react-router-dom";
import { Bell, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Logo } from "@/components/Brand";
import { useProfile } from "@/hooks/useProfile";
const HomeMap = lazy(() => import("@/components/HomeMap"));

const SERVICES = ["All", "Airport", "City", "Lodge", "Safari"];

export const Index = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("All");
  const [passengers, setPassengers] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { profile } = useProfile();
  const firstName = profile.name && profile.name !== "Guest user" ? profile.name.split(" ")[0] : "Traveler";

  return (
    <div className="safe-page bg-background pb-32">
      <main className="mx-auto max-w-md px-5 pt-6">
        <header className="flex items-center justify-between">
          <Logo />
          <Link
            to="/notifications"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary shadow-sm ring-1 ring-border"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>
        </header>

        <section className="mt-6">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            <span>Windhoek</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-primary">Hello {firstName}!</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Book a private City Cab transfer.</p>

          <div className="mt-6 flex h-20 w-full items-center gap-2 rounded-[28px] bg-card px-4 shadow-sm ring-1 ring-border">
            <button onClick={() => navigate(`${bookingLink(selectedService)}&passengers=${passengers}`)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <span><span className="block text-base font-extrabold text-primary">Where to?</span><span className="block text-xs text-muted-foreground">Choose your pickup and destination</span></span>
            </button>
            <button aria-label="Filter vehicles" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><SlidersHorizontal className="h-5 w-5" /></button>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-5 gap-1.5">
          {SERVICES.map((service) => (
            <button
              key={service}
              aria-pressed={selectedService === service}
              onClick={() => setSelectedService(service)}
              className={`h-11 min-w-0 rounded-xl px-1 text-xs font-extrabold transition active:scale-95 ${
                selectedService === service ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)]" : "bg-card text-muted-foreground ring-1 ring-border"
              }`}
            >
              {service}
            </button>
          ))}
        </div>

        {filtersOpen && <label className="mt-4 flex items-center justify-between rounded-2xl bg-card p-4 text-sm font-bold">Passengers<select aria-label="Minimum passenger capacity" value={passengers} onChange={event => setPassengers(Number(event.target.value))} className="rounded-lg p-2">{[1,2,3,4,6,12].map(count => <option key={count} value={count}>{count}</option>)}</select></label>}
        <Suspense fallback={<div className="mt-4 h-96 rounded-2xl bg-secondary" />}><HomeMap service={selectedService} /></Suspense>
      </main>
    </div>
  );
};

export default Index;
