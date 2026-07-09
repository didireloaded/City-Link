import { MapPin, Navigation } from "lucide-react";

export const MapBackground = () => {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden bg-[var(--gradient-map)]">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[-12%] top-[36%] h-8 w-[130%] rotate-[13deg] rounded-full bg-white/70" />
        <div className="absolute left-[-18%] top-[58%] h-7 w-[140%] rotate-[-18deg] rounded-full bg-white/70" />
        <div className="absolute left-[18%] top-[-10%] h-[120%] w-7 rotate-[22deg] rounded-full bg-white/60" />
        <div className="absolute left-[63%] top-[-12%] h-[120%] w-8 rotate-[-12deg] rounded-full bg-white/60" />
        <div className="absolute left-[4%] top-[18%] h-3 w-[96%] rotate-[-6deg] rounded-full bg-primary/10" />
        <div className="absolute left-[2%] top-[74%] h-3 w-[92%] rotate-[8deg] rounded-full bg-primary/10" />
      </div>

      <div className="absolute left-[50%] top-[48%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-pulse-dot" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-accent text-accent-foreground shadow-[var(--shadow-glow)]">
            <Navigation className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="absolute left-[12%] top-[28%] flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm">
        <MapPin className="h-3.5 w-3.5 text-accent" />
        Windhoek
      </div>

      <div className="absolute right-[8%] bottom-[18%] rounded-xl bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground shadow-[var(--shadow-elegant)]">
        CityLink Terminal
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
