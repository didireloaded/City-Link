import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone, Ticket, HelpCircle, MessageCircle, LogOut, ChevronRight,
  Heart, Settings, Shield, Star, Trash2, Plus, Check,
} from "lucide-react";
import { Profile as ProfileT } from "@/lib/profile";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

type Pane = null | "edit" | "topup" | "passengers" | "settings" | "privacy" | "ratings" | "faq" | "support";

const Profile = () => {
  const { profile, save, isSaving, refresh } = useProfile();
  const { logout } = useAuth();
  const [pane, setPane] = useState<Pane>(null);
  const [topupAmount, setTopupAmount] = useState("250");

  const utils = trpc.useUtils();
  const topUp = trpc.profile.topUp.useMutation({
    onSuccess: async () => {
      await refresh();
      await utils.notifications.listMine.invalidate();
    },
  });
  const bookingsQuery = trpc.bookings.listMine.useQuery();

  const ratings = (bookingsQuery.data ?? []).filter((b) => b.rating !== null);

  const update = (p: ProfileT) => {
    void save({
      phone: p.phone,
      savedPassengers: p.savedPassengers ?? [],
      savedRoutes: p.savedRoutes ?? [],
      preferences: p.preferences,
    });
  };

  const handleTopup = async () => {
    const amt = parseFloat(topupAmount) || 0;
    if (amt <= 0) {
      toast.error("Select a valid top-up amount");
      return;
    }
    try {
      await topUp.mutateAsync({ amountNad: Math.round(amt) });
      toast.success(`N$${amt} credited to your City Link Wallet via PayToday!`);
      setPane(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Top-up failed.");
    }
  };

  return (
    <div className="safe-page min-h-screen bg-background pb-36">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="mx-auto max-w-md px-5 h-16 flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight text-primary">City Link Profile</h1>
          <span className="rounded-full bg-accent/20 border border-accent/40 px-3.5 py-1 text-xs font-extrabold text-primary">
            Account
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-5 space-y-6">
        {/* Profile Header Card */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0 border border-white/10">
              {(profile.name || "T").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-lg text-primary truncate">{profile.name}</div>
              <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 truncate mt-0.5">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />{profile.phone || "Add your phone number"}
              </div>
              {profile.referralCode && (
                <div className="text-[10px] font-bold text-muted-foreground mt-0.5">Referral: {profile.referralCode}</div>
              )}
            </div>
          </div>
          <button
            onClick={() => setPane("edit")}
            className="h-10 px-4 rounded-xl bg-secondary font-extrabold text-xs text-primary hover:bg-secondary/80 active:scale-95 transition-all shrink-0"
          >
            Edit
          </button>
        </div>

        {/* Store Credit Wallet */}
        <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-[#0a192f] via-[#0f2744] to-primary p-6 text-white shadow-xl space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/10 blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent block">
                City Link Wallet
              </span>
              <div className="text-3xl font-extrabold mt-1 tracking-tight">
                N${(profile.walletBalanceNAD || 0).toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] font-semibold text-white/70">
                Use wallet funds for confirmed transfers. {profile.loyaltyPoints ?? 0} loyalty points.
              </p>
            </div>
            <button
              onClick={() => setPane("topup")}
              className="h-11 px-4 rounded-xl bg-accent text-accent-foreground font-extrabold text-xs shadow-[0_4px_15px_rgba(94, 197, 239,0.5)] active:scale-95 transition-transform shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Top Up Wallet
            </button>
          </div>
        </div>

        {/* Travel & Passengers */}
        <Section title="My Transfers & Passengers">
          <Row to="/trips" icon={<Ticket />} label="Transfer History" sub="View upcoming, active and completed transfers" />
          <Row onClick={() => setPane("passengers")} icon={<Star />} label="Saved Passengers" sub={`${profile.savedPassengers?.length || 0} saved passenger profiles for 1-click booking`} />
          <Row onClick={() => setPane("ratings")} icon={<Heart />} label="My Journey Reviews" sub={`${ratings.length} completed feedback reviews`} />
        </Section>

        {/* Preferences & Settings */}
        <Section title="App Settings & Language">
          <Row onClick={() => setPane("settings")} icon={<Settings />} label="Notifications & Language" sub="Transfer pickup alerts, English / Afrikaans" />
          <Row onClick={() => setPane("privacy")} icon={<Shield />} label="Data & Storage" sub="How City Link stores your account data" />
        </Section>

        {/* Help & 24/7 Care */}
        <Section title="Client Care">
          <Row onClick={() => setPane("faq")} icon={<HelpCircle />} label="Frequently Asked Questions" sub="Baggage allowances, flexible reschedules & refunds" />
          <Row onClick={() => setPane("support")} icon={<MessageCircle />} label="24/7 City Link Support" sub="Instant WhatsApp chat & direct hotline" />
          <Row to="/support" icon={<ChevronRight />} label="Support Center" sub="Guides, contact channels and service status" />
        </Section>

        <button
          onClick={logout}
          className="mt-4 w-full h-14 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive font-extrabold text-sm flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>

        <p className="text-center text-xs font-semibold text-muted-foreground pt-2">
          City Link · Private transfers across Namibia
        </p>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Dialog open={pane === "edit"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">Edit Profile</DialogTitle></DialogHeader>
          <EditProfileForm
            profile={profile}
            isSaving={isSaving}
            onSave={async (phone) => {
              await save({ phone });
              toast.success("Profile updated successfully");
              setPane(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* TOP UP WALLET MODAL */}
      <Dialog open={pane === "topup"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">Top Up Store Credit Wallet</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Instant credit for transfer checkouts. Backed by MTC Mobile Money & PayToday.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["150", "350", "500", "750", "1000", "1500"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopupAmount(amt)}
                  className={`h-12 rounded-xl border text-sm font-extrabold transition-all ${
                    topupAmount === amt
                      ? "border-accent bg-accent text-accent-foreground shadow-sm"
                      : "border-border bg-card text-primary hover:border-accent/40"
                  }`}
                >
                  N${amt}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Custom Amount (N$)</span>
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="mt-1.5 w-full h-12 rounded-xl bg-input border border-border px-4 text-sm font-extrabold outline-none focus:border-accent"
              />
            </label>
          </div>
          <DialogFooter className="pt-4">
            <button
              onClick={handleTopup}
              disabled={topUp.isPending}
              className="w-full h-12 rounded-2xl bg-accent text-accent-foreground font-extrabold text-sm shadow-[0_4px_15px_rgba(94, 197, 239,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-5 h-5" /> {topUp.isPending ? "Processing…" : `Confirm & Credit N$${topupAmount || 0}`}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SAVED PASSENGERS MODAL */}
      <Dialog open={pane === "passengers"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">Saved Passengers</DialogTitle></DialogHeader>
          <SavedPassengersEditor profile={profile} onChange={update} />
        </DialogContent>
      </Dialog>

      {/* SETTINGS MODAL */}
      <Dialog open={pane === "settings"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">App Settings</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Toggle label="Push Notifications" sub="Driver assignment, pickup and ETA updates"
              checked={!!profile.preferences?.notifications}
              onChange={(v) => update({ ...profile, preferences: { ...profile.preferences!, notifications: v } })} />
            <Toggle label="Special Offers & Deals" sub="City Link transfer updates and offers"
              checked={!!profile.preferences?.promoEmails}
              onChange={(v) => update({ ...profile, preferences: { ...profile.preferences!, promoEmails: v } })} />
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2.5">
              <div className="text-xs font-extrabold text-primary">Preferred App Language</div>
              <div className="grid grid-cols-2 gap-2">
                {(["en", "af"] as const).map((l) => (
                  <button key={l}
                    onClick={() => update({ ...profile, preferences: { ...profile.preferences!, language: l } })}
                    className={`h-11 rounded-xl text-xs font-extrabold transition-all ${profile.preferences?.language === l ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-primary"}`}>
                    {l === "en" ? "English" : "Afrikaans"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PRIVACY MODAL */}
      <Dialog open={pane === "privacy"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">Data & Storage</DialogTitle></DialogHeader>
          <div className="space-y-3 text-xs font-semibold text-muted-foreground pt-2 leading-relaxed">
            <p>Your bookings, parcels, wallet and preferences are stored securely in your City Link account and sync across devices.</p>
            <p>Only your onboarding preference is kept on this device. Clearing browser data does not delete your account data.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* RATINGS MODAL */}
      <Dialog open={pane === "ratings"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">My Journey Reviews</DialogTitle></DialogHeader>
          {ratings.length === 0 ? (
            <p className="text-xs font-semibold text-muted-foreground text-center py-8">No feedback reviews yet. Complete a transfer to rate your driver.</p>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-auto pt-2">
              {ratings.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-xs text-primary">{r.fromLocation} → {r.toLocation}</div>
                    <div className="flex items-center gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < (r.rating ?? 0) ? "fill-accent" : "opacity-30"}`} />
                      ))}
                    </div>
                  </div>
                  {r.ratingComment && <p className="text-xs font-semibold text-muted-foreground">{r.ratingComment}</p>}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ MODAL */}
      <Dialog open={pane === "faq"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">Frequently Asked Questions</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-96 overflow-auto pt-2">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-2xl border border-border bg-card p-3.5 group">
                <summary className="font-extrabold text-xs text-primary cursor-pointer list-none flex items-center justify-between">
                  <span>{f.q}</span>
                  <ChevronRight className="w-4 h-4 text-accent transition-transform group-open:rotate-90 shrink-0" />
                </summary>
                <p className="text-xs font-semibold text-muted-foreground mt-2.5 leading-relaxed pt-2 border-t border-border">{f.a}</p>
              </details>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* SUPPORT MODAL */}
      <Dialog open={pane === "support"} onOpenChange={(o) => !o && setPane(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-extrabold">24/7 City Link Support</DialogTitle></DialogHeader>
          <div className="space-y-2.5 pt-2">
            <a href="https://wa.me/264818767676" target="_blank" rel="noreferrer" className="flex items-center gap-3.5 p-4 rounded-2xl border border-success/40 bg-success/15 text-foreground active:scale-98 transition-transform">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success text-white shrink-0 shadow-sm"><MessageCircle className="w-5 h-5" /></div>
              <div><div className="font-extrabold text-sm text-primary">WhatsApp City Link</div><div className="text-xs font-semibold text-success">Typical reply: under 2 minutes</div></div>
            </a>
            <a href="tel:+264812572188" className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-card active:scale-98 transition-transform">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0"><Phone className="w-5 h-5 text-accent" /></div>
              <div><div className="font-extrabold text-sm text-primary">City Link Hotline</div><div className="text-xs font-semibold text-muted-foreground">+264 81 257 2188</div></div>
            </a>
            <a href="mailto:info@citylink.na" className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-card active:scale-98 transition-transform">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0"><HelpCircle className="w-5 h-5 text-accent" /></div>
              <div><div className="font-extrabold text-sm text-primary">City Link Email</div><div className="text-xs font-semibold text-muted-foreground">info@citylink.na</div></div>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FAQ = [
  { q: "Can I change my pickup time?", a: "Use WhatsApp or call City Link as early as possible so dispatch can confirm driver availability." },
  { q: "How do I top up my City Link Wallet?", a: "You can credit funds instantly using PayToday, MTC Mobile Money, or EFT directly from your profile." },
  { q: "Can I request extra luggage or child seats?", a: "Yes. Add luggage and child-seat requests during booking or confirm details by WhatsApp." },
  { q: "Where is my data stored?", a: "Your account, bookings and parcels are stored securely in your City Link account and sync across your devices." },
];

const EditProfileForm = ({ profile, isSaving, onSave }: { profile: ProfileT; isSaving: boolean; onSave: (phone: string) => Promise<void> | void }) => {
  const [phone, setPhone] = useState(profile.phone);
  useEffect(() => setPhone(profile.phone), [profile.phone]);
  return (
    <div className="space-y-4 pt-2">
      <div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Full Name</span>
        <p className="mt-1.5 w-full h-12 rounded-xl bg-secondary/60 border border-border px-4 text-sm font-extrabold flex items-center text-muted-foreground">
          {profile.name} (managed by your sign-in account)
        </p>
      </div>
      <div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Email Address</span>
        <p className="mt-1.5 w-full h-12 rounded-xl bg-secondary/60 border border-border px-4 text-sm font-extrabold flex items-center text-muted-foreground">
          {profile.email || "Not provided"}
        </p>
      </div>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Mobile Phone</span>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+264 81 234 5678"
          className="mt-1.5 w-full h-12 rounded-xl bg-input border border-border px-4 text-sm font-extrabold outline-none focus:border-accent transition-colors" />
      </label>
      <button
        onClick={() => onSave(phone)}
        disabled={isSaving}
        className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm shadow-md active:scale-95 transition-transform disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-6 space-y-2">
    <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">{title}</h2>
    <div className="rounded-3xl border border-border bg-card overflow-hidden divide-y divide-border shadow-sm">{children}</div>
  </div>
);

const Row = ({ icon, label, sub, to, onClick }: { icon: React.ReactNode; label: string; sub: string; to?: string; onClick?: () => void }) => {
  const inner = (
    <>
      <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-accent [&_svg]:w-5 [&_svg]:h-5 shrink-0 shadow-xs">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-sm text-primary">{label}</div>
        <div className="text-xs font-semibold text-muted-foreground truncate mt-0.5">{sub}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </>
  );
  const cls = "w-full min-h-[64px] flex items-center gap-3.5 p-4 text-left hover:bg-secondary/40 active:scale-[0.99] transition-all";
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
};

const Toggle = ({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
    <div className="min-w-0 mr-3">
      <div className="font-extrabold text-sm text-primary">{label}</div>
      <div className="text-xs font-semibold text-muted-foreground truncate mt-0.5">{sub}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const SavedPassengersEditor = ({ profile, onChange }: { profile: ProfileT; onChange: (p: ProfileT) => void }) => {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Family / Companion");
  const [phone, setPhone] = useState("");
  const list = profile.savedPassengers || [];

  const add = () => {
    if (!name || !phone) {
      toast.error("Enter full name and phone number");
      return;
    }
    const newPassenger = { id: `sp-${Date.now()}`, name, relation, phone };
    onChange({ ...profile, savedPassengers: [...list, newPassenger] });
    setName("");
    setPhone("");
    toast.success("Quick-Fill Passenger profile saved!");
  };

  const remove = (id: string) => {
    onChange({ ...profile, savedPassengers: list.filter((p) => p.id !== id) });
    toast.success("Passenger removed");
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2 max-h-56 overflow-auto">
        {list.length === 0 && <p className="text-xs font-semibold text-muted-foreground text-center py-6">No saved passengers yet. Add frequent companions below for 1-click booking.</p>}
        {list.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5">
            <div>
              <div className="font-extrabold text-xs text-primary">{p.name}</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">{p.relation} · {p.phone}</div>
            </div>
            <button onClick={() => remove(p.id)} className="w-9 h-9 rounded-xl border border-destructive/30 bg-destructive/10 flex items-center justify-center text-destructive active:scale-90 transition-transform">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-border bg-secondary/40 p-4 space-y-3">
        <input
          placeholder="Full Name (e.g. Martha Shilongo)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-11 rounded-xl bg-background border border-border px-3.5 text-xs font-extrabold outline-none focus:border-accent"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Phone (+264...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 rounded-xl bg-background border border-border px-3.5 text-xs font-extrabold outline-none focus:border-accent"
          />
          <select value={relation} onChange={(e) => setRelation(e.target.value)} className="h-11 rounded-xl bg-background border border-border px-2 text-xs font-extrabold outline-none focus:border-accent">
            <option>Family / Companion</option>
            <option>Business Colleague</option>
            <option>Child</option>
            <option>Spouse</option>
          </select>
        </div>
        <button onClick={add} className="w-full h-11 rounded-xl bg-accent text-accent-foreground font-extrabold text-xs shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4" /> Save Quick-Fill Passenger
        </button>
      </div>
    </div>
  );
};

export default Profile;
