import { useRef } from "react";
import { 
  Plane, 
  Building2, 
  Compass, 
  Car, 
  Crown, 
  Bus, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight
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
      count: "316 Activities",
      badge: "Top rated",
      badgeColor: "bg-red-50 text-red-700 border-red-100",
      icon: Plane,
    },
    {
      id: "City",
      title: "City Ride",
      count: "196 Activities",
      badge: "Trending",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      icon: Building2,
    },
    {
      id: "Lodge",
      title: "Lodge Transfer",
      count: "248 Activities",
      badge: "Guest favorite",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: Compass,
    },
    {
      id: "Safari",
      title: "Safari & Tours",
      count: "74 Activities",
      badge: "Top rated",
      badgeColor: "bg-red-50 text-red-700 border-red-100",
      icon: Car,
    },
    {
      id: "Executive",
      title: "Executive VIP",
      count: "126 Activities",
      badge: "Trending",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      icon: Crown,
    },
    {
      id: "Staff",
      title: "Staff Transport",
      count: "294 Activities",
      badge: "Corporate",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
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
    <section className="w-full pt-10 md:pt-14 pb-6 px-2 md:px-4">
      {/* Section Header — matching reference exactly */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Select Category
          </h2>
          <p className="text-sm text-neutral-400 font-normal mt-1">
            Uncover the Perfect Match in Every Category
          </p>
        </div>

        {/* Right controls: Filters pill + prev/next arrows */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-neutral-200 bg-white text-neutral-600 text-xs font-medium hover:bg-neutral-50 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Previous arrow — white circle */}
          <button
            onClick={() => scroll("left")}
            aria-label="Previous categories"
            className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next arrow — yellow circle matching reference */}
          <button
            onClick={() => scroll("right")}
            aria-label="Next categories"
            className="w-10 h-10 rounded-full bg-[#facc15] hover:bg-amber-400 text-neutral-900 flex items-center justify-center transition-all duration-200 hover:scale-105 font-bold"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Category Cards — matching reference: icon centered, badge top-right, title + count below */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 md:gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
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
              className={`category-card relative min-w-[150px] sm:min-w-[170px] md:min-w-[180px] p-5 rounded-[20px] cursor-pointer flex flex-col items-center text-center gap-3 select-none ${
                isSelected
                  ? "ring-2 ring-neutral-900 border-neutral-900 bg-neutral-50/50"
                  : "bg-white"
              }`}
            >
              {/* Badge — top right corner */}
              <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                {cat.badge}
              </span>

              {/* Icon — centered, line art style */}
              <div className={`mt-2 p-3 rounded-2xl ${isSelected ? "text-neutral-900" : "text-neutral-600"}`}>
                <Icon className="w-8 h-8 stroke-[1.2]" />
              </div>

              {/* Title + Count */}
              <div>
                <h3 className="font-bold text-sm text-neutral-900 leading-tight">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                  {cat.count}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
