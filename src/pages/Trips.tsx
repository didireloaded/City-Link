import { useState } from "react";
import { Link } from "react-router-dom";
import { RatingModal } from "@/components/RatingModal";
import { TRIPS } from "@/data/trips";
import { ArrowRight, BellRing, Calendar, RotateCw, Star, Ticket, XCircle, Clock, Wallet, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { loadProfile, saveProfile } from "@/lib/profile";

interface BookedTrip {
  id: string;
  tripId: string;
  ref: string;
  seats: string[];
  date: string;
  status: "upcoming" | "completed";
  reminder?: boolean;
  rated?: boolean;
  delayMinutes?: number;
}

const seed: BookedTrip[] = [
  {
    id: "1",
    tripId: "t1",
    ref: "CL8X4K2P",
    seats: ["12A"],
    date: new Date(Date.now() + 86400000).toISOString(),
    status: "upcoming",
    reminder: true,
    delayMinutes: 0,
  },
  {
    id: "2",
    tripId: "t5",
    ref: "CL2M9LQ1",
    seats: ["7C", "7D"],
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: "completed",
  },
  {
    id: "3",
    tripId: "t4",
    ref: "CLR4PQXV",
    seats: ["4B"],
    date: new Date(Date.now() - 86400000 * 18).toISOString(),
    status: "completed",
    rated: true,
  },
];

const Trips = () => {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const [bookings, setBookings] = useState(seed);
  const [rating, setRating] = useState<BookedTrip | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<BookedTrip | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookedTrip | null>(null);
  const [newDateInput, setNewDateInput] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)
  );
  const [profile, setProfile] = useState(() => loadProfile());

  const list = bookings.filter((booking) => booking.status === tab);

  const executeCancel = () => {
    if (!cancelTarget) return;
    const trip = TRIPS.find((t) => t.id === cancelTarget.tripId);
    const refundAmount = (trip?.price || 350) * cancelTarget.seats.length;
    
    setBookings((items) => items.filter((item) => item.id !== cancelTarget.id));
    const updatedBalance = (profile.walletBalanceNAD || 0) + refundAmount;
    const updatedProfile = { ...profile, walletBalanceNAD: updatedBalance };
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    toast.success(`Booking #${cancelTarget.ref} cancelled! N$${refundAmount} credited to your In-App Wallet.`);
    setCancelTarget(null);
  };

  const executeReschedule = () => {
    if (!rescheduleTarget || !newDateInput) {
      toast.error("Please pick a valid departure date.");
      return;
    }
    const parsed = new Date(newDateInput + "T06:30:00");
    if (isNaN(parsed.getTime())) {
      toast.error("Invalid date selected.");
      return;
    }
    setBookings((items) =>
      items.map((item) =>
        item.id === rescheduleTarget.id
          ? { ...item, date: parsed.toISOString() }
          : item
      )
    );
    toast.success(`Trip #${rescheduleTarget.ref} rescheduled to ${formatDate(newDateInput)} without penalty!`);
    setRescheduleTarget(null);
  };

  const toggleReminder = (id: string) => {
    setBookings((items) => items.map((item) => (item.id === id ? { ...item, reminder: !item.reminder } : item)));
    toast.success("Departure reminders (2h & 30min prior via SMS/Push) active!");
  };

  const simulateDelayBroadcast = (bookingId: string) => {
    setBookings((items) =>
      items.map((item) =>
        item.id === bookingId ? { ...item, delayMinutes: (item.delayMinutes || 0) === 0 ? 20 : 0 } : item
      )
    );
    toast.info("Toggled live delay broadcast alert!");
  };

  return (
    <div className="safe-page bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-5">
          <h1 className="text-xl font-extrabold text-primary">Tickets & My Trips</h1>
          <div className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-extrabold text-accent">
            <Wallet className="h-3.5 w-3.5" />
            <span>N${(profile.walletBalanceNAD || 0).toLocaleString()} Credit</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pt-4">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
          {(["upcoming", "completed"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`h-10 rounded-lg text-sm font-extrabold capitalize transition-all ${
                tab === item ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Live Departure & Delay Broadcast Alert */}
        {tab === "upcoming" && list.length > 0 && (
          <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/10 p-4 space-y-2.5 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold text-primary">
                <BellRing className="h-4 w-4 text-accent animate-bounce" />
                <span>Live Departure & Delay Alerts</span>
              </span>
              <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-extrabold text-success uppercase">
                Active Feed
              </span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              Push and SMS reminders automatically trigger <span className="font-bold text-primary">2 hours and 30 minutes</span> before departure.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {list.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
              <Ticket className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-semibold text-muted-foreground">No {tab} tickets yet.</p>
              <Link to="/book" className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-extrabold text-accent-foreground">
                Book a Trip
              </Link>
            </div>
          )}

          {list.map((booking) => {
            const trip = TRIPS.find((item) => item.id === booking.tripId);
            if (!trip) return null;

            return (
              <article key={booking.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-fade-up">
                <div className="bg-primary p-4 text-primary-foreground">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-extrabold uppercase text-white/70">{booking.ref}</p>
                        {booking.status === "upcoming" && (
                          <button
                            type="button"
                            onClick={() => simulateDelayBroadcast(booking.id)}
                            className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase transition-all ${
                              booking.delayMinutes && booking.delayMinutes > 0
                                ? "bg-destructive text-white animate-pulse"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                            title="Staff Simulation: Toggle delay broadcast alert"
                          >
                            {booking.delayMinutes && booking.delayMinutes > 0 ? `Delayed +${booking.delayMinutes}m` : "Status: On Time"}
                          </button>
                        )}
                      </div>
                      <h2 className="mt-1 flex items-center gap-2 text-lg font-extrabold">
                        {trip.from} <ArrowRight className="h-4 w-4 text-accent" /> {trip.to}
                      </h2>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-xs font-extrabold">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {trip.bus.rating}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {booking.delayMinutes && booking.delayMinutes > 0 ? (
                    <div className="mb-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs font-bold text-destructive flex items-center gap-2 animate-pulse">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Coach delayed approx {booking.delayMinutes} minutes due to B1 highway maintenance. Departure revised.</span>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-3 gap-3 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-accent" /> {formatDate(booking.date)}
                    </span>
                    <span>⏰ {trip.departure}</span>
                    <span>💺 Seat {booking.seats.join(", ")}</span>
                  </div>

                  <div className="mt-4 rounded-xl bg-secondary p-3 text-sm font-semibold text-muted-foreground flex items-center justify-between">
                    <span>{trip.bus.name} - {trip.pickup}</span>
                    <span className="text-xs font-extrabold text-primary">N${trip.price * booking.seats.length}</span>
                  </div>

                  {booking.status === "upcoming" ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        to={`/confirmation?ref=${booking.ref}&trip=${trip.id}&seats=${booking.seats.join(",")}&total=${
                          trip.price * booking.seats.length
                        }&name=Passenger`}
                        className="flex h-11 items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground shadow-xs active:scale-95 transition-transform"
                      >
                        View QR Ticket
                      </Link>
                      <button
                        onClick={() => toggleReminder(booking.id)}
                        className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-secondary text-xs font-extrabold text-primary active:scale-95 transition-transform"
                      >
                        <BellRing className="h-3.5 w-3.5 text-accent" /> {booking.reminder ? "2h/30m Alert On" : "Remind Me"}
                      </button>

                      {/* Self-Service Reschedule Button */}
                      <button
                        onClick={() => setRescheduleTarget(booking)}
                        className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 text-xs font-extrabold text-accent hover:bg-accent/20 active:scale-95 transition-all"
                      >
                        <Clock className="h-3.5 w-3.5" /> Reschedule Date
                      </button>

                      {/* Self-Service Cancel & Refund to Store Credit Wallet Button */}
                      <button
                        onClick={() => setCancelTarget(booking)}
                        className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 text-xs font-extrabold text-destructive hover:bg-destructive/15 active:scale-95 transition-all"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Cancel & Refund
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {!booking.rated && (
                        <button
                          onClick={() => setRating(booking)}
                          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-extrabold text-accent-foreground"
                        >
                          <Star className="h-4 w-4" /> Rate Trip
                        </button>
                      )}
                      <Link
                        to={`/results?from=${trip.from}&to=${trip.to}&date=${new Date().toISOString().slice(0, 10)}&passengers=1&tripType=one-way`}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-primary-foreground"
                      >
                        <RotateCw className="h-4 w-4" /> Rebook Route
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Self-Service Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" /> Reschedule Booking
              </h3>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              City-Link Flexible Policy allows free date changes up to 6 hours prior to departure. Select your new travel date below:
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground">New Departure Date</label>
              <input
                type="date"
                value={newDateInput}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setNewDateInput(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-xs font-bold text-primary focus:border-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="h-11 rounded-xl bg-secondary text-xs font-extrabold text-muted-foreground hover:text-foreground"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={executeReschedule}
                className="h-11 rounded-xl bg-accent text-xs font-extrabold text-accent-foreground shadow-sm active:scale-95 transition-transform"
              >
                Confirm New Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Self-Service Cancel & Refund Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-destructive flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" /> Cancel Booking #{cancelTarget.ref}
              </h3>
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="rounded-2xl bg-secondary/50 p-3.5 text-xs font-bold space-y-1 text-primary">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats to Cancel:</span>
                <span>{cancelTarget.seats.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Refund Policy:</span>
                <span className="text-success font-extrabold">100% In-App Store Credit</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-1 mt-1 text-sm">
                <span>Credit to Wallet:</span>
                <span className="text-primary font-extrabold">
                  N${(TRIPS.find((t) => t.id === cancelTarget.tripId)?.price || 350) * cancelTarget.seats.length}
                </span>
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              Upon confirmation, your reservation will be cancelled instantly and the full fare credited directly to your CityLink store credit wallet for immediate use on future trips.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="h-11 rounded-xl bg-secondary text-xs font-extrabold text-muted-foreground hover:text-foreground"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={executeCancel}
                className="h-11 rounded-xl bg-destructive text-xs font-extrabold text-destructive-foreground shadow-sm active:scale-95 transition-transform"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      <RatingModal
        open={!!rating}
        tripLabel={rating ? `${TRIPS.find((trip) => trip.id === rating.tripId)?.from} to ${TRIPS.find((trip) => trip.id === rating.tripId)?.to}` : ""}
        onClose={() => setRating(null)}
        onSubmit={() => {
          if (rating) {
            setBookings((items) => items.map((item) => (item.id === rating.id ? { ...item, rated: true } : item)));
          }
        }}
      />
    </div>
  );
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Date TBD";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

export default Trips;
