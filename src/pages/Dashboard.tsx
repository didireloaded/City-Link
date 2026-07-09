import { useEffect, useState } from "react";
import { TRIPS } from "@/data/trips";
import { TrendingUp, Users, Package, DollarSign, Star, Filter } from "lucide-react";
import { TopBar } from "@/components/TopBar";

interface Review {
  id: number;
  trip: string;
  driver: number;
  service: number;
  comment: string;
  at: string;
}

const seedReviews: Review[] = [
  { id: 1, trip: "Windhoek → Oshakati", driver: 5, service: 5, comment: "Smooth ride, very professional driver.", at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, trip: "Windhoek → Ondangwa", driver: 4, service: 5, comment: "Bus was clean and on time.", at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 3, trip: "Windhoek → Oshakati", driver: 2, service: 3, comment: "Departure was delayed by 30 minutes.", at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 4, trip: "Windhoek → Walvis Bay", driver: 5, service: 4, comment: "Great service overall.", at: new Date(Date.now() - 86400000 * 4).toISOString() },
];

const Dashboard = () => {
  const totalSeats = TRIPS.reduce((s, t) => s + t.bus.capacity, 0);
  const booked = TRIPS.reduce((s, t) => s + t.bookedSeats.length, 0);
  const revenue = TRIPS.reduce((s, t) => s + t.bookedSeats.length * t.price, 0);
  const occupancy = Math.round((booked / totalSeats) * 100);

  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [filter, setFilter] = useState<"all" | "low">("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("citylink_reviews") || "[]");
    if (stored.length) setReviews([...stored, ...seedReviews]);
  }, []);

  const filtered = filter === "low" ? reviews.filter((r) => r.driver <= 3 || r.service <= 3) : reviews;
  const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.driver + r.service) / 2, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar title="Admin dashboard" subtitle="Operations overview" back="/profile" />

      <div className="px-4 pt-4 space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Today</span>
          <h2 className="text-2xl font-bold tracking-tight mt-0.5">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Users} label="Bookings" value={booked} sub="+12% vs yest" />
          <Stat icon={DollarSign} label="Revenue" value={`N$${revenue.toLocaleString()}`} sub="All trips" />
          <Stat icon={TrendingUp} label="Occupancy" value={`${occupancy}%`} sub={`${totalSeats - booked} left`} />
          <Stat icon={Package} label="Parcels" value={28} sub="14 in transit" />
        </div>

        <div className="card-elevated rounded-3xl p-5">
          <h3 className="font-semibold mb-4 text-sm">Trips today</h3>
          <div className="space-y-3">
            {TRIPS.map((t) => {
              const pct = Math.round((t.bookedSeats.length / t.bus.capacity) * 100);
              return (
                <div key={t.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">{t.from} → {t.to}</div>
                    <div className="text-[10px] text-muted-foreground">{t.departure} · {t.bus.name}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews */}
        <div className="card-elevated rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Reviews</h3>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-primary text-primary" /> {avg} avg · {reviews.length} ratings
              </div>
            </div>
            <button
              onClick={() => setFilter(filter === "all" ? "low" : "all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                filter === "low" ? "bg-destructive/15 text-destructive" : "bg-secondary text-muted-foreground"
              }`}
            >
              <Filter className="w-3 h-3" />
              {filter === "low" ? "Low ratings" : "All"}
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-2xl bg-secondary/30 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-semibold text-sm">{r.trip}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(r.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
                </div>
                <div className="flex gap-4 text-xs mb-2">
                  <RatingBadge label="Driver" value={r.driver} />
                  <RatingBadge label="Service" value={r.service} />
                </div>
                {r.comment && <p className="text-xs text-muted-foreground italic">"{r.comment}"</p>}
              </div>
            ))}
            {filtered.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No reviews match this filter.</p>}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground">Demo data — connect Cloud for real bookings, auth & roles.</p>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: any; sub: string }) => (
  <div className="card-elevated rounded-2xl p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    <div className="text-xl font-bold">{value}</div>
    <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
  </div>
);

const RatingBadge = ({ label, value }: { label: string; value: number }) => (
  <span className="flex items-center gap-1">
    <span className="text-muted-foreground">{label}</span>
    <span className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-3 h-3 ${n <= value ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
      ))}
    </span>
  </span>
);

export default Dashboard;
