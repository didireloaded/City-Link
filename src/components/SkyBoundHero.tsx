import { ShieldCheck, Clock, MapPin, CheckCircle2, Star } from "lucide-react";

interface HeroProps {
  onQuickRouteSelect?: (route: { from: string; to: string }) => void;
}

export const SkyBoundHero = ({ onQuickRouteSelect }: HeroProps) => {
  return (
    <div className="relative w-full rounded-[28px] md:rounded-[36px] overflow-hidden bg-neutral-100 min-h-[480px] md:min-h-[540px] flex flex-col items-center justify-between pt-10 md:pt-14 pb-16 px-4 md:px-8 border border-neutral-200/60 shadow-inner select-none">
      
      {/* Background Image with soft gradient overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
        style={{
          backgroundImage: `url("/hero-namibia.jpg")`,
        }}
      />

      {/* Atmospheric misty fade from top to bottom so black text is crisp and readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/30 backdrop-blur-[1px]" />

      {/* Delicate concentric circular wire vectors - matching SkyBound reference */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full border border-neutral-400/20 pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-[650px] h-[650px] rounded-full border border-neutral-400/10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-neutral-400/15 pointer-events-none" />

      {/* Top Floating Mini Card (Left) - Hosea Kutako Airport */}
      <div 
        onClick={() => onQuickRouteSelect?.({ from: "Hosea Kutako International Airport", to: "Windhoek" })}
        className="hidden md:flex absolute top-12 left-8 z-10 floating-card rounded-2xl p-2.5 pr-4 items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-200"
      >
        <img
          src="/hkia-thumb.jpg"
          alt="Hosea Kutako Airport"
          className="w-11 h-11 rounded-xl object-cover border border-neutral-200"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-neutral-900 leading-tight">Hosea Kutako Int'l</span>
          <span className="text-[11px] text-neutral-500">40 km to Windhoek · 45 min</span>
        </div>
      </div>

      {/* Top Floating Mini Card (Right) - 24/7 Chauffeur & Schedule */}
      <div className="hidden lg:flex absolute top-10 right-8 z-10 floating-card rounded-2xl p-3.5 flex-col gap-2 w-52">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">Private Chauffeur</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>Available 24/7</span>
          <span className="font-semibold text-neutral-900">From N$ 450</span>
        </div>
        {/* Days of week circular indicator dots matching SkyBound */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0.5">
              <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[9px] font-bold text-amber-900">
                ✓
              </div>
              <span className="text-[9px] text-neutral-400 font-medium">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-3 md:gap-4 mt-2 md:mt-4">
        
        {/* SkyBound Style Centered Emoji Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-neutral-200/80 shadow-sm text-xs font-medium text-neutral-700">
          <div className="flex items-center gap-1 text-sm">
            <span>🔥</span>
            <span>👍</span>
            <span>😍</span>
            <span>💙</span>
            <span>✌️</span>
            <span>🏖️</span>
          </div>
          <span className="text-neutral-300">|</span>
          <span className="font-semibold text-neutral-800">Serving Namibia Since 2014</span>
        </div>

        {/* Main Bold Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 tracking-tight leading-[1.05]">
          PRIVATE TRANSFERS <br className="hidden sm:inline" />
          <span className="text-neutral-900">ACROSS NAMIBIA</span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-normal max-w-2xl px-2 leading-relaxed">
          Airport transfers, city rides, lodge transfers and long-distance private travel with professional drivers and comfortable air-conditioned vehicles.
        </p>

        {/* Subtle quick trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 pt-1 text-xs text-neutral-600 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Flight Tracking & Meet & Greet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fixed Transparent Pricing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sedans, 4x4 Fortuners & Mini-Buses</span>
          </div>
        </div>

      </div>

      {/* Decorative spacer for booking bar overlap */}
      <div className="h-6 md:h-10" />

    </div>
  );
};
