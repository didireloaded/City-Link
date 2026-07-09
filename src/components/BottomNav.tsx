import { Link, useLocation } from "react-router-dom";
import { Bus, Home, Package, Ticket, User } from "lucide-react";
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
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md px-3 pb-3">
        <div className="relative flex h-[70px] items-center justify-between rounded-2xl border border-border bg-card px-2 shadow-[var(--shadow-elegant)]">
          <SideTab to="/" label="Home" icon={<Home className="h-5 w-5" />} active={pathname === "/"} />
          <SideTab to="/tickets" label="Tickets" icon={<Ticket className="h-5 w-5" />} active={is("/tickets") || is("/trips")} />
          <Link
            to="/book"
            aria-label="Book a trip"
            className={cn(
              "absolute left-1/2 top-[-26px] flex h-[66px] w-[66px] -translate-x-1/2 flex-col items-center justify-center rounded-full",
              "bg-accent text-accent-foreground shadow-[var(--shadow-glow)] ring-4 ring-background transition-transform active:scale-95",
              isBook && "scale-105"
            )}
          >
            <Bus className="h-5 w-5" />
            <span className="mt-0.5 text-[10px] font-extrabold uppercase">Book</span>
          </Link>
          <div className="w-[64px] shrink-0" />
          <SideTab to="/parcels" label="Parcels" icon={<Package className="h-5 w-5" />} active={is("/parcels") || is("/parcel") || is("/track")} />
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
      "flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold transition-colors",
      active ? "text-accent" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
