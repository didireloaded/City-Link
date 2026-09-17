import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";

interface BookingBarProps {
  onSearch?: (criteria: {
    pickup: string;
    destination: string;
    date: string;
    time: string;
    passengers: number;
  }) => void;
}

export const SkyBoundBookingBar = ({ onSearch }: BookingBarProps) => {
  const [pickup, setPickup] = useState("Hosea Kutako International Airport");
  const [destination, setDestination] = useState("Windhoek (Any Hotel or Address)");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("14:30");
  const [passengers, setPassengers] = useState(2);

  const pickupOptions = [
    "Hosea Kutako International Airport",
    "Windhoek City Center",
    "Windhoek West / Central Hotel",
    "Eros Airport (ERS)",
    "Swakopmund Hotel / Address",
    "Sossusvlei Lodge",
    "Custom Location (Enter notes)",
  ];

  const destinationOptions = [
    "Windhoek (Any Hotel or Address)",
    "Hosea Kutako International Airport",
    "Swakopmund / Walvis Bay",
    "Sossusvlei / Namib Desert",
    "Etosha National Park Lodges",
    "Fish River Canyon",
    "Erindi Game Reserve",
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch?.({
      pickup,
      destination,
      date,
      time,
      passengers,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-10 md:-mt-14 relative z-20 px-2 sm:px-4">
      <div className="rounded-[22px] md:rounded-full bg-white p-2 md:p-2.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-stretch md:items-center gap-0">
        
        {/* Field 1: Location (Pickup) */}
        <div className="flex-1 px-5 py-3 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-center cursor-pointer hover:bg-neutral-50/60 rounded-xl md:rounded-none transition-colors">
          <span className="text-xs font-bold text-neutral-900 mb-0.5">Location</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-500 focus:outline-none cursor-pointer truncate"
            >
              {pickupOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 2: Destination (Room in reference) */}
        <div className="flex-1 px-5 py-3 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-center cursor-pointer hover:bg-neutral-50/60 rounded-xl md:rounded-none transition-colors">
          <span className="text-xs font-bold text-neutral-900 mb-0.5">Destination</span>
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-500 focus:outline-none cursor-pointer truncate"
            >
              {destinationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 3: Date (Check in) */}
        <div className="flex-1 px-5 py-3 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-center cursor-pointer hover:bg-neutral-50/60 rounded-xl md:rounded-none transition-colors">
          <span className="text-xs font-bold text-neutral-900 mb-0.5">Date</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-xs text-neutral-500 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Field 4: Passengers (Check out equivalent) */}
        <div className="flex-1 px-5 py-3 flex flex-col justify-center cursor-pointer hover:bg-neutral-50/60 rounded-xl md:rounded-none transition-colors">
          <span className="text-xs font-bold text-neutral-900 mb-0.5">Passengers</span>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-transparent text-xs text-neutral-500 focus:outline-none cursor-pointer"
            >
              <option value={1}>1 Passenger</option>
              <option value={2}>2 Passengers</option>
              <option value={3}>3 Passengers</option>
              <option value={4}>4 Passengers (SUV)</option>
              <option value={7}>5-7 Passengers (Van)</option>
              <option value={13}>8-13 Passengers (Quantum)</option>
              <option value={20}>14+ Group Transfer</option>
            </select>
          </div>
        </div>

        {/* Circular black search button — exact match to reference */}
        <div className="p-1.5 flex items-center justify-end">
          <button
            onClick={() => handleSubmit()}
            aria-label="Search and book transfer"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shrink-0"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
