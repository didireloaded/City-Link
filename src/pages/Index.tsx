import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Bus,
  CalendarClock,
  MapPin,
  Package,
  ShieldCheck,
  Snowflake,
  Star,
  Ticket,
  Wifi,
  Zap,
  Navigation,
  Coffee,
  HelpCircle,
  Sparkles,
  Compass,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/Brand";
import { loadProfile } from "@/lib/profile";
import heroBus from "@/assets/hero-bus.jpg";

const QUICK_SERVICES = [
  {
    title: "Book Coach Seats",
    desc: "Luxury 49-seat sleeper fleet across Namibia",
    icon: Bus,
    to: "/book",
    badge: "Instant Issue",
    primary: true,
  },
  {
    title: "Parcel Logistics",
    desc: "Fast city-to-city waybills & live GPS tracking",
    icon: Package,
    to: "/parcels",
    badge: "Same-Day",
  },
  {
    title: "VIP Lounge Pass",
    desc: "Free Wi-Fi, coffee bar & shower suites",
    icon: Coffee,
    to: "/lounge",
    badge: "Exclusive",
  },
  {
    title: "B1 Highway Map",
    desc: "Explore corridor terminals & live pricing",
    icon: Compass,
    to: "/route-map",
    badge: "Live GPS",
  },
];

const DESTINATIONS = [
  {
    name: "Oshakati & North",
    subtitle: "Daily Morning & Evening Express Runs",
    price: "350",
    from: "Windhoek",
    to: "Oshakati",
    tag: "Most Popular",
  },
  {
    name: "Swakopmund Coast",
    subtitle: "Non-stop Luxury Weekend Runs",
    price: "320",
    from: "Windhoek",
    to: "Swakopmund",
    tag: "Coastal Run",
  },
  {
    name: "Walvis Bay Terminal",
    subtitle: "Direct Corridor connection from capital",
    price: "330",
    from: "Windhoek",
    to: "Walvis Bay",
    tag: "Direct Run",
  },
  {
    name: "Windhoek Capital",
    subtitle: "Return sleeper journeys from all northern towns",
    price: "350",
    from: "Oshakati",
    to: "Windhoek",
    tag: "Capital Hub",
  },
];

const WHY_US = [
  { label: "Luxury Sleeper Coaches", sub: "Spacious reclining seats with extra legroom", icon: Bus },
  { label: "Free High-Speed Wi-Fi", sub: "Stay connected anywhere along the B1 highway", icon: Wifi },
  { label: "USB & 220V Charging", sub: "Power sockets at every single passenger seat", icon: Zap },
  { label: "Climate Control AC", sub: "Optimal cabin cooling regardless of desert heat", icon: Snowflake },
];

export const Index = () => {
  const navigate = useNavigate();
  const profile = loadProfile();
  const today = new Date().toISOString().slice(0, 10);
  const firstName = profile.name && profile.name !== "Guest user" ? profile.name.split(" ")[0] : "Traveler";

  const quickSearch = (from: string, to: string) => {
    navigate(`/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${today}&passengers=1&tripType=one-way`);
  };

  return (
    <div className="safe-page bg-background pb-32">
      {/* Top Header & Section 1: Premium Welcome */}
      <header className="relative overflow-hidden bg-gradient-to-b from-primary via-primary/96 to-background pt-6 pb-12 text-primary-foreground">
        {/* Soft Decorative Glows */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-accent blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-10 h-48 w-48 rounded-full bg-white blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-md px-5">
          <div className="mb-6 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2">
              <Link
                to="/route-map"
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                <Compass className="h-3.5 w-3.5 text-accent animate-spin" style={{ animationDuration: "10s" }} />
                <span>Corridor Map</span>
              </Link>
              <Link
                to="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md shadow-sm hover:bg-white/20"
              >
                <Bell className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="max-w-[340px] animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-extrabold text-accent mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Luxury Intercity Coaches 🇳🇦
            </div>
            <p className="text-sm font-extrabold text-white/80">Welcome back, {firstName}</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-[1.15] text-white">
              Experience Namibia in First-Class Comfort
            </h1>
            <p className="mt-2 text-xs font-semibold text-white/75 leading-relaxed">
              Explore daily non-stop luxury coach runs and real-time parcel logistics across the B1 & B2 highways.
            </p>
          </div>

          {/* Section 2: Active Corridor Status Banner */}
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground font-extrabold">
                  <MapPin className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success ring-2 ring-primary animate-ping" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-accent">Corridor Status</p>
                  <p className="text-xs font-extrabold text-white">All Northern & Coastal Routes Clear</p>
                  <p className="text-[10px] font-semibold text-white/70">On-time departure schedules active</p>
                </div>
              </div>
              <Link
                to="/book"
                className="rounded-xl bg-accent px-3.5 py-2 text-xs font-extrabold text-accent-foreground shadow-xs active:scale-95 transition-transform shrink-0"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-md px-4 -mt-4 space-y-6">
        {/* Section 3: Active Journey Callout Card (If Passenger has Ticket) */}
        <div className="rounded-3xl border border-accent/40 bg-gradient-to-r from-primary via-primary/95 to-secondary p-5 text-white shadow-[var(--shadow-elegant)] animate-fade-up">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-accent uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 animate-pulse" /> Next Departure Ready
            </span>
            <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-extrabold text-success">
              Confirmed
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-white/70">Windhoek Terminal ⇄ Northern Hub</p>
              <h3 className="text-lg font-extrabold text-white">Daily Sleeper Express</h3>
              <p className="text-xs font-semibold text-accent mt-0.5">Boarding passes available instantly offline</p>
            </div>
            <Link
              to="/tickets"
              className="flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-xs font-extrabold text-accent-foreground shadow-sm active:scale-95 transition-transform"
            >
              My Tickets
            </Link>
          </div>
        </div>

        {/* Section 4: Primary Bento Service Launcher */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              CityLink Services
            </h2>
            <Link to="/book" className="text-[11px] font-extrabold text-accent hover:underline flex items-center gap-1">
              <span>View All Timetables</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={srv.title}
                  to={srv.to}
                  className={`group relative overflow-hidden rounded-3xl border p-4 transition-all active:scale-[0.98] ${
                    srv.primary
                      ? "border-accent bg-accent text-accent-foreground shadow-[var(--shadow-glow)] col-span-2 sm:col-span-1"
                      : "border-border bg-card text-primary shadow-sm hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        srv.primary ? "bg-white/20 text-white" : "bg-secondary text-accent"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        srv.primary ? "bg-white/25 text-white" : "bg-accent/15 text-accent"
                      }`}
                    >
                      {srv.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold leading-tight">{srv.title}</h3>
                  <p
                    className={`mt-1 text-xs font-semibold leading-relaxed ${
                      srv.primary ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {srv.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section 5: Explore & Instant Book Destinations Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Explore Popular Routes
            </h2>
            <span className="text-[11px] font-bold text-muted-foreground">Tap to book instantly</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                onClick={() => quickSearch(dest.from, dest.to)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:border-accent active:scale-[0.99]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-extrabold text-muted-foreground mb-1.5">
                      {dest.tag}
                    </span>
                    <h3 className="text-base font-extrabold text-primary">{dest.name}</h3>
                    <p className="text-xs font-semibold text-muted-foreground">{dest.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">One-Way</p>
                    <p className="text-lg font-extrabold text-accent">N${dest.price}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-extrabold text-primary">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> {dest.from} → {dest.to}
                  </span>
                  <span className="flex items-center gap-1 text-accent group-hover:translate-x-1 transition-transform">
                    <span>Book Route</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Why CityLink (Modern Fleet Excellence Grid) */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-primary">The CityLink Fleet Standard</h3>
              <p className="text-[11px] font-semibold text-muted-foreground">Every journey includes first-class amenities</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {WHY_US.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-primary">
                    <Icon className="h-4 w-4 text-accent shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-muted-foreground leading-tight pl-6">
                    {item.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
