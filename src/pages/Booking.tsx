import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AmenityIcon } from "@/components/Brand";
import { TopBar } from "@/components/TopBar";
import { PaymentGatewayModal } from "@/components/PaymentGatewayModal";
import { loadProfile } from "@/lib/profile";
import { createTransferOptions, LUGGAGE } from "@/data/trips";
import { Baby, Check, Luggage, MapPin, MessageSquare, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3;
type Payment = "card" | "eft" | "cash";

export const Booking = () => {
  const { tripId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get("from") || "Hosea Kutako International Airport";
  const to = params.get("to") || "Windhoek";
  const pickup = params.get("pickup") || "Arrivals Hall Meet & Greet";
  const dropoff = params.get("dropoff") || "Hotel pickup";
  const pickupTime = params.get("pickupTime") || "14:30";
  const passengerCount = Number(params.get("passengers")) || 1;
  const travelDate = params.get("date") || new Date().toISOString().slice(0, 10);
  const options = createTransferOptions(from, to, pickupTime);
  const trip = options.find((item) => item.id === tripId) || options[0];
  const isAirport = from === "Hosea Kutako International Airport" || to === "Hosea Kutako International Airport";
  const formattedDate = new Date(travelDate + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const [step, setStep] = useState<Step>(1);
  const [profile] = useState(() => loadProfile());
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);
  const [payment] = useState<Payment>("card");
  const [childSeat, setChildSeat] = useState(false);
  const [form, setForm] = useState(() => {
    const [firstName = "", surname = ""] = String(profile.name || "").split(" ");
    return {
      name: firstName,
      surname,
      phone: profile.phone || "",
      email: profile.email || "",
      luggage: params.get("luggage") || "2",
      flightNumber: params.get("flightNumber") || "",
      movement: "Arrival",
      nameBoard: "",
      notes: "",
    };
  });

  const luggage = LUGGAGE.find((item) => item.id === "checked") || LUGGAGE[0];
  const serviceFee = trip.quoteOnly ? 0 : 25;
  const subtotal = trip.quoteOnly ? 0 : trip.price;
  const total = subtotal + serviceFee + luggage.price;

  const next = () => {
    if (step === 2) {
      if (!form.name || !form.surname || !form.phone) {
        toast.error("Please add passenger contact details.");
        return;
      }
      localStorage.setItem(
        "citycab_profile",
        JSON.stringify({ name: `${form.name} ${form.surname}`, phone: form.phone, email: form.email })
      );
    }
    setStep((current) => (current + 1) as Step);
  };

  const confirm = () => {
    if (trip.quoteOnly) {
      toast.success("Quote request prepared. City Cab can confirm this route by WhatsApp.");
      return;
    }
    setIsGatewayOpen(true);
  };

  return (
    <div className="safe-page bg-background">
      <TopBar title={`${shortPlace(trip.from)} to ${shortPlace(trip.to)}`} subtitle={`${formattedDate} · ${pickupTime} · ${trip.bus.name}`} />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-5">
        <Stepper step={step} />

        <section className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-elegant)] border border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-extrabold text-accent uppercase mb-1">
                <Sparkles className="h-3 w-3" /> {trip.badge}
              </span>
              <h2 className="text-lg font-extrabold">{trip.bus.name}</h2>
              <p className="mt-1 text-xs font-semibold text-white/75">
                {pickup} &gt; {dropoff}
              </p>
              <p className="mt-1 text-[11px] font-extrabold text-accent">
                {formattedDate} at {pickupTime}
              </p>
            </div>
            <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold">
              {trip.quoteOnly ? "Quote" : `N$${trip.price}`}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] font-bold text-white/80 border-t border-white/10 pt-3">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {trip.bus.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-accent" /> {trip.bus.capacity} pax
            </span>
            <span className="flex items-center gap-1">
              <Luggage className="h-3.5 w-3.5 text-accent" /> {trip.bus.luggageCapacity} bags
            </span>
          </div>
        </section>

        {step === 1 && (
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 animate-fade-up">
            <div className="relative h-44 overflow-hidden rounded-3xl bg-gradient-to-b from-[#f7f6f0] via-[#e9edf2] to-[#d9dee7]">
              <div className="absolute inset-x-8 bottom-10 h-10 rounded-full bg-black/15 blur-xl" />
              <img src={trip.bus.imageUrl} alt={`${trip.bus.name} vehicle`} className="absolute left-1/2 top-7 h-28 w-[118%] -translate-x-1/2 scale-[1.55] object-contain drop-shadow-2xl" />
              <span className="absolute right-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-extrabold text-primary shadow-sm">
                {trip.quoteOnly ? "Request Quote" : `N$${trip.price}`}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-primary">Transfer & Vehicle</h3>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{trip.bus.model}</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-primary">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> Private
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Info label="Pickup">{shortPlace(from)}</Info>
              <Info label="Destination">{shortPlace(to)}</Info>
              <Info label="Passengers">{passengerCount}</Info>
              <Info label="Pricing">{trip.quoteOnly ? "Request Quote" : `N$${trip.price}`}</Info>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {trip.bus.amenities.map((amenity) => (
                <AmenityIcon key={amenity} a={amenity} />
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-5 animate-fade-up">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-primary">Passenger Details</h3>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-extrabold text-accent">{trip.serviceType}</span>
            </div>

            {profile.savedPassengers && profile.savedPassengers.length > 0 && (
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-3.5 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> Saved Passenger Autofill
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.savedPassengers.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => {
                        const parts = sp.name.split(" ");
                        setForm({ ...form, name: parts[0], surname: parts.slice(1).join(" ") || "", phone: sp.phone });
                        toast.success(`Autofilled details for ${sp.name}`);
                      }}
                      className="rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-extrabold text-primary hover:border-accent shadow-2xs active:scale-95 transition-all"
                    >
                      {sp.name} ({sp.relation})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="John" />
                <Input label="Surname" value={form.surname} onChange={(value) => setForm({ ...form, surname: value })} placeholder="Mwafangeyo" />
              </div>
              <Input label="Phone" type="tel" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} placeholder="+264 81 123 4567" />
              <Input label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="john@example.com" />

              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Luggage" value={form.luggage} onChange={(value) => setForm({ ...form, luggage: value })} placeholder="2" type="number" />
                <button
                  type="button"
                  onClick={() => setChildSeat(!childSeat)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    childSeat ? "border-accent bg-accent/15 shadow-xs" : "border-border bg-secondary/40"
                  }`}
                >
                  <span className="text-xs font-extrabold text-primary flex justify-between">
                    <span>Child Seat</span>
                    <Baby className="h-4 w-4 text-accent" />
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground block">Request if required</span>
                </button>
              </div>

              {isAirport && (
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-3.5 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-accent">Airport details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Flight number" value={form.flightNumber} onChange={(value) => setForm({ ...form, flightNumber: value.toUpperCase() })} placeholder="4Z 124" />
                    <label className="block min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Arrival / Departure</span>
                      <select value={form.movement} onChange={(e) => setForm({ ...form, movement: e.target.value })} className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-3.5 text-xs font-bold outline-none focus:border-accent">
                        <option>Arrival</option>
                        <option>Departure</option>
                      </select>
                    </label>
                  </div>
                  <Input label="Name-board text" value={form.nameBoard} onChange={(value) => setForm({ ...form, nameBoard: value })} placeholder="Passenger or company name" />
                </div>
              )}

              <label className="block min-w-0">
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Special instructions</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Gate access, hotel lobby, extra luggage, bottled water request..."
                  className="mt-1 min-h-24 w-full rounded-xl border border-border bg-input px-3.5 py-3 text-xs font-bold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 animate-fade-up">
            <h3 className="text-base font-extrabold text-primary border-b border-border pb-3">Summary & Payment</h3>
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary font-extrabold text-xs">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <span>{trip.quoteOnly ? "Quote request ready" : "Ready for secure authorization"}</span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                {trip.quoteOnly
                  ? "City Cab will confirm pricing for this private route before payment."
                  : "Confirm the transfer and complete payment using the existing secure checkout modal."}
              </p>
            </div>
            <a href="https://wa.me/264812572188" target="_blank" rel="noreferrer" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-success/15 text-sm font-extrabold text-success">
              <MessageSquare className="h-4 w-4" /> WhatsApp City Cab
            </a>
          </div>
        )}

        <FareSummary vehicle={trip.bus.name} subtotal={subtotal} serviceFee={serviceFee} total={total} quoteOnly={!!trip.quoteOnly} />
      </main>

      <div className="fixed bottom-20 inset-x-0 z-40 px-4 pb-2 bg-gradient-to-t from-background via-background/90 to-transparent pt-3">
        <div className="mx-auto max-w-md">
          {step < 3 ? (
            <button type="button" onClick={next} className="h-14 w-full rounded-2xl bg-accent text-base font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98]">
              Continue to {step === 1 ? "Passenger Details" : "Summary"} &gt;
            </button>
          ) : (
            <button type="button" onClick={confirm} className="h-14 w-full rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span>{trip.quoteOnly ? "Request Quote" : `Confirm & Pay N$${total}`}</span>
            </button>
          )}
        </div>
      </div>

      <PaymentGatewayModal
        open={isGatewayOpen}
        onOpenChange={setIsGatewayOpen}
        amountNAD={total}
        description={`${trip.bus.name} · ${shortPlace(trip.from)} to ${shortPlace(trip.to)}`}
        onSuccess={(method, ref) => {
          setIsGatewayOpen(false);
          const name = encodeURIComponent(`${form.name} ${form.surname}`.trim());
          navigate(
            `/confirmation?ref=${ref}&trip=${trip.id}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&vehicle=${encodeURIComponent(trip.bus.name)}&total=${total}&name=${name}&payment=${encodeURIComponent(method || payment)}&date=${travelDate}&pickup=${encodeURIComponent(pickup)}&pickupTime=${pickupTime}`
          );
        }}
      />
    </div>
  );
};

const Stepper = ({ step }: { step: Step }) => {
  const labels = ["Vehicle", "Passenger", "Checkout"];
  return (
    <div className="mb-4 flex items-center justify-between px-1">
      {labels.map((label, index) => {
        const value = (index + 1) as Step;
        const done = step > value;
        const active = step === value;
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold ${done ? "bg-success text-white" : active ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)]" : "bg-secondary text-muted-foreground"}`}>
              {done ? <Check className="h-4 w-4" /> : value}
            </div>
            <span className={`ml-2 text-xs font-extrabold ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            {index < labels.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${done ? "bg-success" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) => (
  <label className="block min-w-0">
    <span className="text-[10px] font-extrabold uppercase text-muted-foreground">{label}</span>
    <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-3.5 text-xs font-bold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
  </label>
);

const Info = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-2xl bg-secondary/60 p-3">
    <p className="text-[10px] font-extrabold uppercase text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-extrabold text-primary">{children}</p>
  </div>
);

const FareSummary = ({ vehicle, subtotal, serviceFee, total, quoteOnly }: { vehicle: string; subtotal: number; serviceFee: number; total: number; quoteOnly: boolean }) => (
  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm mb-16 space-y-3">
    <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
      Transfer Summary
    </h3>
    <div className="space-y-2 text-xs font-bold">
      <Row label="Selected Vehicle">{vehicle}</Row>
      <Row label="Transfer Fare">{quoteOnly ? "Request Quote" : `N$${subtotal}`}</Row>
      {!quoteOnly && <Row label="Booking & Service Fee">N${serviceFee}</Row>}
    </div>
    <div className="border-t border-border pt-3 flex items-center justify-between">
      <span className="text-sm font-extrabold text-muted-foreground">{quoteOnly ? "Payment" : "Total Due"}</span>
      <span className="text-2xl font-extrabold text-primary">{quoteOnly ? "After quote" : `N$${total}`}</span>
    </div>
  </section>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-extrabold text-primary">{children}</span>
  </div>
);

const shortPlace = (value: string) => value.replace("Hosea Kutako International Airport", "HKIA");

export default Booking;
