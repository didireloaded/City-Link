import { Link, useNavigate } from "react-router-dom";
import { Bell, CarTaxiFront, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import { Logo } from "@/components/Brand";
import { loadProfile } from "@/lib/profile";
import { VEHICLE_CATEGORIES } from "@/data/trips";

const SERVICES = ["All", "Airport", "City", "Lodge", "Safari"];

const SERVICE_ROUTES: Record<string, { from: string; to: string; pickup: string; dropoff: string }> = {
  All: {
    from: "Hosea Kutako International Airport",
    to: "Windhoek",
    pickup: "Arrivals Hall Meet & Greet",
    dropoff: "Hotel pickup",
  },
  Airport: {
    from: "Hosea Kutako International Airport",
    to: "Windhoek",
    pickup: "Arrivals Hall Meet & Greet",
    dropoff: "Hotel pickup",
  },
  City: {
    from: "Windhoek",
    to: "Windhoek West",
    pickup: "Hotel pickup",
    dropoff: "17 Hahnemann Street, Windhoek West",
  },
  Lodge: {
    from: "Windhoek",
    to: "Sossusvlei",
    pickup: "Hotel pickup",
    dropoff: "Lodge pickup",
  },
  Safari: {
    from: "Windhoek",
    to: "Etosha National Park",
    pickup: "Hotel pickup",
    dropoff: "Lodge pickup",
  },
};

export const Index = () => {
  const navigate = useNavigate();
  const profile = loadProfile();
  const today = new Date().toISOString().slice(0, 10);
  const firstName = profile.name && profile.name !== "Guest user" ? profile.name.split(" ")[0] : "Traveler";
  const homeFleet = VEHICLE_CATEGORIES.filter((vehicle) => ["sedan", "compact-suv", "suv"].includes(vehicle.id));

  const openResults = (service = "Airport") => {
    const route = SERVICE_ROUTES[service] || SERVICE_ROUTES.Airport;
    navigate(
      `/results?service=${encodeURIComponent(service)}&from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(
        route.to
      )}&date=${today}&pickupTime=14:30&passengers=1&pickup=${encodeURIComponent(route.pickup)}&dropoff=${encodeURIComponent(route.dropoff)}`
    );
  };

  return (
    <div className="safe-page bg-background pb-32">
      <main className="mx-auto max-w-md px-5 pt-6">
        <header className="flex items-center justify-between">
          <Logo />
          <Link
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary shadow-sm ring-1 ring-border"
            aria-label="Open profile"
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

          <button
            onClick={() => openResults("Airport")}
            className="mt-6 flex h-20 w-full items-center justify-between rounded-[28px] bg-card px-5 text-left shadow-sm ring-1 ring-border transition active:scale-[0.99]"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                <Search className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-extrabold text-primary">Where to?</span>
                <span className="block text-xs font-semibold text-muted-foreground">Airport, city or lodge transfer</span>
              </span>
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
              <SlidersHorizontal className="h-5 w-5" />
            </span>
          </button>
        </section>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {SERVICES.map((service, index) => (
            <button
              key={service}
              onClick={() => openResults(service)}
              className={`h-12 min-w-[92px] rounded-2xl px-5 text-sm font-extrabold transition active:scale-95 ${
                index === 0 ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)]" : "bg-card text-muted-foreground ring-1 ring-border"
              }`}
            >
              {service}
            </button>
          ))}
        </div>

        <section className="mt-4 grid grid-cols-2 gap-3">
          {homeFleet.map((vehicle, index) => (
            <button
              key={vehicle.id}
              onClick={() => openResults(index === 2 ? "Safari" : "Airport")}
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
                  <span className="text-lg font-extrabold text-primary">N${vehicle.airportWindhoekRate}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CarTaxiFront className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
