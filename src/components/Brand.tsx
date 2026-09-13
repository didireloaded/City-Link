import { Armchair, CarTaxiFront, Droplets, Luggage, MapPin, ShieldCheck, Snowflake, UserCheck, Wifi, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group" aria-label="Windhoek City Cab home">
    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[var(--shadow-elegant)] group-hover:scale-105 transition-transform">
      <CarTaxiFront className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-bold text-lg" style={{ fontFamily: "Sora" }}>
        City Cab
      </span>
      <span className="text-[10px] uppercase text-muted-foreground">Windhoek Transfers</span>
    </div>
  </Link>
);

export const AmenityIcon = ({ a }: { a: string }) => {
  const map: Record<string, JSX.Element> = {
    AC: <Snowflake className="w-3.5 h-3.5" />,
    WiFi: <Wifi className="w-3.5 h-3.5" />,
    USB: <Zap className="w-3.5 h-3.5" />,
    Reclining: <Armchair className="w-3.5 h-3.5" />,
    Snacks: <Droplets className="w-3.5 h-3.5" />,
    Toilet: <MapPin className="w-3.5 h-3.5" />,
    Safety: <ShieldCheck className="w-3.5 h-3.5" />,
    "Meet & Greet": <UserCheck className="w-3.5 h-3.5" />,
    "Luggage Help": <Luggage className="w-3.5 h-3.5" />,
    "Child Seat": <Armchair className="w-3.5 h-3.5" />,
    "Bottled Water": <Droplets className="w-3.5 h-3.5" />,
    "Smoke Free": <ShieldCheck className="w-3.5 h-3.5" />,
    Private: <CarTaxiFront className="w-3.5 h-3.5" />,
    "4x4": <CarTaxiFront className="w-3.5 h-3.5" />,
    Chauffeur: <UserCheck className="w-3.5 h-3.5" />,
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary text-[11px] font-semibold text-muted-foreground">
      {map[a]} {a}
    </span>
  );
};
