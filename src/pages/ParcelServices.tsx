import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { ParcelTracker } from "@/components/ParcelTracker";
import { calcParcelPrice, STATUS_STEPS, type ParcelStatus } from "@/lib/parcels";
import { Package, PlusCircle, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";

const OFFICES = [
  "Windhoek Bahnhof Street",
  "Ongwediva",
  "Oshakati Ekuku Mall Unit 10",
  "Otjiwarongo",
  "Swakopmund",
  "Walvis Bay",
  "Rundu",
  "Keetmanshoop",
];

type Tab = "track" | "send" | "mine";

const ParcelServices = () => {
  const [tab, setTab] = useState<Tab>("track");

  return (
    <div className="safe-page bg-background pb-28">
      <TopBar title="Parcel Services" subtitle="Send and track parcels nationwide" back="/parcels" />

      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
          {(
            [
              ["track", "Track"],
              ["send", "Send"],
              ["mine", "My Parcels"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`h-11 rounded-lg text-xs font-extrabold transition-all ${
                tab === key ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {tab === "track" && <ParcelTracker />}
          {tab === "send" && <SendParcelForm onCreated={() => setTab("mine")} />}
          {tab === "mine" && <MyParcels />}
        </div>
      </main>
    </div>
  );
};

const SendParcelForm = ({ onCreated }: { onCreated: () => void }) => {
  const utils = trpc.useUtils();
  const createParcel = trpc.parcels.create.useMutation();
  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    originOffice: OFFICES[0],
    destinationOffice: OFFICES[1],
    size: "small" as "small" | "medium" | "large",
    weightKg: 1,
    description: "",
  });

  const price = calcParcelPrice(form.weightKg || 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.senderName || !form.senderPhone || !form.receiverName || !form.receiverPhone) {
      toast.error("Please complete sender and receiver details.");
      return;
    }
    if (form.originOffice === form.destinationOffice) {
      toast.error("Origin and destination must differ.");
      return;
    }
    try {
      const result = await createParcel.mutateAsync({
        ...form,
        description: form.description || null,
      });
      await utils.parcels.listMine.invalidate();
      toast.success(`Parcel booked! Tracking code: ${result?.parcel.trackingCode}`);
      onCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not book parcel.");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 animate-fade-up">
      <h3 className="text-base font-extrabold text-primary border-b border-border pb-3">Send a Parcel</h3>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Sender name" value={form.senderName} onChange={(v) => setForm({ ...form, senderName: v })} placeholder="Your full name" />
        <Field label="Sender phone" value={form.senderPhone} onChange={(v) => setForm({ ...form, senderPhone: v })} placeholder="081 234 5678" />
        <Field label="Receiver name" value={form.receiverName} onChange={(v) => setForm({ ...form, receiverName: v })} placeholder="Receiver full name" />
        <Field label="Receiver phone" value={form.receiverPhone} onChange={(v) => setForm({ ...form, receiverPhone: v })} placeholder="081 765 4321" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Origin office" value={form.originOffice} onChange={(v) => setForm({ ...form, originOffice: v })} options={OFFICES} />
        <SelectField label="Destination office" value={form.destinationOffice} onChange={(v) => setForm({ ...form, destinationOffice: v })} options={OFFICES} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Parcel size" value={form.size} onChange={(v) => setForm({ ...form, size: v as typeof form.size })} options={["small", "medium", "large"]} />
        <Field label="Weight (kg)" type="number" value={String(form.weightKg)} onChange={(v) => setForm({ ...form, weightKg: Number(v) || 0 })} placeholder="1" />
      </div>

      <Field label="Description (optional)" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Documents, electronics…" />

      <div className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3.5">
        <span className="text-xs font-extrabold text-muted-foreground">Estimated fare</span>
        <span className="text-lg font-extrabold text-primary">N${price}</span>
      </div>

      <button
        type="submit"
        disabled={createParcel.isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-50 transition-transform"
      >
        <PlusCircle className="h-4 w-4" />
        {createParcel.isPending ? "Booking…" : "Book Parcel Drop-off"}
      </button>
    </form>
  );
};

const MyParcels = () => {
  const listQuery = trpc.parcels.listMine.useQuery();
  const items = listQuery.data ?? [];

  if (listQuery.isLoading) {
    return <p className="py-12 text-center text-sm font-semibold text-muted-foreground">Loading your parcels…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <Truck className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm font-semibold text-muted-foreground">No parcels booked yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(({ parcel }) => {
        const stepIndex = STATUS_STEPS.findIndex((s) => s.key === (parcel.status as ParcelStatus));
        return (
          <article key={parcel.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-fade-up">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">{parcel.trackingCode}</p>
                <h4 className="mt-0.5 text-sm font-extrabold text-primary">
                  {parcel.originOffice} → {parcel.destinationOffice}
                </h4>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                  {parcel.size} · {parcel.weightKg}kg · N${parcel.priceNad}
                </p>
              </div>
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-extrabold uppercase text-accent">
                {STATUS_STEPS[stepIndex]?.label ?? parcel.status}
              </span>
            </div>
            {parcel.currentLocation && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" /> {parcel.currentLocation}
              </p>
            )}
            <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.max(8, ((stepIndex + 1) / STATUS_STEPS.length) * 100)}%` }}
              />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/70">
              <Package className="h-3 w-3" /> Track with code {parcel.trackingCode}
            </p>
          </article>
        );
      })}
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) => (
  <label className="block min-w-0">
    <span className="text-[10px] font-extrabold uppercase text-muted-foreground">{label}</span>
    <input type={type} min={type === "number" ? 0 : undefined} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-3.5 text-xs font-bold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
  </label>
);

const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) => (
  <label className="block min-w-0">
    <span className="text-[10px] font-extrabold uppercase text-muted-foreground">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-3.5 text-xs font-bold capitalize outline-none focus:border-accent">
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>
);

export default ParcelServices;
