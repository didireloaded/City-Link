import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  MapPin,
  Package,
  PackageCheck,
  Search,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/data/trips";
import { addParcel, calcParcelPrice, createParcelInSupabaseOrLocal, currentStage, getParcel, loadParcels, STAGE_LABELS, STAGE_ORDER, type Parcel as ParcelT, type ParcelStage } from "@/lib/parcels";
import { ParcelTracker } from "@/components/ParcelTracker";
import { loadProfile } from "@/lib/profile";
import { toast } from "sonner";

type Tab = "send" | "track" | "history";
type Step = 1 | 2 | 3;

const STAGE_ICONS: Record<ParcelStage, LucideIcon> = {
  received: Package,
  loaded: PackageCheck,
  transit: Truck,
  arrived: CheckCircle2,
};

const Parcel = () => {
  const [params, setParams] = useSearchParams();
  const initial = (params.get("tab") as Tab) || "send";
  const [tab, setTab] = useState<Tab>(["send", "track", "history"].includes(initial) ? initial : "send");

  const switchTab = (next: Tab) => {
    setTab(next);
    setParams({ tab: next });
  };

  return (
    <div className="safe-page bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-5">
          <h1 className="text-xl font-extrabold text-primary">Parcels</h1>
          <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pt-4">
        <section className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <p className="text-[11px] font-extrabold uppercase text-white/70">CityLink Parcels</p>
          <h2 className="mt-1 text-2xl font-extrabold">Send and track across Namibia.</h2>
          <p className="mt-2 text-sm font-semibold text-white/75">Use CityLink coach routes for fast city-to-city deliveries.</p>
        </section>

        <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
          {(["send", "track", "history"] as const).map((item) => (
            <button
              key={item}
              onClick={() => switchTab(item)}
              className={`h-10 rounded-lg text-sm font-extrabold capitalize transition-all ${
                tab === item ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "send" && (
          <SendParcel
            onCreated={(id) => {
              setTab("track");
              setParams({ tab: "track", id });
            }}
          />
        )}
        {tab === "track" && <TrackParcel initialId={params.get("id") || "CP-2026-8842"} />}
        {tab === "history" && <ParcelHistory />}
      </main>
    </div>
  );
};

const SendParcel = ({ onCreated }: { onCreated: (id: string) => void }) => {
  const profile = loadProfile();
  const [step, setStep] = useState<Step>(1);
  const [created, setCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    senderName: profile.name !== "Guest user" ? profile.name : "",
    senderPhone: profile.phone !== "+264 81 000 0000" ? profile.phone : "",
    receiverName: "",
    receiverPhone: "",
    from: "Windhoek",
    to: "Oshakati",
    type: "Small Box",
    weight: "5",
    description: "",
    value: "",
  });

  const price = calcParcelPrice(Number(form.weight) || 0);

  const next = () => {
    if (step === 1 && (!form.senderName || !form.senderPhone || !form.receiverName || !form.receiverPhone)) {
      toast.error("Fill in sender and receiver details");
      return;
    }
    if (step === 2 && (form.from === form.to || !form.weight || Number(form.weight) <= 0)) {
      toast.error("Check the route and parcel weight");
      return;
    }
    if (step === 3) {
      submit();
      return;
    }
    setStep((current) => (current + 1) as Step);
  };

  const submit = async () => {
    const newParcel = await createParcelInSupabaseOrLocal({
      sender: { name: form.senderName, phone: form.senderPhone },
      receiver: { name: form.receiverName, phone: form.receiverPhone },
      from: form.from,
      to: form.to,
      type: form.type,
      weight: Number(form.weight),
      description: form.description,
      declaredValue: Number(form.value) || undefined,
      price,
    });
    setCreated(newParcel.trackingCode || newParcel.id);
    toast.success("Parcel waybill created successfully!");
  };

  if (created) {
    return (
      <section className="mt-5 rounded-2xl border border-border bg-card p-5 text-center shadow-sm animate-fade-up">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success glow-ring">
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>
        <h3 className="text-xl font-extrabold text-primary">Waybill Created</h3>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">Your CityLink tracking number is ready.</p>

        <div className="mx-auto mt-4 max-w-xs rounded-xl bg-secondary p-4">
          <p className="text-[11px] font-extrabold uppercase text-muted-foreground">Tracking Number</p>
          <div className="mt-1 font-mono text-xl font-extrabold text-primary">{created}</div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(created);
              setCopied(true);
              toast.success("Tracking number copied to clipboard");
            }}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-xs font-extrabold text-primary shadow-2xs hover:border-accent"
          >
            <Copy className="h-4 w-4 text-accent" /> {copied ? "Copied!" : "Copy Number"}
          </button>
          <button
            onClick={() => onCreated(created)}
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-accent text-xs font-extrabold text-accent-foreground shadow-sm"
          >
            Track Parcel
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm animate-fade-up">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase text-muted-foreground">Step {step} of 3</span>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((item) => (
            <span key={item} className={`h-2 w-7 rounded-full ${item <= step ? "bg-accent" : "bg-secondary"}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-primary">Sender Details</h3>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Full Name</span>
            <input
              value={form.senderName}
              onChange={(event) => setForm({ ...form, senderName: event.target.value })}
              placeholder="John Mwafangeyo"
              className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Phone Number</span>
            <input
              value={form.senderPhone}
              onChange={(event) => setForm({ ...form, senderPhone: event.target.value })}
              placeholder="+264 81 123 4567"
              className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
            />
          </label>

          <h3 className="pt-2 text-base font-extrabold text-primary">Receiver Details</h3>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Receiver Name</span>
            <input
              value={form.receiverName}
              onChange={(event) => setForm({ ...form, receiverName: event.target.value })}
              placeholder="Johannes N."
              className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Receiver Phone</span>
            <input
              value={form.receiverPhone}
              onChange={(event) => setForm({ ...form, receiverPhone: event.target.value })}
              placeholder="+264 81 555 0130"
              className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-primary">Route and Package Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">From Terminal</span>
              <select
                value={form.from}
                onChange={(event) => setForm({ ...form, from: event.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
              >
                {ROUTES.map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">To Terminal</span>
              <select
                value={form.to}
                onChange={(event) => setForm({ ...form, to: event.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
              >
                {ROUTES.map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Parcel Type</span>
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
              >
                <option>Small Box</option>
                <option>Envelope / Documents</option>
                <option>Medium Parcel</option>
                <option>Large Luggage</option>
                <option>Fragile Electronics</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Weight (kg)</span>
              <input
                type="number"
                min="1"
                max="50"
                value={form.weight}
                onChange={(event) => setForm({ ...form, weight: event.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
              >
              </input>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Contents Description</span>
            <input
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="e.g. Clothing, documents, charger"
              className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Declared Value (N$) - optional</span>
            <input
              type="number"
              value={form.value}
              onChange={(event) => setForm({ ...form, value: event.target.value })}
              placeholder="e.g. 1500"
              className="h-11 w-full rounded-xl border border-border bg-input px-3 text-sm font-bold outline-none focus:border-accent"
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-primary">Confirm Waybill</h3>
          <div className="rounded-xl bg-secondary p-4 space-y-2 text-xs font-bold">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route:</span>
              <span className="text-primary">{form.from} to {form.to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sender:</span>
              <span className="text-primary">{form.senderName} ({form.senderPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receiver:</span>
              <span className="text-primary">{form.receiverName} ({form.receiverPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Package:</span>
              <span className="text-primary">{form.type} ({form.weight} kg)</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-sm font-extrabold">
              <span className="text-muted-foreground">Total Fee:</span>
              <span className="text-accent">N${price}</span>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-muted-foreground">
            Bring this waybill number and the parcel to the {form.from} terminal 30 minutes before coach departure.
          </p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((current) => (current - 1) as Step)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-extrabold text-primary shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-extrabold text-accent-foreground shadow-[var(--shadow-glow)]"
        >
          {step === 3 ? "Create Waybill & Pay" : "Continue"} {step < 3 && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </section>
  );
};

const TrackParcel = ({ initialId }: { initialId: string }) => {
  return (
    <section className="mt-5">
      <ParcelTracker initialCode={initialId} />
    </section>
  );
};

const ParcelHistory = () => {
  const parcels = loadParcels();
  return (
    <section className="mt-5 space-y-3">
      {parcels.map((parcel) => (
        <div key={parcel.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase text-muted-foreground">{parcel.id}</p>
              <h3 className="mt-1 flex items-center gap-2 text-base font-extrabold text-primary">
                {parcel.from} <ArrowRight className="h-4 w-4 text-accent" /> {parcel.to}
              </h3>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                {parcel.type} - {parcel.weight} kg - N${parcel.price}
              </p>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-extrabold text-primary">{STAGE_LABELS[currentStage(parcel)].label}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

const Stepper = ({ step }: { step: Step }) => (
  <div className="mb-4 flex items-center justify-between">
    {["People", "Parcel", "Review"].map((label, index) => {
      const value = (index + 1) as Step;
      const done = step > value;
      const active = step === value;
      return (
        <div key={label} className="flex flex-1 items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ${done ? "bg-success text-white" : active ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
            {done ? <Check className="h-4 w-4" /> : value}
          </div>
          <span className={`ml-2 text-xs font-extrabold ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
          {index < 2 && <div className={`mx-2 h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />}
        </div>
      );
    })}
  </div>
);

const ShipmentTypes = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const options = [
    { label: "Document", icon: FileText },
    { label: "Small Box", icon: Package },
    { label: "Large Box", icon: PackageCheck },
    { label: "Fragile", icon: CheckCircle2 },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={`flex h-20 flex-col items-center justify-center rounded-xl border text-sm font-extrabold ${
            value === label ? "border-accent bg-accent/10 text-primary" : "border-border bg-card text-muted-foreground"
          }`}
        >
          <Icon className="mb-2 h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="mb-2 text-[11px] font-extrabold uppercase text-muted-foreground">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) => (
  <label className="block">
    <span className="text-[11px] font-bold text-muted-foreground">{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-4 text-sm font-bold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
    />
  </label>
);

const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) => (
  <label className="block">
    <span className="text-[11px] font-bold text-muted-foreground">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-4 text-sm font-bold outline-none focus:border-accent"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </label>
);

const ReviewRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span className="font-semibold text-muted-foreground">{label}</span>
    <span className="max-w-[62%] truncate text-right font-extrabold text-primary">{children}</span>
  </div>
);

export default Parcel;
