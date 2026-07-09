import { MapPin, Navigation, Radio } from "lucide-react";

export const MapBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#0a192f] via-[#0f2744] to-primary/95 opacity-85 pointer-events-none">
      {/* Subtle Highway Corridor Lines */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[-15%] top-[30%] h-12 w-[140%] rotate-[15deg] rounded-full border-t-2 border-dashed border-white/30 bg-white/5 blur-[1px]" />
        <div className="absolute left-[-10%] top-[60%] h-10 w-[140%] rotate-[-12deg] rounded-full border-t border-accent/40 bg-accent/5" />
        <div className="absolute left-[25%] top-[-10%] h-[130%] w-8 rotate-[25deg] rounded-full border-l border-white/20 bg-white/5" />
      </div>

      {/* Live Pulsing GPS Passenger Location Pin */}
      <div className="absolute left-[48%] top-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-16 w-16 rounded-full bg-accent/30 animate-ping" style={{ animationDuration: "3s" }} />
          <span className="absolute h-10 w-10 rounded-full bg-accent/50 animate-pulse" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent text-accent-foreground shadow-[var(--shadow-glow)]">
            <Navigation className="h-4 w-4 fill-current rotate-45" />
          </span>
        </div>
      </div>

      {/* Corridor Checkpoint Badges */}
      <div className="absolute left-[8%] top-[24%] flex items-center gap-1.5 rounded-full bg-black/40 border border-white/15 px-3 py-1 text-[10px] font-extrabold text-white backdrop-blur-md shadow-sm">
        <MapPin className="h-3 w-3 text-accent" />
        <span>Windhoek GPS: Active</span>
      </div>

      <div className="absolute right-[6%] top-[54%] flex items-center gap-1.5 rounded-full bg-black/40 border border-white/15 px-3 py-1 text-[10px] font-extrabold text-white/90 backdrop-blur-md">
        <Radio className="h-3 w-3 text-success animate-pulse" />
        <span>B1 Highway Clear</span>
      </div>

      {/* Smooth Bottom Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
    </div>
  );
};
