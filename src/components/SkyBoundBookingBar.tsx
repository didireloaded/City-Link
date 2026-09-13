import { useState } from "react";
import { Search, MapPin, Calendar, Users, ArrowRight, Clock } from "lucide-react";

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
    <div className="w-full max-w-5xl mx-auto -mt-8 md:-mt-12 relative z-20 px-2 sm:px-4">
      <div className="skybound-booking-bar rounded-[26px] md:rounded-full bg-white p-2.5 md:p-3 shadow-xl border border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 transition-all">
        
        {/* Field 1: Pickup Location */}
        <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-center group cursor-pointer hover:bg-neutral-50/70 rounded-2xl md:rounded-full transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            {/* SkyBound style subtle yellow accent pill/mark on label */}
            <span className="w-2 h-2 rounded-full bg-[#facc15]" />
            <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">Pickup Location</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer truncate"
            >
              {pickupOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 2: Destination */}
        <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-center group cursor-pointer hover:bg-neutral-50/70 rounded-2xl md:rounded-full transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#facc15]" />
            <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer truncate"
            >
              {destinationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 3: Date & Time */}
        <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-center group cursor-pointer hover:bg-neutral-50/70 rounded-2xl md:rounded-full transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#facc15]" />
            <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">Date & Time</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
            <div className="flex items-center gap-1.5 w-full">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer w-16"
              />
            </div>
          </div>
        </div>

        {/* Field 4: Passengers */}
        <div className="flex-1 px-4 py-2 flex flex-col justify-center group cursor-pointer hover:bg-neutral-50/70 rounded-2xl md:rounded-full transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#facc15]" />
            <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">Passengers</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400 shrink-0" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
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

        {/* Search Action Button - Circular solid black button from SkyBound */}
        <div className="p-1 flex items-center justify-end">
          <button
            onClick={() => handleSubmit()}
            aria-label="Search and book transfer"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 shadow-md shrink-0"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
