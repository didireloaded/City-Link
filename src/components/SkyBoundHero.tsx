interface HeroProps {
  onQuickRouteSelect?: (route: { from: string; to: string }) => void;
}

export const SkyBoundHero = ({ onQuickRouteSelect }: HeroProps) => {
  return (
    <div className="relative w-full rounded-[28px] md:rounded-[36px] overflow-hidden bg-neutral-50 min-h-[440px] md:min-h-[520px] flex flex-col items-center justify-center pt-6 md:pt-8 pb-20 md:pb-24 px-4 md:px-8 border border-neutral-200/40 select-none">
      
      {/* Barely-there atmospheric background — very faded like reference */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
        style={{
          backgroundImage: `url("/hero-namibia.jpg")`,
        }}
      />

      {/* Soft radial glow behind the title area */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,transparent_70%)]" />

      {/* Floating Mini Card — Left (Airport info matching reference card) */}
      <div 
        onClick={() => onQuickRouteSelect?.({ from: "Hosea Kutako International Airport", to: "Windhoek" })}
        className="hidden md:flex absolute top-[28%] left-6 lg:left-10 z-10 floating-card rounded-2xl p-2 pr-4 items-center gap-2.5 cursor-pointer hover:scale-[1.03] transition-transform duration-300"
      >
        <img
          src="/hkia-thumb.jpg"
          alt="Hosea Kutako Airport"
          className="w-10 h-10 rounded-xl object-cover border border-neutral-200/60"
        />
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-neutral-900 leading-tight">Hosea Kutako Int&apos;l</span>
          <span className="text-[10px] text-neutral-400 font-medium">40 km &middot; 45 min drive</span>
        </div>
      </div>

      {/* Floating Mini Card — Right (Schedule widget matching reference) */}
      <div className="hidden lg:flex absolute top-[18%] right-6 lg:right-10 z-10 floating-card rounded-2xl p-3 flex-col gap-2 w-[200px]">
        {/* Photo thumbnail like reference */}
        <div className="w-full h-16 rounded-xl overflow-hidden bg-neutral-200">
          <img
            src="/hero-namibia.jpg"
            alt="Namibia landscape"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Week day availability dots — matches SkyBound reference exactly */}
        <div className="flex items-center justify-between px-0.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0.5">
              <div className="w-[18px] h-[18px] rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[8px] font-bold text-neutral-500">
                {idx === 1 || idx === 3 || idx === 5 ? "✓" : ""}
              </div>
              <span className="text-[8px] text-neutral-400 font-medium">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Hero Content — centered, elegant, matching reference */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-2 md:gap-3">
        
        {/* Massive Display Title — italic style matching "Explore City" */}
        <h1 
          className="text-[2.8rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-extrabold text-neutral-900 tracking-tight leading-[1]"
          style={{ fontStyle: "italic" }}
        >
          Private Transfers
        </h1>

        {/* Elegant single-line subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-500 font-normal tracking-wide mt-1">
          Embrace the Beauty of Namibia&apos;s Open Road
        </p>

        {/* Emoji Row + Social proof — exact SkyBound reference layout */}
        <div className="flex flex-col items-center gap-1.5 mt-4 md:mt-6">
          <div className="flex items-center gap-1.5 text-base md:text-lg">
            <span>🔥</span>
            <span>👍</span>
            <span>😍</span>
            <span>💙</span>
            <span>✌️</span>
            <span>🏖️</span>
          </div>
          <span className="text-[11px] md:text-xs text-neutral-500 font-medium tracking-wide">
            Loved from 500k users
          </span>
        </div>
      </div>

      {/* Extra bottom spacing for booking bar overlap */}
      <div className="h-4 md:h-8" />
    </div>
  );
};
