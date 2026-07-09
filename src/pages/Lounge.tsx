import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { TopBar } from "@/components/TopBar";
import { loadProfile } from "@/lib/profile";
import {
  Wifi,
  Coffee,
  ShowerHead,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Armchair,
} from "lucide-react";

export const Lounge = () => {
  const profile = loadProfile();
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const locations = [
    {
      name: "Windhoek Main Terminal Lounge",
      level: "Departure Hall, Level 2",
      status: "Open",
      hours: "05:00 - 23:00",
      city: "Windhoek",
      features: ["Shower", "Buffet", "Private Pods", "Barista Coffee"],
    },
    {
      name: "Oshakati VIP Hub",
      level: "VIP Transit Area, Suite 4",
      status: "Open",
      hours: "06:00 - 21:00",
      city: "Oshakati",
      features: ["High-Speed Wi-Fi", "Snacks", "Reclining Loungers"],
    },
    {
      name: "Swakopmund Coastal Sanctuary",
      level: "Terminal 1, North Wing",
      status: "Open",
      hours: "07:00 - 20:00",
      city: "Swakopmund",
      features: ["Ocean View", "Refreshments", "Workstations"],
    },
    {
      name: "Walvis Bay Express Lounge",
      level: "Central Station, Bay 2",
      status: "Closed",
      hours: "Opens at 06:30",
      city: "Walvis Bay",
      features: ["Coffee Bar", "Power Outlets", "Newspapers"],
    },
  ];

  const filteredLocations =
    selectedCity === "all"
      ? locations
      : locations.filter((l) => l.city.toLowerCase() === selectedCity.toLowerCase());

  const passPayload = JSON.stringify({
    pass: "CITYLINK-ELITE-LOUNGE-2026",
    holder: profile.name,
    tier: "VIP Platinum",
    validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
  });

  return (
    <div className="safe-page bg-background">
      <TopBar title="Elite Lounge Access" subtitle="VIP Pre-boarding Sanctuaries" back="/" />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-6">
        {/* Hero Card */}
        <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-[var(--shadow-elegant)] border border-white/10 animate-fade-up">
          <div className="absolute right-[-20px] top-[-20px] h-44 w-44 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-extrabold text-accent">
              <Sparkles className="h-3.5 w-3.5" /> VIP Platinum Pass
            </span>
            <span className="text-xs font-bold text-white/70">Unlimited Access</span>
          </div>

          <h2 className="mt-4 text-2xl font-extrabold leading-tight">
            Sanctuary of Comfort Before You Journey
          </h2>
          <p className="mt-2 text-sm font-semibold text-white/75">
            Complimentary access to all CityLink luxury lounges across Namibia with your QR ticket.
          </p>
        </section>

        {/* Digital Entry Pass & Status */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-5 animate-fade-up">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
                <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary">Access Granted</h3>
                <p className="text-xs font-semibold text-muted-foreground">Active for CityLink Elite Travelers</p>
              </div>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-extrabold text-primary uppercase">
              Live Pass
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <div className="rounded-2xl bg-secondary/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">
                Passenger
              </span>
              <span className="text-primary truncate block font-extrabold text-sm">
                {profile.name}
              </span>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">
                Valid Until
              </span>
              <span className="text-primary font-extrabold text-sm">
                31 Dec 2026
              </span>
            </div>
          </div>

          {/* QR Pass Box */}
          <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-secondary/40 to-secondary/80 p-5 text-center border border-border/50">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">
              Scan at Lounge Reception
            </p>
            <div className="rounded-2xl bg-white p-3.5 shadow-md">
              <QRCodeSVG value={passPayload} size={150} level="M" />
            </div>
            <p className="mt-3 font-mono text-xs font-bold text-primary">
              CL-ELITE-VIP-8842
            </p>
          </div>
        </section>

        {/* Premium Amenities Bento Grid */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground px-1">
            Complimentary Amenities
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <AmenityCard
              icon={<Wifi className="h-6 w-6 text-accent" />}
              title="High-Speed Wi-Fi"
              desc="Gigabit fiber connectivity"
            />
            <AmenityCard
              icon={<Coffee className="h-6 w-6 text-accent" />}
              title="Gourmet Bar & Buffet"
              desc="Hot beverages & fresh snacks"
            />
            <AmenityCard
              icon={<ShowerHead className="h-6 w-6 text-accent" />}
              title="Luxury Showers"
              desc="Refresh before long rides"
            />
            <AmenityCard
              icon={<Briefcase className="h-6 w-6 text-accent" />}
              title="Business Center"
              desc="Quiet desks & printing pods"
            />
          </div>
        </section>

        {/* Lounge Locations */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
              Lounge Locations
            </h3>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-1 text-xs font-extrabold text-primary outline-none focus:border-accent"
            >
              <option value="all">All Cities</option>
              <option value="windhoek">Windhoek</option>
              <option value="oshakati">Oshakati</option>
              <option value="swakopmund">Swakopmund</option>
              <option value="walvis bay">Walvis Bay</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredLocations.map((loc, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-primary">{loc.name}</h4>
                      <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                        {loc.level}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${loc.status === "Open"
                      ? "bg-success/15 text-success"
                      : "bg-secondary text-muted-foreground"
                      }`}
                  >
                    {loc.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
                  {loc.features.map((feat) => (
                    <span
                      key={feat}
                      className="rounded-lg bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-muted-foreground"
                    >
                      {feat}
                    </span>
                  ))}
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                    <Clock className="h-3 w-3" /> {loc.hours}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VIP Upgrade Banner */}
        <section className="rounded-2xl border border-accent/30 bg-accent/10 p-5 text-center">
          <Armchair className="mx-auto h-8 w-8 text-accent mb-2" />
          <h4 className="text-base font-extrabold text-primary">Traveling with Guest?</h4>
          <p className="mt-1 text-xs font-semibold text-muted-foreground max-w-xs mx-auto">
            You can bring up to 2 accompanying travel companions into any CityLink lounge for N$80 per guest.
          </p>
          <Link
            to="/book"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-6 text-xs font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
          >
            Book Next VIP Trip
          </Link>
        </section>
      </main>
    </div>
  );
};

const AmenityCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex flex-col items-start rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
      {icon}
    </div>
    <h4 className="text-sm font-extrabold text-primary leading-tight">{title}</h4>
    <p className="mt-1 text-xs font-semibold text-muted-foreground leading-tight">{desc}</p>
  </div>
);

export default Lounge;
