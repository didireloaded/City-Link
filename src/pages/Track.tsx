import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CarTaxiFront, CheckCircle2, Clock, Compass, MapPin, MessageSquare, Navigation, PhoneCall, Radio, Search, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { TransferIsland } from "@/components/TransferIsland";
import { toast } from "sonner";

const statuses = [
  "Booking Confirmed",
  "Driver Assigned",
  "Driver Heading to Pickup",
  "Driver Arrived",
  "Passenger Onboard",
  "On the Way",
  "Arrived",
  "Completed",
];

export const Track = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("id") || "WCC-2407");
  const [step, setStep] = useState(2);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const upper = query.trim().toUpperCase();
    setParams({ id: upper });
    toast.success(`Loading transfer ${upper}`);
  };

  return (
    <div className="safe-page bg-background pb-28">
      <TopBar title="Track Transfer" subtitle="Driver, vehicle and pickup status" back="/" />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-5">
        <TransferIsland />

        <section className="relative overflow-hidden rounded-3xl border border-border bg-primary p-5 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-success ring-2 ring-white/30 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-white/90">
                Driver Assigned
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-extrabold text-success border border-success/30">
              <Radio className="h-3 w-3 animate-pulse" /> Connected
            </span>
          </div>

          <div className="my-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-white/80">
              <span>Pickup</span>
              <span className="text-accent font-extrabold">Private Transfer</span>
              <span>Destination</span>
            </div>

            <div className="relative h-3 w-full rounded-full bg-white/15 overflow-hidden">
              <div className="h-full bg-accent transition-all duration-1000 rounded-full shadow-[0_0_12px_hsl(var(--accent))]" style={{ width: `${Math.min(100, step * 12)}%` }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-accent animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-xs font-extrabold">ETA 24 min</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                <ShieldCheck className="h-4 w-4" /> City Cab verified
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 animate-fade-up">
          <form onSubmit={search} className="flex gap-2 pb-2 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value.toUpperCase())} placeholder="Enter transfer ref" className="h-12 w-full rounded-xl border border-border bg-input pl-10 pr-3 text-xs font-extrabold uppercase outline-none focus:border-accent" />
            </div>
            <button type="submit" className="h-12 rounded-xl bg-accent px-5 text-xs font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] active:scale-95 transition-transform">
              Track
            </button>
          </form>

          <div className="flex items-start justify-between border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Transfer Reference</span>
              <h3 className="text-xl font-extrabold text-primary mt-0.5">{query}</h3>
              <p className="text-xs font-semibold text-muted-foreground">HKIA Arrivals Hall to Windhoek West</p>
            </div>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-extrabold text-success">
              {statuses[step]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Info icon={<Compass className="h-3.5 w-3.5 text-accent" />} label="Driver">
              Johannes Mwafangeyo
            </Info>
            <Info icon={<Clock className="h-3.5 w-3.5 text-accent" />} label="Vehicle">
              Toyota Fortuner · N 123-456 W
            </Info>
          </div>

          <div className="space-y-2">
            {statuses.slice(0, 7).map((status, index) => (
              <button
                type="button"
                key={status}
                onClick={() => setStep(index)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                  index <= step ? "border-accent/30 bg-accent/10" : "border-border bg-secondary/30"
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${index <= step ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="text-xs font-extrabold text-primary">{status}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Assigned Driver</p>
                <p className="text-sm font-extrabold text-primary">Johannes Mwafangeyo</p>
                <p className="text-xs font-semibold text-muted-foreground">SUV · Toyota Fortuner · N 123-456 W</p>
              </div>
              <CarTaxiFront className="h-8 w-8 text-accent" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a href="tel:+264812572188" className="flex h-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm active:scale-95">
                <PhoneCall className="h-4 w-4" />
              </a>
              <a href="https://wa.me/264812572188" target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center rounded-xl bg-success/20 text-success shadow-sm active:scale-95">
                <MessageSquare className="h-4 w-4" />
              </a>
              <a href="https://wa.me/264812572188" target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center rounded-xl bg-secondary text-xs font-extrabold text-primary shadow-sm active:scale-95">
                Help
              </a>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground border-t border-border pt-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Live location appears only when driver data is available.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

const Info = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="rounded-2xl bg-secondary/60 p-3.5">
    <span className="text-[10px] font-extrabold uppercase text-muted-foreground flex items-center gap-1">
      {icon} {label}
    </span>
    <p className="mt-1 text-xs font-extrabold text-primary leading-tight">{children}</p>
  </div>
);

export default Track;
