import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, Ticket, HelpCircle, MessageCircle, LogOut, ChevronRight,
  Heart, Settings, Shield, Star, ArrowRight, Trash2, Plus, X, Check,
} from "lucide-react";
import { loadProfile, saveProfile, clearProfile, Profile as ProfileT } from "@/lib/profile";
import { ROUTES } from "@/data/trips";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

type Pane = null | "edit" | "saved" | "passengers" | "settings" | "privacy" | "ratings" | "faq" | "support";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileT>(() => loadProfile());
  const [pane, setPane] = useState<Pane>(null);

  const update = (p: ProfileT) => { setProfile(p); saveProfile(p); };

  const ratings = (() => {
    try { return JSON.parse(localStorage.getItem("citylink_ratings") || "[]"); } catch { return []; }
  })();

  const logout = () => {
    clearProfile();
    toast.success("Logged out");
    setProfile(loadProfile());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-30 glass">
        <div className="px-5 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Profile</h1>
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-extrabold text-accent">
            ✨ Gold VIP Status
          </span>
        </div>
      </header>

      <div className="px-5 pt-5">
        <div className="card-elevated rounded-3xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{profile.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1.5 truncate">
              <Phone className="w-3.5 h-3.5 shrink-0" />{profile.phone}
            </div>
          </div>
          <button onClick={() => setPane("edit")} className="text-xs px-3 py-1.5 rounded-full bg-secondary font-medium shrink-0">Edit</button>
        </div>

        {/* Loyalty & Wallet VIP Banner */}
        <div className="mt-5 rounded-3xl border border-accent/40 bg-gradient-to-br from-primary/95 to-primary p-5 text-primary-foreground shadow-[var(--shadow-elegant)] space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent">In-App Store Credit Wallet</span>
              <div className="text-2xl font-extrabold mt-0.5">N${(profile.walletBalanceNAD || 0).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent">Loyalty Points</span>
              <div className="text-xl font-extrabold mt-0.5">🌟 {(profile.loyaltyPoints || 450).toLocaleString()} PTS</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-white/80">
            <span>Redeem points on next checkout</span>
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-extrabold text-accent-foreground">
              Code: {profile.referralCode || "CL-NAM-VIP"}
            </span>
          </div>
        </div>

        <Section title="Travel & Passengers">
          <Row to="/trips" icon={<Ticket />} label="My trips" sub="History & upcoming" />
          <Row onClick={() => setPane("saved")} icon={<Heart />} label="Saved routes" sub={`${profile.savedRoutes?.length || 0} favourites`} />
          <Row onClick={() => setPane("passengers")} icon={<Star />} label="Saved passengers" sub={`${profile.savedPassengers?.length || 0} quick-fill profiles`} />
          <Row onClick={() => setPane("ratings")} icon={<Star />} label="My ratings" sub={`${ratings.length} review${ratings.length === 1 ? "" : "s"} left`} />
        </Section>

        <Section title="Preferences">
          <Row onClick={() => setPane("settings")} icon={<Settings />} label="App settings" sub="Notifications, language" />
          <Row onClick={() => setPane("privacy")} icon={<Shield />} label="Privacy & data" sub="Manage your data" />
        </Section>

        <Section title="Support">
          <Row onClick={() => setPane("faq")} icon={<HelpCircle />} label="Help & FAQ" sub="Common questions" />
          <Row onClick={() => setPane("support")} icon={<MessageCircle />} label="Contact support" sub="WhatsApp · Call · Email" />
        </Section>

        <button onClick={logout} className="mt-6 w-full h-14 rounded-2xl border border-destructive/30 text-destructive font-semibold flex items-center justify-center gap-2 hover:bg-destructive/10 active:scale-[0.98] transition-transform">
          <LogOut className="w-5 h-5" /> Logout
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">City-Link · Luxury Coach Travel 🇳🇦</p>
      </div>

      {/* EDIT */}
      <Dialog open={pane === "edit"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Field label="Full name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <Field label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
            <Field label="Email" value={profile.email || ""} onChange={(v) => setProfile({ ...profile, email: v })} />
          </div>
          <DialogFooter>
            <button onClick={() => { saveProfile(profile); toast.success("Profile updated"); setPane(null); }} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-bold">
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SAVED ROUTES */}
      <Dialog open={pane === "saved"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>Saved routes</DialogTitle></DialogHeader>
          <SavedRoutesEditor profile={profile} onChange={update} onClose={() => setPane(null)} />
        </DialogContent>
      </Dialog>

      {/* SAVED PASSENGERS */}
      <Dialog open={pane === "passengers"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>Saved passengers</DialogTitle></DialogHeader>
          <SavedPassengersEditor profile={profile} onChange={update} />
        </DialogContent>
      </Dialog>

      {/* SETTINGS */}
      <Dialog open={pane === "settings"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>App settings</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Toggle label="Push notifications" sub="Trip alerts & reminders"
              checked={!!profile.preferences?.notifications}
              onChange={(v) => update({ ...profile, preferences: { ...profile.preferences!, notifications: v } })} />
            <Toggle label="Promo emails" sub="Deals and discounts"
              checked={!!profile.preferences?.promoEmails}
              onChange={(v) => update({ ...profile, preferences: { ...profile.preferences!, promoEmails: v } })} />
            <div className="rounded-2xl bg-secondary/40 p-4">
              <div className="text-sm font-semibold mb-2">Language</div>
              <div className="grid grid-cols-2 gap-2">
                {(["en", "af"] as const).map((l) => (
                  <button key={l}
                    onClick={() => update({ ...profile, preferences: { ...profile.preferences!, language: l } })}
                    className={`h-10 rounded-xl text-sm font-semibold ${profile.preferences?.language === l ? "bg-primary text-primary-foreground" : "bg-background border border-border"}`}>
                    {l === "en" ? "English" : "Afrikaans"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PRIVACY */}
      <Dialog open={pane === "privacy"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>Privacy & data</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Your data stays on this device. We don't sell your information.</p>
            <button onClick={() => { localStorage.removeItem("citylink_parcels"); toast.success("Parcel history cleared"); }}
              className="w-full h-12 rounded-2xl bg-secondary font-semibold text-foreground">
              Clear parcel history
            </button>
            <button onClick={() => { localStorage.removeItem("citylink_ratings"); toast.success("Ratings cleared"); }}
              className="w-full h-12 rounded-2xl bg-secondary font-semibold text-foreground">
              Clear my ratings
            </button>
            <button onClick={() => { localStorage.clear(); toast.success("All local data cleared"); setProfile(loadProfile()); }}
              className="w-full h-12 rounded-2xl border border-destructive/30 text-destructive font-semibold">
              Delete all my data
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* RATINGS */}
      <Dialog open={pane === "ratings"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>My ratings</DialogTitle></DialogHeader>
          {ratings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No ratings yet. Complete a trip to leave a review.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-auto">
              {ratings.map((r: any, i: number) => (
                <div key={i} className="rounded-2xl bg-secondary/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{r.tripLabel || "Trip"}</div>
                    <div className="flex items-center gap-0.5 text-primary">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < r.stars ? "fill-primary" : "opacity-30"}`} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-xs text-muted-foreground mt-1">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ */}
      <Dialog open={pane === "faq"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>Help & FAQ</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-96 overflow-auto">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-2xl bg-secondary/40 p-3">
                <summary className="font-semibold text-sm cursor-pointer">{f.q}</summary>
                <p className="text-xs text-muted-foreground mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* SUPPORT */}
      <Dialog open={pane === "support"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>Contact support</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <a href="https://wa.me/264818767676" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-success/15 text-foreground">
              <MessageCircle className="w-5 h-5 text-success" />
              <div><div className="font-semibold text-sm">WhatsApp us</div><div className="text-xs text-muted-foreground">Avg reply: 3 min</div></div>
            </a>
            <a href="tel:0818767676" className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10">
              <Phone className="w-5 h-5 text-primary" />
              <div><div className="font-semibold text-sm">Call us</div><div className="text-xs text-muted-foreground">0818767676</div></div>
            </a>
            <a href="mailto:info@citylink.com.na" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50">
              <HelpCircle className="w-5 h-5" />
              <div><div className="font-semibold text-sm">Email</div><div className="text-xs text-muted-foreground">info@citylink.com.na</div></div>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FAQ = [
  { q: "How do I book a trip?", a: "Tap the Book button in the bottom nav, choose your route and seat, and pay. You'll get an e-ticket with QR code." },
  { q: "Can I cancel or change my booking?", a: "Yes, up to 6 hours before departure from My trips. A small admin fee may apply." },
  { q: "How does parcel tracking work?", a: "When a parcel is created, the receiver gets a tracking ID. Use the Track tab to see live status updates." },
  { q: "Is paying on board allowed?", a: "Yes, select 'Cash on board' at checkout. Your seat is reserved for 30 minutes." },
  { q: "What if I miss my bus?", a: "Contact us via WhatsApp immediately — we can usually rebook you on the next available trip." },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-6">
    <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-1">{title}</h2>
    <div className="card-elevated rounded-3xl overflow-hidden divide-y divide-border">{children}</div>
  </div>
);

const Row = ({ icon, label, sub, to, onClick }: { icon: React.ReactNode; label: string; sub: string; to?: string; onClick?: () => void }) => {
  const inner = (
    <>
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary [&_svg]:w-5 [&_svg]:h-5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{sub}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </>
  );
  const cls = "w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors";
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
};

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="block">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full h-12 rounded-xl bg-input border border-border px-4 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
  </label>
);

const Toggle = ({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between rounded-2xl bg-secondary/40 p-4">
    <div className="min-w-0 mr-3">
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs text-muted-foreground truncate">{sub}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const SavedRoutesEditor = ({ profile, onChange, onClose }: { profile: ProfileT; onChange: (p: ProfileT) => void; onClose: () => void }) => {
  const [from, setFrom] = useState("Windhoek");
  const [to, setTo] = useState("Oshakati");
  const list = profile.savedRoutes || [];

  const add = () => {
    if (from === to) return toast.error("Pick different cities");
    if (list.some((r) => r.from === from && r.to === to)) return toast.error("Already saved");
    onChange({ ...profile, savedRoutes: [...list, { from, to }] });
    toast.success("Route saved");
  };
  const remove = (i: number) => {
    onChange({ ...profile, savedRoutes: list.filter((_, idx) => idx !== i) });
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-3">
      <div className="space-y-2 max-h-60 overflow-auto">
        {list.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No saved routes yet</p>}
        {list.map((r, i) => (
          <div key={i} className="flex items-center gap-2 rounded-2xl bg-secondary/40 p-3">
            <Link onClick={onClose} to={`/results?from=${r.from}&to=${r.to}&date=${today}&passengers=1&tripType=one-way`}
              className="flex-1 flex items-center gap-2 text-sm font-semibold min-w-0">
              <span className="truncate">{r.from}</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{r.to}</span>
            </Link>
            <button onClick={() => remove(i)} className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-secondary/40 p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-11 rounded-xl bg-background border border-border px-3 text-sm font-semibold">
            {ROUTES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="h-11 rounded-xl bg-background border border-border px-3 text-sm font-semibold">
            {ROUTES.filter((r) => r !== from).map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button onClick={add} className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add route
        </button>
      </div>
    </div>
  );
};

const SavedPassengersEditor = ({ profile, onChange }: { profile: ProfileT; onChange: (p: ProfileT) => void }) => {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Family / Friend");
  const [phone, setPhone] = useState("");
  const list = profile.savedPassengers || [];

  const add = () => {
    if (!name || !phone) return toast.error("Enter full name & phone");
    const newPassenger = { id: `sp-${Date.now()}`, name, relation, phone };
    onChange({ ...profile, savedPassengers: [...list, newPassenger] });
    setName("");
    setPhone("");
    toast.success("Passenger saved for 1-click checkout!");
  };

  const remove = (id: string) => {
    onChange({ ...profile, savedPassengers: list.filter((p) => p.id !== id) });
    toast.success("Passenger removed");
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2 max-h-56 overflow-auto">
        {list.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No saved passengers yet</p>}
        {list.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl bg-secondary/40 p-3">
            <div>
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.relation} · {p.phone}</div>
            </div>
            <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-secondary/40 p-3 space-y-2.5">
        <input
          placeholder="Full Name (e.g. Martha Shilongo)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 rounded-xl bg-background border border-border px-3 text-xs font-semibold"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Phone (+264...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-10 rounded-xl bg-background border border-border px-3 text-xs font-semibold"
          />
          <select value={relation} onChange={(e) => setRelation(e.target.value)} className="h-10 rounded-xl bg-background border border-border px-2 text-xs font-semibold">
            <option>Family / Friend</option>
            <option>Colleague</option>
            <option>Child</option>
            <option>Spouse</option>
          </select>
        </div>
        <button onClick={add} className="w-full h-10 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4" /> Save Quick-Fill Passenger
        </button>
      </div>
    </div>
  );
};

export default Profile;
