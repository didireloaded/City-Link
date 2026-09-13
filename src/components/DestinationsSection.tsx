import { MapPin, Clock, ArrowRight, Compass } from "lucide-react";

interface DestinationsProps {
  onBookDestination?: (destName: string) => void;
}

export const DestinationsSection = ({ onBookDestination }: DestinationsProps) => {
  const destinations = [
    {
      id: "swakopmund",
      name: "Swakopmund & Walvis Bay",
      region: "Atlantic Coast",
      distance: "360 km from Windhoek",
      duration: "Approx. 4 hours",
      image: "/swakopmund.jpg",
      description: "Historic seaside architecture, dune adventures, and oceanic tranquility on paved highway B2.",
      recommendedVehicle: "Sedan or Fortuner 4x4",
    },
    {
      id: "sossusvlei",
      name: "Sossusvlei & Namib-Naukluft",
      region: "Namib Desert",
      distance: "340 km from Windhoek",
      duration: "Approx. 4.5 hours",
      image: "/sossusvlei.jpg",
      description: "World famous towering red sand dunes, Deadvlei, and remote wilderness luxury lodges.",
      recommendedVehicle: "High Clearance Toyota Fortuner 4x4",
    },
    {
      id: "etosha",
      name: "Etosha National Park",
      region: "Northern Safari Heartland",
      distance: "420 km from Windhoek",
      duration: "Approx. 4.5 hours",
      image: "/etosha.jpg",
      description: "Namibia's premier wildlife sanctuary with lions, elephants, rhinos and luxury safari camps.",
      recommendedVehicle: "Fortuner 4x4 or Quantum Minibus",
    },
  ];

  return (
    <section id="destinations" className="w-full pt-10 pb-12 px-2 md:px-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Key Namibia Destinations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
            Private long-distance and lodge transfers connecting Windhoek to Namibia's top highlights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="group rounded-[28px] overflow-hidden bg-white border border-neutral-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Destination Image with region badge */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-100">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-neutral-900 shadow-sm">
                  {dest.region}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{dest.duration} ({dest.distance})</span>
                </div>
              </div>
            </div>

            {/* Destination Content */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight mb-1.5">
                  {dest.name}
                </h3>
                <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                  {dest.description}
                </p>
                <div className="text-[11px] text-neutral-500 font-medium">
                  Recommended: <span className="text-neutral-800 font-semibold">{dest.recommendedVehicle}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">
                  Door-to-Door Private Route
                </span>
                <button
                  onClick={() => onBookDestination?.(dest.name)}
                  className="flex items-center gap-1 text-xs font-extrabold text-neutral-900 hover:text-black hover:underline"
                >
                  <span>Book Transfer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
