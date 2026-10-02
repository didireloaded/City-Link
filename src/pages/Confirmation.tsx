import { Link, useSearchParams } from "react-router-dom";
import { Check, Download, Home, RefreshCw } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { trpc } from "@/providers/trpc";

const statusLabels: Record<string, string> = {
  held: "Reservation pending", confirmed: "Ride confirmed", dispatched: "Driver assigned",
  completed: "Ride completed", cancelled: "Ride cancelled",
};

export default function Confirmation() {
  const [params] = useSearchParams();
  const reference = params.get("ref") || "";
  const query = trpc.bookings.trackByReference.useQuery({ reference }, {
    enabled: reference.length >= 3 && reference.length <= 20,
    refetchInterval: 10000, refetchIntervalInBackground: false, retry: false,
  });
  const booking = query.data;
  return <div className="safe-page bg-background">
    <TopBar title="Your ride" back="/trips" />
    <main className="mx-auto max-w-md space-y-5 px-4 py-6">
      {!booking ? <section className="rounded-lg border border-border bg-card p-5">
        <h1 className="text-lg font-bold">{query.isLoading ? "Checking your booking" : "Booking not verified"}</h1>
        <p role="status" className="mt-2 text-sm text-muted-foreground">{query.isLoading ? "Loading the latest ride status." : query.error?.message || "Open a confirmed ride from My Rides to see its details."}</p>
        {reference && <button onClick={() => query.refetch()} className="mt-4 flex items-center gap-2 font-bold"><RefreshCw className="h-4 w-4" />Retry</button>}
      </section> : <>
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-3"><Check className="h-6 w-6 text-accent" /><h1 aria-live="polite" className="text-xl font-bold">{statusLabels[booking.status] || booking.status}</h1></div>
          <p className="mt-2 text-xs text-muted-foreground">{booking.reference}</p>
          {query.error && <p role="alert" className="mt-3 text-sm text-destructive">Status refresh failed. Showing the last retrieved booking.</p>}
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            {[
              ["From", booking.fromLocation], ["To", booking.toLocation],
              ["Vehicle", booking.vehicle], ["Service", booking.service],
              ["Date", booking.travelDate], ["Time", booking.pickupTime],
              ["Pickup", booking.pickup || "Not specified"], ["Fare", "N$" + booking.amountNad],
              ["Passengers", String(booking.passengers)], ["Bags", String(booking.luggage)],
            ].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-bold">{value}</dd></div>)}
          </dl>
        </section>
        <button onClick={() => window.print()} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-secondary font-bold"><Download className="h-4 w-4" />Print ride details</button>
      </>}
      <div className="grid grid-cols-2 gap-3"><Link to="/trips" className="flex h-12 items-center justify-center rounded-lg bg-accent font-bold">My Rides</Link><Link to="/" className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-bold text-white"><Home className="h-4 w-4" />Home</Link></div>
    </main>
  </div>;
}
