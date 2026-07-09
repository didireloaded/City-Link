import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Logo } from "@/components/Brand";
import { SearchCard } from "@/components/SearchCard";
import { POPULAR_ROUTES } from "@/data/trips";
import { loadProfile } from "@/lib/profile";
import heroBus from "@/assets/hero-bus.jpg";

const QUICK_ACTIONS = [
  { label: "Book Trip", sub: "Choose seat", icon: Bus, to: "/book", primary: true },
  { label: "Send Parcel", sub: "City to city", icon: Package, to: "/parcels?tab=send" },
  { label: "Track Parcel", sub: "Live status", icon: Navigation, to: "/track" },
  { label: "My Tickets", sub: "QR boarding", icon: Ticket, to: "/tickets" },
  { label: "VIP Lounge", sub: "Lounge pass", icon: Coffee, to: "/lounge" },
  { label: "Route Map", sub: "B1 highway", icon: Compass, to: "/route-map" },
  { label: "Help Hub", sub: "24/7 care", icon: HelpCircle, to: "/support" },
];

const WHY = [
  { label: "Luxury Coaches", sub: "Modern 49-seat sleeper fleet", icon: Bus },
  { label: "Free High-Speed WiFi", sub: "Stay connected across Namibia", icon: Wifi },
  { label: "USB & 220V Charging", sub: "Power at every seat", icon: Zap },
  { label: "Climate AC", sub: "Perfect temperature all trip", icon: Snowflake },
  { label: "Professional Drivers", sub: "99% On-time safety record", icon: ShieldCheck },
  { label: "Parcel Logistics", sub: "Fast city-to-city deliveries", icon: Package },
];

const PROMOS = [
  { title: "Student Discount", sub: "Save 5% on any route when booking with valid Student ID", tag: "Save 5%" },
  { title: "Senior Citizen Special", sub: "Travel in comfort with an automatic 8% discount", tag: "Save 8%" },
  { title: "Return Trip Savings", sub: "Book a return trip and unlock an instant 6% fare saving", tag: "Return -6%" },
  { title: "Weekend Coastal Express", sub: "Luxury non-stop runs between Windhoek and Walvis Bay", tag: "From N$320" },
];

export const Index = () => {
  const profile = loadProfile();
  const today = new Date().toISOString().slice(0, 10);
  const firstName = profile.name && profile.name !== "Guest user" ? profile.name.split(" ")[0] : "John";

  return (
    <div className="safe-page bg-background pb-28">
      {/* Top Header & Section 1: Premium Welcome */}
      <header className="relative overflow-hidden bg-gradient-to-b from-primary via-primary/95 to-background pt-6 pb-12 text-primary-foreground">
        {/* Soft Decorative Map & Gradient Hero Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
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
                <span>B1 Map</span>
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
              <Sparkles className="h-3.5 w-3.5" /> CityLink Modern Luxury Coaches
            </div>
            <p className="text-sm font-extrabold text-white/80">Good Morning, {firstName}</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-[1.1] text-white">
              Where are you travelling today?
            </h1>
            <p className="mt-2 text-xs font-semibold text-white/75">
              Luxury coach travel and fast parcel logistics across Namibia.
            </p>
          </div>

          {/* Section 2: Location Map Hero Centerpiece Banner */}
          <Link
            to="/route-map"
            className="mt-6 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md shadow-md transition-all hover:bg-white/15"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <MapPin className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success ring-2 ring-primary animate-ping" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-accent">Active User Corridor</p>
                <p className="text-xs font-extrabold text-white">Windhoek Central Corridor · B1 Highway Hub</p>
                <p className="text-[10px] font-semibold text-white/70">Tap to explore checkpoints & live pricing</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-white/80" />
          </Link>
        </div>
      </header>

      {/* Section 3: Main Booking Card (70% Attention Focus, Overlapping Hero) */}
      <main className="relative z-10 mx-auto max-w-md px-4 -mt-6">
        <div className="animate-fade-up">
          <SearchCard />
        </div>

        {/* Section 4: Quick Actions Grid */}
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">
            Quick Actions & Logistics
          </h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
            {QUICK_ACTIONS.slice(0, 4).map(({ label, sub, icon: Icon, to, primary }) => (
              <Link
                key={label}
                to={to}
                className={`flex min-h-[96px] flex-col items-center justify-center rounded-2xl border p-2 text-center transition-transform active:scale-95 ${
                  primary
                    ? "border-accent bg-accent text-accent-foreground shadow-[var(--shadow-glow)]"
                    : "border-border bg-card text-primary shadow-sm hover:border-accent/40"
                }`}
              >
                <Icon className="mb-2 h-5 w-5" />
                <span className="text-xs font-extrabold leading-tight">{label}</span>
                <span className={`mt-0.5 text-[10px] leading-tight ${primary ? "text-white/80" : "text-muted-foreground"}`}>
                  {sub}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.slice(4).map(({ label, sub, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex h-16 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 text-left shadow-2xs hover:border-accent/40 transition-transform active:scale-95"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-primary truncate">{label}</div>
                  <div className="text-[10px] font-semibold text-muted-foreground truncate">{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5: Our Luxury Coach Fleet · Tap Your Coach to Book */}
        <SectionTitle
          title="Our Luxury Fleet · Tap to Book"
          action="View All Classes"
          to={`/results?from=Windhoek&to=Oshakati&date=${today}&passengers=1&tripType=one-way`}
        />
        <section className="-mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {[
            {
              id: "t1",
              name: "City-Link Luxury Sleeper #1",
              model: "Scania K410 Sleeper Coach",
              route: "Oshakati → Windhoek",
              price: 360,
              rating: 4.9,
              badge: "Sleeper Class",
              badgeColor: "bg-accent text-accent-foreground",
              features: ["Individual Reclining Sleeper", "Free Wi-Fi", "USB Fast Charge", "Dinner Service"],
            },
            {
              id: "t2",
              name: "City-Link Executive #2",
              model: "Irizar i6S Premium Coach",
              route: "Windhoek → Oshakati",
              price: 360,
              rating: 4.9,
              badge: "Executive Express",
              badgeColor: "bg-success text-white",
              features: ["Extra Legroom Pair", "Snack Service", "Onboard Toilet", "Gigabit Wi-Fi"],
            },
            {
              id: "t4",
              name: "City-Link Platinum Pod #3",
              model: "Volvo B11R Double Decker",
              route: "Ongwediva → Windhoek",
              price: 360,
              rating: 5.0,
              badge: "VIP Platinum",
              badgeColor: "bg-primary text-primary-foreground border border-accent",
              features: ["Privacy Curtains", "Barista Coffee", "Work Tables", "Panoramic View"],
            },
          ].map((bus) => (
            <Link
              key={bus.id}
              to={`/book/${bus.id}?passengers=1&date=${today}`}
              className="min-w-[270px] max-w-[280px] rounded-3xl border border-border bg-card p-4 shadow-sm hover:border-accent/60 transition-all group shrink-0 flex flex-col justify-between"
            >
              <div>
                <div className="mb-3.5 h-36 overflow-hidden rounded-2xl relative">
                  <img
                    src={heroBus}
                    alt={bus.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className={`absolute top-2.5 left-2.5 rounded-full px-3 py-1 text-[10px] font-extrabold shadow-md ${bus.badgeColor}`}>
                    {bus.badge}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[10px] font-bold text-white/75">{bus.route}</p>
                      <h4 className="text-sm font-extrabold truncate">{bus.name}</h4>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-extrabold backdrop-blur-md">
                      ★ {bus.rating}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-extrabold text-primary">{bus.model}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {bus.features.map((feat) => (
                    <span
                      key={feat}
                      className="rounded-lg bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground">Fixed Fare</span>
                  <p className="text-base font-extrabold text-primary">N${bus.price}</p>
                </div>
                <span className="flex items-center gap-1 rounded-xl bg-accent px-3.5 py-2 text-xs font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] group-hover:scale-105 transition-transform">
                  Book Coach <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* Section 6: Popular Routes */}
        <SectionTitle
          title="Popular Routes"
          action="View All Routes"
          to={`/results?from=Windhoek&to=Oshakati&date=${today}&passengers=1&tripType=one-way`}
        />
        <section className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {POPULAR_ROUTES.map((route) => (
            <Link
              key={`${route.from}-${route.to}`}
              to={`/results?from=${route.from}&to=${route.to}&date=${today}&passengers=1&tripType=one-way`}
              className="min-w-[240px] rounded-3xl border border-border bg-card p-4 shadow-sm hover:border-accent/50 transition-all group"
            >
              <div className="mb-3.5 h-28 overflow-hidden rounded-2xl relative">
                <img
                  src={heroBus}
                  alt="CityLink luxury coach"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-md">
                  {route.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-extrabold text-primary">
                {route.from} <ArrowRight className="h-4 w-4 text-accent" /> {route.to}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground">Starting at</span>
                  <p className="text-base font-extrabold text-primary">N${route.price}</p>
                </div>
                <span className="rounded-xl bg-accent/15 px-3 py-1 text-xs font-extrabold text-accent">
                  Book Now
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* Section 6: Why Travel With CityLink */}
        <SectionTitle title="Why Travel With CityLink" />
        <section className="grid grid-cols-2 gap-3">
          {WHY.map(({ label, sub, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xs font-extrabold text-primary">{label}</h3>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground leading-relaxed">{sub}</p>
            </div>
          ))}
        </section>

        {/* Section 7: Live Company Stats */}
        <section className="mt-6 grid grid-cols-4 gap-2 rounded-3xl bg-primary p-5 text-center text-primary-foreground shadow-[var(--shadow-elegant)] border border-white/10">
          <Stat value="25+" label="Destinations" />
          <Stat value="120+" label="Weekly Trips" />
          <Stat value="4.9" label="Rating Score" />
          <Stat value="50k+" label="Passengers" />
        </section>

        {/* Section 8: Promotions Carousel */}
        <SectionTitle title="Promotions & Discounts" />
        <section className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {PROMOS.map((promo) => (
            <div
              key={promo.title}
              className="min-w-[240px] rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/10 via-accent/5 to-card p-5 shadow-sm"
            >
              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold text-accent-foreground shadow-2xs">
                {promo.tag}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-primary">{promo.title}</h3>
              <p className="mt-1.5 text-xs font-semibold text-muted-foreground leading-relaxed">{promo.sub}</p>
            </div>
          ))}
        </section>

        {/* Section 9: Recent / Upcoming Bookings */}
        <SectionTitle title="Recent Bookings & Passes" />
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-extrabold text-success uppercase">
                Confirmed Journey
              </span>
              <h3 className="mt-1.5 text-lg font-extrabold text-primary">Windhoek to Oshakati</h3>
              <p className="mt-1 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <CalendarClock className="h-4 w-4 text-accent" /> Seat 12A · Luxury Sleeper #CL-01
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-extrabold text-primary">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" /> 4.9
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              to="/tickets"
              className="flex h-11 items-center justify-center rounded-xl bg-primary text-xs font-extrabold text-primary-foreground shadow-sm active:scale-95 transition-transform"
            >
              View Digital Ticket
            </Link>
            <Link
              to="/track?id=CL-402"
              className="flex h-11 items-center justify-center rounded-xl border border-border bg-card text-xs font-extrabold text-primary shadow-2xs active:scale-95 transition-transform hover:border-accent"
            >
              Track Coach GPS
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

const SectionTitle = ({ title, action, to }: { title: string; action?: string; to?: string }) => (
  <div className="mb-3 mt-8 flex items-center justify-between px-1">
    <h2 className="text-base font-extrabold text-primary">{title}</h2>
    {action && to && (
      <Link to={to} className="text-xs font-extrabold text-accent hover:underline flex items-center gap-1">
        {action} <ArrowRight className="h-3 w-3" />
      </Link>
    )}
  </div>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="text-xl font-extrabold text-white">{value}</div>
    <div className="mt-1 text-[10px] font-bold text-white/70">{label}</div>
  </div>
);

export default Index;
