import { Link, useParams } from "react-router-dom";
import { Luggage, Users, ArrowRight } from "lucide-react";
import { VEHICLE_CATEGORIES } from "@/data/trips";
import { TopBar } from "@/components/TopBar";
import { AmenityIcon } from "@/components/Brand";
import { bookingLink, serviceDefaults } from "@/lib/transfer-service";

export default function VehicleDetails() {
  const { vehicleId } = useParams();
  const vehicle = VEHICLE_CATEGORIES.find(item => item.id === vehicleId);
  if (!vehicle) return <div className="safe-page"><TopBar title="Vehicle not found" back="/trips" /></div>;
  return <div className="safe-page bg-background">
    <TopBar title={vehicle.name} back="/trips" />
    <main className="mx-auto max-w-md px-4 py-5">
      <section className="vehicle-white overflow-hidden rounded-lg border border-border">
        <img src={vehicle.imageUrl} alt={vehicle.model} className="h-60 w-full object-contain p-5" />
        <div className="space-y-5 p-5">
          <div><h1 className="text-xl font-extrabold text-primary">{vehicle.model}</h1><p className="mt-2 text-sm text-muted-foreground">{vehicle.safetyNote}</p></div>
          <div className="grid grid-cols-2 gap-3 text-sm font-bold"><span className="flex items-center gap-2"><Users className="h-4 w-4" />{vehicle.capacity} passengers</span><span className="flex items-center gap-2"><Luggage className="h-4 w-4" />{vehicle.luggageCapacity} bags</span></div>
          <div className="flex flex-wrap gap-2">{vehicle.amenities.map(amenity => <AmenityIcon key={amenity} a={amenity} />)}</div>
          <div className="border-t border-border pt-4"><p className="text-xs text-muted-foreground">HKIA ↔ Windhoek · one-way vehicle fare</p><p className="mt-1 text-2xl font-extrabold text-primary">N${vehicle.airportWindhoekRate}</p></div>
          <div><h2 className="mb-2 text-sm font-bold">Available services</h2><div className="grid grid-cols-3 gap-2">{Object.entries(serviceDefaults).filter(([, route]) => route.vehicles.includes(vehicle.id)).map(([service]) => <span key={service} className="rounded-lg bg-secondary p-2 text-center text-xs font-semibold">{service}</span>)}</div></div>
        </div>
      </section>
      <Link to={bookingLink("All", vehicle.id)} className="mt-5 flex h-14 items-center justify-center gap-2 rounded-lg bg-primary font-bold text-white">Choose this vehicle <ArrowRight className="h-4 w-4" /></Link>
    </main>
  </div>;
}
