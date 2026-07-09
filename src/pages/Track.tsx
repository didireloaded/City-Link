import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Package,
  Search,
  Bus,
  ShieldCheck,
  PhoneCall,
  Clock,
  Compass,
  Navigation,
  MessageSquare,
  Sparkles,
  Radio,
  RefreshCw,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { ParcelTracker } from "@/components/ParcelTracker";
import { toast } from "sonner";

interface LiveTripGPS {
  id: string;
  route: string;
  busName: string;
  driver: string;
  driverPhone: string;
  speed: number;
  currentCheckpoint: string;
  nextCheckpoint: string;
  etaMinutes: number;
  onTimeStatus: string;
  latLong: string;
  progressPercent: number;
}

const DEMO_TRIPS: Record<string, LiveTripGPS> = {
  "CL-402": {
    id: "CL-402",
    route: "Windhoek → Oshakati",
    busName: "CL-01 (Luxury Sleeper)",
    driver: "Johannes Mwafangeyo",
    driverPhone: "0818767676",
    speed: 96,
    currentCheckpoint: "Otjiwarongo Total Highway Hub",
    nextCheckpoint: "Ondangwa Sun Square Terminal",
    etaMinutes: 105,
    onTimeStatus: "On Time (99% Reliability Score)",
    latLong: "-20.4637° S, 16.6533° E",
    progressPercent: 68,
  },
  "CL-109": {
    id: "CL-109",
    route: "Ondangwa → Windhoek",
    busName: "CL-03 (Executive Coach)",
    driver: "Andreas Shikongo",
    driverPhone: "0818767676",
    speed: 98,
    currentCheckpoint: "Okahandja B1 North Checkpoint",
    nextCheckpoint: "Windhoek Bahnhof Street Terminal",
    etaMinutes: 45,
    onTimeStatus: "On Time · Arriving Ahead of Schedule",
    latLong: "-21.9833° S, 16.9167° E",
    progressPercent: 86,
  },
};

export const Track = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("id") || "CP-2026-8842");
  const [trackType, setTrackType] = useState<"coach" | "parcel">(() => {
    const q = params.get("id") || "CP-2026-8842";
    const upper = q.toUpperCase();
    return upper.startsWith("CL") ? "coach" : "parcel";
  });
  const [liveTrip, setLiveTrip] = useState<LiveTripGPS | null>(DEMO_TRIPS["CL-402"]);

  useEffect(() => {
    const q = params.get("id") || "CP-2026-8842";
    setQuery(q);
    const upper = q.toUpperCase();
    if (upper.startsWith("CL")) {
      setTrackType("coach");
      setLiveTrip(DEMO_TRIPS[upper] || DEMO_TRIPS["CL-402"]);
    } else {
      setTrackType("parcel");
    }
  }, [params]);

  const handleCoachSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const upper = query.trim().toUpperCase();
    setParams({ id: upper });
    setTrackType("coach");
    setLiveTrip(
      DEMO_TRIPS[upper] || {
        ...DEMO_TRIPS["CL-402"],
        id: upper,
        route: "Windhoek → Northern Express",
      }
    );
    toast.success(`Loading live GPS tracking for Coach ${upper}`);
  };

  return (
    <div className="safe-page bg-background pb-28">
      <TopBar title="Live GPS & Parcel Tracking" subtitle="Real-Time Highway & Network Status" back="/" />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-5">
        {/* Toggle Box */}
        <section className="rounded-3xl border border-border bg-card p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => {
                setTrackType("parcel");
                setQuery("CP-2026-8842");
                setParams({ id: "CP-2026-8842" });
              }}
              className={`h-11 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                trackType === "parcel" ? "bg-card text-primary shadow-sm scale-[1.02]" : "text-muted-foreground"
              }`}
            >
              <Package className="h-4 w-4 text-accent" /> Parcel Tracking ID
            </button>
            <button
              type="button"
              onClick={() => {
                setTrackType("coach");
                setQuery("CL-402");
                setParams({ id: "CL-402" });
              }}
              className={`h-11 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                trackType === "coach" ? "bg-card text-primary shadow-sm scale-[1.02]" : "text-muted-foreground"
              }`}
            >
              <Bus className="h-4 w-4 text-accent" /> Coach GPS Tracker
            </button>
          </div>
        </section>

        {/* Live Status Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-primary p-5 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-success ring-2 ring-white/30 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-white/90">
                {trackType === "coach" ? "Live Coach Journey" : "Live Parcel Tracking"}
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-extrabold text-success border border-success/30">
              <Radio className="h-3 w-3 animate-pulse" /> Connected
            </span>
          </div>

          <div className="my-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-white/80">
              <span>Origin</span>
              <span className="text-accent font-extrabold">Direct Express Route</span>
              <span>Destination</span>
            </div>

            <div className="relative h-3 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-1000 rounded-full shadow-[0_0_12px_hsl(var(--accent))]"
                style={{ width: trackType === "coach" ? `${liveTrip?.progressPercent || 68}%` : "75%" }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-accent animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-xs font-extrabold">
                  {trackType === "coach" ? `${liveTrip?.speed || 96} km/h` : "Express Coach Parcel Network"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                <ShieldCheck className="h-4 w-4" /> Verified Partner
              </div>
            </div>
          </div>
        </section>

        {/* PARCEL TRACKING PORTAL (Using our new exact ParcelTracker) */}
        {trackType === "parcel" && (
          <div className="animate-fade-up">
            <ParcelTracker initialCode={query.startsWith("CL") ? "CP-2026-8842" : query} />
          </div>
        )}

        {/* COACH TRACKING DETAILS */}
        {trackType === "coach" && liveTrip && (
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 animate-fade-up">
            <form onSubmit={handleCoachSearch} className="flex gap-2 pb-2 border-b border-border">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  placeholder="Enter Trip ID (e.g. CL-402)"
                  className="h-12 w-full rounded-xl border border-border bg-input pl-10 pr-3 text-xs font-extrabold uppercase outline-none focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-xl bg-accent px-5 text-xs font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] active:scale-95 transition-transform"
              >
                Track
              </button>
            </form>

            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Coach Journey ID</span>
                <h3 className="text-xl font-extrabold text-primary mt-0.5">{liveTrip.id}</h3>
                <p className="text-xs font-semibold text-muted-foreground">{liveTrip.route}</p>
              </div>
              <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-extrabold text-success">
                {liveTrip.onTimeStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-secondary/60 p-3.5">
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-accent" /> Checkpoint
                </span>
                <p className="mt-1 text-xs font-extrabold text-primary leading-tight">{liveTrip.currentCheckpoint}</p>
              </div>
              <div className="rounded-2xl bg-secondary/60 p-3.5">
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-accent" /> Next Stop ETA
                </span>
                <p className="mt-1 text-xs font-extrabold text-primary leading-tight">
                  {liveTrip.nextCheckpoint} ({liveTrip.etaMinutes} min)
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Assigned Driver</p>
                  <p className="text-sm font-extrabold text-primary">{liveTrip.driver}</p>
                  <p className="text-xs font-semibold text-muted-foreground">Coach: {liveTrip.busName}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${liveTrip.driverPhone}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm active:scale-95"
                    title="Call Driver / Dispatch"
                  >
                    <PhoneCall className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => toast.success("Dispatch status update sent to your WhatsApp!")}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20 text-success shadow-sm active:scale-95"
                    title="WhatsApp Dispatch"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground border-t border-border pt-2 flex items-center gap-1.5">
                📍 Coach Location: {liveTrip.currentCheckpoint}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Track;
