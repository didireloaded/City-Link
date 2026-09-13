import { Link, useLocation } from "react-router-dom";
import { BriefcaseBusiness, CarTaxiFront, Home, MapPinned, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const { pathname } = useLocation();
  const is = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  const isBook =
    pathname === "/book" ||
    pathname.startsWith("/book/") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/confirmation");

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <div className="mx-auto max-w-md px-3 pb-3 pointer-events-auto">
        <div className="relative flex h-[74px] items-center justify-between rounded-[28px] border border-white/15 bg-[#0a192f]/90 px-3 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
          <SideTab to="/" label="Home" icon={<Home className="h-5 w-5" />} active={pathname === "/"} />
          <SideTab to="/tickets" label="Transfers" icon={<MapPinned className="h-5 w-5" />} active={is("/tickets") || is("/trips")} />
          
          <Link
            to="/book"
            aria-label="Book a transfer"
            className={cn(
              "absolute left-1/2 top-[-24px] flex h-[70px] w-[70px] -translate-x-1/2 flex-col items-center justify-center rounded-full transition-all active:scale-95",
              "bg-gradient-to-tr from-accent via-accent to-[#8fd8ff] text-accent-foreground shadow-[0_8px_25px_rgba(94, 197, 239,0.6)] ring-4 ring-[#0a192f]",
              isBook && "scale-105 ring-8 ring-accent/20"
            )}
          >
            <CarTaxiFront className="h-6 w-6 stroke-[2.5]" />
            <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider">Book</span>
          </Link>

          <div className="w-[72px] shrink-0" />
          
          <SideTab to="/parcels" label="Services" icon={<BriefcaseBusiness className="h-5 w-5" />} active={is("/parcels") || is("/parcel") || is("/track")} />
          <SideTab to="/profile" label="Profile" icon={<User className="h-5 w-5" />} active={is("/profile")} />
        </div>
      </div>
    </nav>
  );
};

const SideTab = ({ to, label, icon, active }: { to: string; label: string; icon: React.ReactNode; active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-extrabold transition-all active:scale-95",
      active ? "text-accent scale-105" : "text-white/60 hover:text-white"
    )}
  >
    {active && (
      <span className="absolute top-2.5 h-1 w-5 rounded-full bg-accent shadow-[0_0_10px_rgba(94, 197, 239,0.8)]" />
    )}
    <div className={cn("transition-transform", active && "scale-110")}>{icon}</div>
    <span className="tracking-tight">{label}</span>
  </Link>
);
