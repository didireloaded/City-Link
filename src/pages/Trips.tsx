import { useState } from "react";
import { Link } from "react-router-dom";
import { RatingModal } from "@/components/RatingModal";
import { ArrowRight, BellRing, Calendar, CarTaxiFront, MessageCircle, Phone, RotateCw, Star, Wallet, XCircle } from "lucide-react";
import { toast } from "sonner";
import { loadProfile, saveProfile } from "@/lib/profile";

interface BookedTransfer {
  id: string;
  ref: string;
  service: string;
  pickup: string;
  destination: string;
  vehicle: string;
  amount: number;
  date: string;
  time: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  driverState: string;
  paymentState: string;
  rated?: boolean;
}

const seed: BookedTransfer[] = [
  {
    id: "1",
    ref: "WCC-2407",
    service: "Airport Transfer",
    pickup: "Hosea Kutako Arrivals Hall",
    destination: "Windhoek West",
    vehicle: "SUV",
    amount: 900,
    date: new Date(Date.now() + 86400000).toISOString(),
    time: "14:30",
    status: "upcoming",
    driverState: "Driver assigned",
    paymentState: "Paid",
  },
  {
    id: "2",
    ref: "WCC-1904",
    service: "City Transfer",
    pickup: "Hilton Windhoek",
    destination: "Eros Airport",
    vehicle: "Sedan",
    amount: 0,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    time: "09:00",
    status: "completed",
    driverState: "Completed",
    paymentState: "Settled",
  },
];

const tabs = ["upcoming", "active", "completed", "cancelled"] as const;

const Trips = () => {
  const [tab, setTab] = useState<BookedTransfer["status"]>("upcoming");
  const [bookings, setBookings] = useState(seed);
  const [rating, setRating] = useState<BookedTransfer | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookedTransfer | null>(null);
  const [profile, setProfile] = useState(() => loadProfile());

  const list = bookings.filter((booking) => booking.status === tab);

  const executeCancel = () => {
    if (!cancelTarget) return;
    setBookings((items) => items.map((item) => item.id === cancelTarget.id ? { ...item, status: "cancelled" } : item));
    const updatedBalance = (profile.walletBalanceNAD || 0) + cancelTarget.amount;
    const updatedProfile = { ...profile, walletBalanceNAD: updatedBalance };
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    toast.success(`Transfer #${cancelTarget.ref} cancelled. N$${cancelTarget.amount} credited to your wallet.`);
    setCancelTarget(null);
  };

  return (
    <div className="safe-page bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-5">
          <h1 className="text-xl font-extrabold text-primary">My Transfers</h1>
          <div className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-extrabold text-accent">
            <Wallet className="h-3.5 w-3.5" />
            <span>N${(profile.walletBalanceNAD || 0).toLocaleString()} Credit</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pt-4">
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-secondary p-1">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`h-10 rounded-lg text-[11px] font-extrabold capitalize transition-all ${
                tab === item ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "upcoming" && list.length > 0 && (
          <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/10 p-4 space-y-2.5 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold text-primary">
                <BellRing className="h-4 w-4 text-accent animate-bounce" />
                <span>Driver and pickup alerts</span>
              </span>
              <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-extrabold text-success uppercase">
                Active
              </span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              City Cab will share driver, vehicle and ETA updates before pickup.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {list.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
              <CarTaxiFront className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-semibold text-muted-foreground">No {tab} transfers yet.</p>
              <Link to="/book" className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-extrabold text-accent-foreground">
                Book a Transfer
              </Link>
            </div>
          )}

          {list.map((booking) => (
            <article key={booking.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-fade-up">
              <div className="bg-primary p-4 text-primary-foreground">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase text-white/70">{booking.ref}</p>
                    <h2 className="mt-1 flex items-center gap-2 text-lg font-extrabold">
                      {booking.pickup} <ArrowRight className="h-4 w-4 text-accent" /> {booking.destination}
                    </h2>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-xs font-extrabold">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {booking.paymentState}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-accent" /> {formatDate(booking.date)}
                  </span>
                  <span>{booking.time}</span>
                  <span>{booking.vehicle}</span>
                </div>

                <div className="mt-4 rounded-xl bg-secondary p-3 text-sm font-semibold text-muted-foreground flex items-center justify-between">
                  <span>{booking.service} · {booking.driverState}</span>
                  <span className="text-xs font-extrabold text-primary">{booking.amount ? `N$${booking.amount}` : "Request Quote"}</span>
                </div>

                {booking.status === "upcoming" || booking.status === "active" ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link to={`/track?id=${booking.ref}`} className="flex h-11 items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground shadow-xs active:scale-95 transition-transform">
                      View Transfer
                    </Link>
                    <a href="tel:+264812572188" className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-secondary text-xs font-extrabold text-primary active:scale-95 transition-transform">
                      <Phone className="h-3.5 w-3.5 text-accent" /> Contact Driver
                    </a>
                    <a href="https://wa.me/264812572188" target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-success/30 bg-success/10 text-xs font-extrabold text-success active:scale-95 transition-transform">
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp City Cab
                    </a>
                    <button onClick={() => setCancelTarget(booking)} className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 text-xs font-extrabold text-destructive active:scale-95 transition-all">
                      <XCircle className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {!booking.rated && (
                      <button onClick={() => setRating(booking)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">
                        <Star className="h-4 w-4" /> Rate
                      </button>
                    )}
                    <Link to={`/results?from=${booking.pickup}&to=${booking.destination}&date=${new Date().toISOString().slice(0, 10)}&passengers=1&tripType=one-way`} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-primary-foreground">
                      <RotateCw className="h-4 w-4" /> Book Again
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-5 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-destructive">Cancel Transfer</h3>
            <p className="text-xs font-semibold text-muted-foreground">
              Cancel transfer #{cancelTarget.ref}. Any paid amount shown in this demo is returned to your wallet.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" onClick={() => setCancelTarget(null)} className="h-11 rounded-xl bg-secondary text-xs font-extrabold text-muted-foreground">
                Keep Transfer
              </button>
              <button type="button" onClick={executeCancel} className="h-11 rounded-xl bg-destructive text-xs font-extrabold text-destructive-foreground shadow-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <RatingModal
        open={!!rating}
        onOpenChange={(open) => !open && setRating(null)}
        tripLabel={rating ? `${rating.pickup} to ${rating.destination}` : "City Cab Transfer"}
        onSubmitted={() => {
          if (rating) setBookings((items) => items.map((item) => item.id === rating.id ? { ...item, rated: true } : item));
          setRating(null);
        }}
      />
    </div>
  );
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export default Trips;
