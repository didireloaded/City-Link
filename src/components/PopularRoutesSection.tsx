import { ArrowRight, Clock, Shield, Check, MapPin } from "lucide-react";

interface RoutesProps {
  onSelectRoute?: (from: string, to: string) => void;
}

export const PopularRoutesSection = ({ onSelectRoute }: RoutesProps) => {
  const routes = [
    {
      id: "hkia-whk",
      from: "Hosea Kutako Int'l Airport",
      to: "Windhoek (Any Hotel/Address)",
      duration: "45-55 min",
      price: "From N$ 450",
      type: "Fixed Rate",
      featured: true,
      vehicles: "Corolla · Fortuner · Quantum",
      amenities: ["Flight Monitoring", "Name Board Meet & Greet", "Luggage Assistance"],
    },
    {
      id: "whk-hkia",
      from: "Windhoek City",
      to: "Hosea Kutako Int'l Airport",
      duration: "45-55 min",
      price: "From N$ 450",
      type: "Fixed Rate",
      featured: false,
      vehicles: "Corolla · Fortuner · Quantum",
      amenities: ["Hotel Direct Pickup", "Punctual Dispatch", "Luggage Assistance"],
    },
    {
      id: "whk-swk",
      from: "Windhoek",
      to: "Swakopmund / Walvis Bay",
      duration: "Approx. 4 hours",
      price: "Private Quote",
      type: "Long-Distance",
      featured: false,
      vehicles: "Fortuner 4x4 · Quantum · Sedan",
      amenities: ["Scenic Coastal Route", "Comfort Stops", "Air-Conditioned"],
    },
    {
      id: "whk-sos",
      from: "Windhoek",
      to: "Sossusvlei & Namib Desert",
      duration: "Approx. 4.5 hours",
      price: "Private Quote",
      type: "Lodge & Safari",
      featured: false,
      vehicles: "Toyota Fortuner 4x4 / Hilux",
      amenities: ["Gravel Road Certified", "Experienced Bush Driver", "Lodge Drop-Off"],
    },
    {
      id: "whk-eto",
      from: "Windhoek",
      to: "Etosha National Park Lodges",
      duration: "Approx. 4.5 hours",
      price: "Private Quote",
      type: "Safari Gateway",
      featured: false,
      vehicles: "Fortuner 4x4 · Quantum Bus",
      amenities: ["Safari Gate Delivery", "Wildlife Route", "Water & Refreshments"],
    },
  ];

  return (
    <section id="transfers" className="w-full pt-8 pb-12 px-2 md:px-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Popular Transfer Routes
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
            Seamless point-to-point private transfers with verified transparent pricing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {routes.map((route) => (
          <div
            key={route.id}
            className={`p-6 rounded-[24px] md:rounded-[28px] border transition-all duration-200 flex flex-col justify-between ${
              route.featured
                ? "bg-gradient-to-b from-white to-amber-50/30 border-amber-200 shadow-md ring-1 ring-amber-300/40"
                : "bg-white border-neutral-200/80 hover:border-neutral-300 shadow-sm hover:shadow-md"
            }`}
          >
            {/* Header: Route Type Badge + Duration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  route.featured ? "bg-amber-200/80 text-amber-950 font-extrabold" : "bg-neutral-100 text-neutral-600"
                }`}>
                  {route.type}
                </span>
                <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{route.duration}</span>
                </div>
              </div>

              {/* Origin -> Destination Flow */}
              <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 mt-1 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-neutral-700">{route.from}</span>
                </div>
                <div className="w-0.5 h-4 bg-neutral-200 ml-1" />
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 mt-1 shrink-0" />
                  <span className="text-sm sm:text-base font-extrabold text-neutral-950">{route.to}</span>
                </div>
              </div>

              {/* Vehicle Options */}
              <div className="text-[11px] text-neutral-500 font-medium mb-3">
                Vehicles: <span className="text-neutral-800 font-semibold">{route.vehicles}</span>
              </div>

              {/* Amenities */}
              <div className="space-y-1.5 pt-3 border-t border-neutral-100 mb-6">
                {route.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Price & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div>
                <span className="text-[11px] text-neutral-400 block font-medium">Price</span>
                <span className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                  {route.price}
                </span>
              </div>

              <button
                onClick={() => onSelectRoute?.(route.from, route.to)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <span>Book Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
