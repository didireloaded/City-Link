import { Link } from "react-router-dom";
import { VEHICLE_CATEGORIES } from "@/data/trips";


export function RideFleet() {
  return <section className="mb-6"><h2 className="mb-3 text-lg font-extrabold text-primary">Choose your vehicle</h2><div className="grid grid-cols-2 gap-3">{VEHICLE_CATEGORIES.map(vehicle => <Link key={vehicle.id} to={`/vehicles/${vehicle.id}`} className="overflow-hidden rounded-lg border border-border vehicle-white"><img src={vehicle.imageUrl} alt={vehicle.model} className="h-28 w-full object-contain p-3" /><div className="p-3"><h3 className="text-sm font-extrabold text-primary">{vehicle.name}</h3><p className="mt-1 text-xs text-muted-foreground">{vehicle.capacity} passengers · {vehicle.luggageCapacity} bags</p><p className="mt-2 text-sm font-bold text-primary">N${vehicle.airportWindhoekRate}</p><p className="text-[10px] text-muted-foreground">HKIA ↔ Windhoek</p><p className="mt-2 text-xs font-bold text-primary">View vehicle →</p></div></Link>)}</div></section>;
}
