import { Users, Briefcase, Snowflake, CheckCircle2, ShieldCheck } from "lucide-react";

interface FleetProps {
  onSelectVehicle?: (model: string) => void;
}

export const FleetSection = ({ onSelectVehicle }: FleetProps) => {
  const fleet = [
    {
      id: "corolla",
      name: "Toyota Corolla / Nissan Almera",
      category: "Executive Sedan",
      tag: "Ideal for Solo & Couples",
      passengers: "1-3 Passengers",
      luggage: "2 Large Bags",
      bestFor: "Airport transfers, hotel transfers & city meetings",
      features: ["Full Climate Control", "Meet & Greet Included", "Bottled Water"],
      rateNote: "Airport transfer from N$ 450",
    },
    {
      id: "fortuner",
      name: "Toyota Fortuner 4x4 / Hilux",
      category: "Luxury 4x4 SUV",
      tag: "Safari & Rough Terrain Ready",
      passengers: "1-4 Passengers",
      luggage: "4 Large Bags",
      bestFor: "Sossusvlei, Etosha, gravel highways & lodge transfers",
      features: ["High Clearance 4WD", "Bush Certified Driver", "Panoramic Windows"],
      rateNote: "Airport transfer from N$ 650 · Safari quotes",
    },
    {
      id: "quantum",
      name: "Toyota Quantum (10-13 Seater)",
      category: "Passenger Minibus",
      tag: "Group & Family Transfers",
      passengers: "5-13 Passengers",
      luggage: "10-14 Bags",
      bestFor: "Conference groups, tour parties, airport team shuttle",
      features: ["Spacious High Roof", "Luggage Trailer Ready", "Individual AC Vents"],
      rateNote: "Airport transfer from N$ 1,200",
    },
    {
      id: "sprinter",
      name: "Mercedes-Benz Sprinter",
      category: "Executive Coach",
      tag: "VIP Large Delegation",
      passengers: "14-22 Passengers",
      luggage: "20+ Bags",
      bestFor: "Corporate delegations, wedding parties, diplomatic transit",
      features: ["Reclining Leather Seats", "PA Audio System", "Chauffeur Captain"],
      rateNote: "Private Charter by Quote",
    },
  ];

  return (
    <section id="fleet" className="w-full pt-10 pb-12 px-2 md:px-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Our Dedicated Fleet
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
            Fully licensed, insured, air-conditioned and meticulously maintained for Namibian roads
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {fleet.map((vehicle) => (
          <div
            key={vehicle.id}
            className="p-6 rounded-[28px] bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header category and tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {vehicle.category}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800">
                  {vehicle.tag}
                </span>
              </div>

              {/* Vehicle Model Name */}
              <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight mb-2">
                {vehicle.name}
              </h3>

              <p className="text-xs text-neutral-500 mb-4 font-medium">
                Best for: <span className="text-neutral-700">{vehicle.bestFor}</span>
              </p>

              {/* Capacities */}
              <div className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-neutral-50 border border-neutral-100 mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                  <Users className="w-4 h-4 text-neutral-600" />
                  <span>{vehicle.passengers}</span>
                </div>
                <div className="w-px h-4 bg-neutral-200" />
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                  <Briefcase className="w-4 h-4 text-neutral-600" />
                  <span>{vehicle.luggage}</span>
                </div>
                <div className="w-px h-4 bg-neutral-200" />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>Air-Con</span>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-1.5 mb-6">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900">
                {vehicle.rateNote}
              </span>
              <button
                onClick={() => onSelectVehicle?.(vehicle.name)}
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-transform hover:scale-105 active:scale-95"
              >
                Select Vehicle
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
