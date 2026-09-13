import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

export const CityCabFooter = () => {
  return (
    <footer className="w-full pt-12 pb-8 px-2 md:px-4 border-t border-neutral-200/80 mt-12 text-neutral-600">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Column 1: Brand & Bio */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">
              <span className="text-amber-300 font-black">C</span>
            </div>
            <span className="font-extrabold text-lg text-neutral-900 tracking-tight">City Cab</span>
            <span className="text-[10px] font-semibold uppercase bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
              Namibia
            </span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
            Namibia's trusted private transfer and chauffeur service since 2014. Airport transfers, lodge travel, safari routes, executive business travel and contracted staff transport.
          </p>
          <div className="text-[11px] text-neutral-400">
            JS City Cab cc T/A City Cab Transfers
          </div>
        </div>

        {/* Column 2: Services */}
        <div>
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
            Transfer Services
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600">
            <li><a href="#transfers" className="hover:text-neutral-950 transition-colors">Hosea Kutako Airport Transfers</a></li>
            <li><a href="#transfers" className="hover:text-neutral-950 transition-colors">Windhoek City & Hotel Transfers</a></li>
            <li><a href="#transfers" className="hover:text-neutral-950 transition-colors">Safari & Wilderness Lodge Transfers</a></li>
            <li><a href="#corporate" className="hover:text-neutral-950 transition-colors">VIP Executive Chauffeur Service</a></li>
            <li><a href="#corporate" className="hover:text-neutral-950 transition-colors">Recurring Staff & Team Transport</a></li>
          </ul>
        </div>

        {/* Column 3: Destinations */}
        <div>
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
            Key Destinations
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600">
            <li><a href="#destinations" className="hover:text-neutral-950 transition-colors">Windhoek (Central, West, Klein Windhoek)</a></li>
            <li><a href="#destinations" className="hover:text-neutral-950 transition-colors">Swakopmund & Walvis Bay Coast</a></li>
            <li><a href="#destinations" className="hover:text-neutral-950 transition-colors">Sossusvlei & Namib-Naukluft Park</a></li>
            <li><a href="#destinations" className="hover:text-neutral-950 transition-colors">Etosha National Park Wildlife Lodges</a></li>
            <li><a href="#destinations" className="hover:text-neutral-950 transition-colors">Fish River Canyon & Southern Namibia</a></li>
          </ul>
        </div>

        {/* Column 4: Contact Information */}
        <div>
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
            Contact & Location
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
              <span>17 Hahnemann Street, Windhoek West, Namibia</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>+264 81 257 2188 / +264 81 292 2333</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <a href="https://wa.me/264812572188" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold hover:underline">
                WhatsApp: +264 81 257 2188 (24/7)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <a href="mailto:info@whk-citycab.com" className="hover:text-neutral-950">
                info@whk-citycab.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal row */}
      <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
        <div>
          © 2014–2026 JS City Cab cc (T/A City Cab Transfers Namibia). All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Licensed Passenger Carrier</span>
          <span>·</span>
          <span>Full Passenger Liability Insurance</span>
          <span>·</span>
          <span>Operating 24/7/365</span>
        </div>
      </div>
    </footer>
  );
};
