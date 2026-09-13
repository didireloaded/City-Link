import { useState } from "react";
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Briefcase, 
  Plane, 
  Car, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Phone,
  Mail,
  User,
  MessageSquare
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCriteria?: {
    pickup?: string;
    destination?: string;
    date?: string;
    time?: string;
    passengers?: number;
  };
}

export const ProgressiveBookingModal = ({
  isOpen,
  onClose,
  initialCriteria,
}: BookingModalProps) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  // Form State
  const [pickup, setPickup] = useState(initialCriteria?.pickup || "Hosea Kutako International Airport");
  const [destination, setDestination] = useState(initialCriteria?.destination || "Windhoek Hotel / Address");
  const [isReturn, setIsReturn] = useState(false);
  const [pickupDate, setPickupDate] = useState(initialCriteria?.date || new Date().toISOString().slice(0, 10));
  const [pickupTime, setPickupTime] = useState(initialCriteria?.time || "14:30");
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
  const [returnTime, setReturnTime] = useState("11:00");
  const [passengers, setPassengers] = useState(initialCriteria?.passengers || 2);
  const [luggage, setLuggage] = useState(2);
  const [flightNumber, setFlightNumber] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("Toyota Corolla / Sedan");
  
  // Customer State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const isAirport = pickup.toLowerCase().includes("airport") || destination.toLowerCase().includes("airport");

  const vehicles = [
    {
      id: "sedan",
      name: "Toyota Corolla / Sedan",
      desc: "1-3 Passengers · 2 Bags",
      price: isAirport ? "N$ 450" : "On Request",
      note: "Standard airport rate",
    },
    {
      id: "suv",
      name: "Toyota Fortuner 4x4",
      desc: "1-4 Passengers · 4 Bags",
      price: isAirport ? "N$ 650" : "On Request",
      note: "Rugged luxury for bush/safari",
    },
    {
      id: "van",
      name: "Toyota Quantum (13 Seater)",
      desc: "5-13 Passengers · 12 Bags",
      price: isAirport ? "N$ 1,200" : "On Request",
      note: "Spacious group shuttle",
    },
  ];

  const generateWhatsAppMessage = () => {
    const text = 
`*NEW TRANSFER REQUEST - CITY CAB NAMIBIA*
---------------------------------------
*Route:* ${pickup} -> ${destination}
*Type:* ${isReturn ? "Return Trip" : "One-Way Transfer"}
*Pickup Date:* ${pickupDate} at ${pickupTime}
${isReturn ? `*Return Date:* ${returnDate} at ${returnTime}
` : ""}*Passengers:* ${passengers} (${luggage} bags)
${flightNumber ? `*Flight Number:* ${flightNumber}
` : ""}*Vehicle:* ${selectedVehicle}
---------------------------------------
*Passenger:* ${fullName || "Traveler"}
*Phone:* ${phone || "Not provided"}
*Email:* ${email || "Not provided"}
${notes ? `*Special Notes:* ${notes}
` : ""}Please confirm availability and dispatch details.`;

    return `https://wa.me/264812572188?text=${encodeURIComponent(text)}`;
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      setConfirmed(true);
      setStep(6);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white w-full max-w-xl rounded-[28px] md:rounded-[36px] shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#facc15]" />
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Step {step} of 5
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
              {step === 1 && "Select Pickup & Destination"}
              {step === 2 && "Choose Date & Time"}
              {step === 3 && "Passengers & Flight Details"}
              {step === 4 && "Choose Vehicle"}
              {step === 5 && "Passenger Contact Details"}
              {step === 6 && "Booking Confirmed"}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full h-1 bg-neutral-100">
          <div 
            className="h-full bg-neutral-900 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-7 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: ROUTE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                  Pickup Location
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Hosea Kutako Airport, Hotel, or Address"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                  Drop-off Destination
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <MapPin className="w-4 h-4 text-neutral-900 shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Windhoek hotel, Swakopmund, Sossusvlei..."
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-neutral-400 block mb-2 font-medium">Quick Route Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Airport -> Windhoek",
                    "Windhoek -> Airport",
                    "Windhoek -> Swakopmund",
                    "Windhoek -> Sossusvlei",
                  ].map((preset) => {
                    const [from, to] = preset.split(" -> ");
                    return (
                      <button
                        key={preset}
                        onClick={() => {
                          setPickup(from.includes("Airport") ? "Hosea Kutako International Airport" : "Windhoek City");
                          setDestination(to.includes("Airport") ? "Hosea Kutako International Airport" : to === "Windhoek" ? "Windhoek City Hotel" : to);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors"
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-1 bg-neutral-100 rounded-2xl max-w-xs">
                <button
                  onClick={() => setIsReturn(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    !isReturn ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                  }`}
                >
                  One-Way
                </button>
                <button
                  onClick={() => setIsReturn(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    isReturn ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                  }`}
                >
                  Return Journey
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              {isReturn && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                      Return Time
                    </label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PASSENGERS & FLIGHT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                    Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 13, 20].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? "Person" : "Persons"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                    Luggage Pieces
                  </label>
                  <select
                    value={luggage}
                    onChange={(e) => setLuggage(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 8, 10, 15].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? "Bag" : "Bags"}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
                  Flight Number (Optional but recommended for airport)
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <Plane className="w-4 h-4 text-neutral-500 shrink-0" />
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="e.g. 4Y 132 (Eurowings), QR 1373 (Qatar)"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  We monitor inbound flights for delays at zero extra charge.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: VEHICLE */}
          {step === 4 && (
            <div className="space-y-3">
              <span className="text-xs text-neutral-500 font-medium block">
                Select the vehicle best suited for your party:
              </span>
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.name)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedVehicle === v.name
                      ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{v.name}</h4>
                      <p className="text-xs text-neutral-500">{v.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-neutral-900 block">{v.price}</span>
                    <span className="text-[10px] text-neutral-400">{v.note}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: CUSTOMER DETAILS */}
          {step === 5 && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <User className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name or lead passenger"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Phone / WhatsApp
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+264 or international format"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="confirmation@example.com"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Special Notes or Child Seat
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Child booster seat needed, heavy safari luggage, or hotel room number..."
                  rows={2}
                  className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMED */}
          {step === 6 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-neutral-900">Transfer Request Ready!</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Your itinerary is prepared. Connect immediately on WhatsApp for instant 2-minute chauffeur confirmation.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-500">Route:</span>
                  <span className="text-neutral-900">{pickup} → {destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date & Time:</span>
                  <span className="text-neutral-900">{pickupDate} at {pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Passenger:</span>
                  <span className="text-neutral-900">{fullName || "Guest"} ({passengers} pax)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Vehicle:</span>
                  <span className="text-neutral-900">{selectedVehicle}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send & Confirm on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs transition-colors"
                >
                  Close & Return to Website
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 6 && (
          <div className="p-4 md:p-6 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/264812572188?text=Hello%20City%20Cab,%20I%20would%20like%20to%20book%20a%20transfer."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block text-xs font-semibold text-emerald-700 hover:underline px-2"
              >
                Skip to WhatsApp
              </a>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-transform hover:scale-105 active:scale-95 shadow-sm"
              >
                <span>{step === 5 ? "Confirm & Review" : "Continue"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
