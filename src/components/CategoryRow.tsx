import { useState, useRef } from "react";
import { 
  Plane, 
  Building2, 
  Compass, 
  Car, 
  Crown, 
  Bus, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";

interface CategoryRowProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const CategoryRow = ({
  selectedCategory = "Airport",
  onSelectCategory,
}: CategoryRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      id: "Airport",
      title: "Airport Transfer",
      subtitle: "Hosea Kutako · 24/7 Meet & Greet",
      badge: "Top rated",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
      icon: Plane,
    },
    {
      id: "City",
      title: "City Ride",
      subtitle: "Windhoek point-to-point transfers",
      badge: "Popular",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-200",
      icon: Building2,
    },
    {
      id: "Lodge",
      title: "Lodge Transfer",
      subtitle: "Scenic desert & wilderness lodges",
      badge: "Guest favorite",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
      icon: Compass,
    },
    {
      id: "Safari",
      title: "Safari & Tours",
      subtitle: "Etosha, Sossusvlei & National Parks",
      badge: "Top rated",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
      icon: Car,
    },
    {
      id: "Executive",
      title: "Executive VIP",
      subtitle: "Fortuner & Mercedes chauffeur",
      badge: "Trending",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-200",
      icon: Crown,
    },
    {
      id: "Staff",
      title: "Staff Transport",
      subtitle: "Scheduled workforce & team transit",
      badge: "Corporate",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-200",
      icon: Bus,
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full pt-10 md:pt-14 pb-8 px-2 md:px-4">
      {/* Category Header Row - Matching SkyBound Reference */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Select Category
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
            Find the right transport option for your trip across Namibia
          </p>
        </div>

        {/* Right Navigation & Filters matching SkyBound */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={() => scroll("left")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-neutral-200 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-50 shadow-sm transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span>Filters</span>
          </button>

          {/* Left Arrow (white circle) */}
          <button
            onClick={() => scroll("left")}
            aria-label="Previous categories"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 flex items-center justify-center transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow (Vibrant Yellow Circle matching SkyBound!) */}
          <button
            onClick={() => scroll("right")}
            aria-label="Next categories"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#facc15] hover:bg-amber-400 text-neutral-950 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm font-bold"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Categories Cards Carousel/Grid */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 md:gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory?.(cat.id)}
              style={{ scrollSnapAlign: "start" }}
              className={`category-card min-w-[200px] sm:min-w-[220px] md:min-w-[230px] p-5 rounded-[22px] md:rounded-[26px] cursor-pointer flex flex-col justify-between h-[170px] select-none ${
                isSelected
                  ? "ring-2 ring-neutral-900 border-neutral-900 bg-neutral-50/50 shadow-md"
                  : "bg-white border-neutral-200/70"
              }`}
            >
              {/* Top Row: Icon + Pastel Badge */}
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-800"}`}>
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Row: Name + Subtitle */}
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 leading-tight">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium mt-1 leading-snug truncate">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
