import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenBooking?: () => void;
}

export const CityCabHeader = ({
  activeTab = "Airport",
  onSelectTab,
  onOpenBooking,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "Airport", label: "Airport Transfers" },
    { id: "City", label: "City Rides" },
    { id: "Lodge", label: "Lodge & Safari" },
    { id: "Fleet", label: "Our Fleet" },
    { id: "Destinations", label: "Destinations" },
    { id: "Corporate", label: "Corporate" },
  ];

  const handleNavClick = (id: string) => {
    if (onSelectTab) onSelectTab(id);
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full py-4 px-2 md:px-4">
      <div className="flex items-center justify-between">
        {/* Brand Logo — SkyBound reference: icon left + bold wordmark */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-base">
            <span className="text-amber-300 font-extrabold leading-none">C</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-neutral-900">
            City<span className="font-normal text-neutral-900">Cab</span>
          </span>
        </div>

        {/* Center Pill Navigation — exact SkyBound style */}
        <nav className="hidden lg:flex items-center gap-0.5 text-sm">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#fef08a] text-neutral-900"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions — "Log in" text + black "Sign up / Book" button */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/264812572188?text=Hello%20City%20Cab,%20I%20would%20like%20to%20inquire%20about%20a%20private%20transfer."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
          >
            WhatsApp
          </a>

          <button
            onClick={onOpenBooking}
            className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Book Transfer
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 bg-white rounded-2xl border border-neutral-100 shadow-xl space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                activeTab === item.id ? "bg-[#fef08a] text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-100">
            <a
              href="https://wa.me/264812572188"
              className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 font-semibold bg-emerald-50 rounded-xl"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: +264 81 257 2188</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
