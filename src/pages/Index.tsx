import { useState } from "react";
import { bookingLink, serviceDefaults } from "@/lib/transfer-service";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CarTaxiFront, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import { Logo } from "@/components/Brand";
import { loadProfile } from "@/lib/profile";
import { VEHICLE_CATEGORIES } from "@/data/trips";

const SERVICES = ["All", "Airport", "City", "Lodge", "Safari"];

export const Index = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("All");
  const [passengers, setPassengers] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const profile = loadProfile();
  const firstName = profile.name && profile.name !== "Guest user" ? profile.name.split(" ")[0] : "Traveler";
  const homeFleet = VEHICLE_CATEGORIES.filter((vehicle) => (selectedService === "All" ? ["sedan", "compact-suv", "suv"] : serviceDefaults[selectedService].vehicles).includes(vehicle.id) && vehicle.capacity >= passengers);

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

        <section className="mt-8">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            <span>Windhoek</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-primary">Hello {firstName}!</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Book a private City Cab transfer.</p>

          <div className="mt-6 flex h-20 w-full items-center gap-2 rounded-[28px] bg-card px-4 shadow-sm ring-1 ring-border">
            <button onClick={() => navigate(bookingLink(selectedService))} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <span><span className="block text-base font-extrabold text-primary">Where to?</span><span className="block text-xs text-muted-foreground">Choose your pickup and destination</span></span>
            </button>
            <button aria-label="Filter vehicles" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><SlidersHorizontal className="h-5 w-5" /></button>
          </div>
        </section>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {SERVICES.map((service) => (
            <button
              key={service}
              aria-pressed={selectedService === service}
              onClick={() => setSelectedService(service)}
              className={`h-12 min-w-[92px] rounded-2xl px-5 text-sm font-extrabold transition active:scale-95 ${
                selectedService === service ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)]" : "bg-card text-muted-foreground ring-1 ring-border"
              }`}
            >
              {service}
            </button>
          ))}
        </div>

        {filtersOpen && <label className="mt-4 flex items-center justify-between rounded-2xl bg-card p-4 text-sm font-bold">Passengers<select aria-label="Minimum passenger capacity" value={passengers} onChange={event => setPassengers(Number(event.target.value))} className="rounded-lg p-2">{[1,2,3,4,6,12].map(count => <option key={count} value={count}>{count}</option>)}</select></label>}
        <section className="mt-4 grid grid-cols-2 gap-3">
          {homeFleet.map((vehicle, index) => (
            <button
              key={vehicle.id}
              onClick={() => navigate(bookingLink(selectedService, vehicle.id))}
              className={`group overflow-hidden rounded-[26px] text-left shadow-sm ring-1 ring-border transition active:scale-[0.99] ${
                index === 0 ? "col-span-2 bg-accent text-accent-foreground" : "bg-card text-primary"
              }`}
            >
              <div className={`${index === 0 ? "h-56" : "h-36"} relative overflow-hidden bg-gradient-to-b from-white to-secondary`}>
                <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-primary/15 blur-xl" />
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.model} vehicle`}
                  className={`absolute left-1/2 object-contain drop-shadow-2xl transition duration-500 group-hover:scale-[1.5] ${
                    index === 0
                      ? "top-16 h-32 w-[120%] -translate-x-1/2 scale-[1.4]"
                      : "top-11 h-20 w-[145%] -translate-x-1/2 scale-[1.45]"
                  }`}
                />
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-xs font-extrabold text-primary shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  {vehicle.rating}
                </span>
              </div>
              <div className={index === 0 ? "p-5" : "p-4"}>
                <p className="text-[10px] font-extrabold uppercase text-primary/55">City Cab Fleet</p>
                <h2 className={index === 0 ? "mt-1 text-3xl font-extrabold text-primary" : "mt-1 text-xl font-extrabold text-primary"}>
                  {vehicle.name}
                </h2>
                <p className="mt-1 text-xs font-bold text-muted-foreground">{vehicle.model}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-primary">{selectedService === "Airport" ? `N${vehicle.airportWindhoekRate}` : "Get quote"}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CarTaxiFront className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </section>
      <section className="mt-6"><h2 className="text-lg font-extrabold text-primary">Popular destinations</h2><div className="mt-3 grid grid-cols-2 gap-3">{["Airport","City","Lodge","Safari"].map(service => <button key={service} onClick={() => navigate(bookingLink(service))} className="rounded-2xl bg-card p-4 text-left"><MapPin className="mb-3 h-5 w-5 text-accent" /><span className="block text-sm font-extrabold text-primary">{service === "Airport" ? "Hosea Kutako" : serviceDefaults[service].to}</span><span className="text-xs text-muted-foreground">{service} transfer</span></button>)}</div></section>
      </main>
    </div>
  );
};

export default Index;
