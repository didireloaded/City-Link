import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Brand";
import { Package, Search, LayoutDashboard, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Book a trip", icon: Search },
  { to: "/parcel", label: "Send parcel", icon: Package },
  { to: "/track", label: "Track", icon: Package },
];

export const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="container flex items-center justify-between h-16">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === l.to
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border">
          <div className="container py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm rounded-lg hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
