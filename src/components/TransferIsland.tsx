import { Link } from "react-router-dom";
import { CarTaxiFront, MessageCircle, Phone, WalletCards } from "lucide-react";

export const TransferIsland = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={`rounded-[2rem] bg-[#05070b] p-3 text-white shadow-[0_18px_42px_rgba(0,0,0,0.45)] ring-1 ring-white/10 ${
      compact ? "" : "animate-fade-up"
    }`}
  >
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <CarTaxiFront className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold">N 123-456 W</p>
            <p className="truncate text-[10px] font-semibold text-white/55">Toyota Fortuner · Driver assigned</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-extrabold text-white">24 min</p>
            <p className="text-[10px] font-semibold text-white/50">4.5 km</p>
          </div>
        </div>

        <div className="mt-3 space-y-2 border-l border-white/20 pl-3">
          <div className="relative">
            <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-[#05070b]" />
            <p className="text-[10px] font-semibold text-white/50">Pickup</p>
            <p className="truncate text-xs font-extrabold">Hosea Kutako Arrivals Hall</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[18px] top-1 h-2 w-2 rounded-full bg-white/45 ring-2 ring-[#05070b]" />
            <p className="text-[10px] font-semibold text-white/50">Destination</p>
            <p className="truncate text-xs font-extrabold">17 Hahnemann Street, Windhoek West</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <a href="tel:+264812572188" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
          <Phone className="h-4 w-4" />
        </a>
        <a
          href="https://wa.me/264812572188"
          target="_blank"
          rel="noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>
      <Link
        to="/track?id=WCC-2407"
        className="flex h-10 items-center gap-2 rounded-full bg-white/12 px-4 text-xs font-extrabold text-white"
      >
        <WalletCards className="h-4 w-4 text-accent" />
        NAD 900
      </Link>
    </div>
  </div>
);
