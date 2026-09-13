import { ShieldCheck, UserCheck, Plane, CheckCircle2, ArrowRight } from "lucide-react";

interface AirportProps {
  onBookAirport?: () => void;
}

export const AirportSpotlight = ({ onBookAirport }: AirportProps) => {
  return (
    <section className="w-full py-10 px-2 md:px-4">
      <div className="rounded-[32px] md:rounded-[40px] bg-neutral-900 text-white p-6 sm:p-8 md:p-12 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-neutral-700/40 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-neutral-700/30 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-400/30">
              <Plane className="w-3.5 h-3.5" />
              <span>Flagship Private Transfer</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Hosea Kutako International Airport (WDH)
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed mb-6">
              Located 40 km east of Windhoek, arriving in Namibia requires dependable, pre-arranged transport. City Cab provides personalized Meet & Greet service directly in the arrivals terminal with custom name board and baggage assistance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Personalized name board greeting",
                "Real-time flight delay monitoring",
                "Fixed upfront fare (From N$ 450)",
                "Full air-conditioned luggage assistance",
                "Available 24/7 for all arrivals",
                "Direct hotel or lodge delivery",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onBookAirport}
                className="px-6 py-3 rounded-full bg-[#facc15] hover:bg-amber-400 text-neutral-950 text-xs sm:text-sm font-extrabold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
              >
                <span>Book Airport Pickup</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <a
                href="https://wa.me/264812572188?text=Hello%20City%20Cab,%20I%20would%20like%20to%20book%20an%20airport%20transfer."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold transition-colors border border-neutral-700"
              >
                WhatsApp Direct Confirmation
              </a>
            </div>
          </div>

          {/* Right image card with stats */}
          <div className="relative">
            <div className="rounded-[28px] overflow-hidden border border-neutral-700 shadow-2xl">
              <img
                src="/hkia-thumb.jpg"
                alt="Hosea Kutako Airport Transfer"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white text-neutral-900 p-4 rounded-2xl shadow-xl border border-neutral-100 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg">
                40
              </div>
              <div>
                <span className="text-xs font-bold block">Kilometers to Windhoek</span>
                <span className="text-[11px] text-neutral-500">45-55 mins comfortable ride</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
