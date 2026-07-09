import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AmenityIcon } from "@/components/Brand";
import { SupabaseSeatBooking, type SeatItem } from "@/components/SupabaseSeatBooking";
import { TopBar } from "@/components/TopBar";
import { PaymentGatewayModal } from "@/components/PaymentGatewayModal";
import { loadProfile } from "@/lib/profile";
import { LUGGAGE, TRIPS, CITY_LINK_INFO } from "@/data/trips";
import {
  Banknote,
  Building2,
  Check,
  CreditCard,
  ShieldCheck,
  Star,
  Wifi,
  Zap,
  Clock,
  Sparkles,
  MapPin,
  Tag,
  Users,
  Smartphone,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3;
type Payment = "card" | "eft" | "cash";

export const Booking = () => {
  const { tripId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const trip = TRIPS.find((item) => item.id === tripId) || TRIPS[0];

  const passengerCount = Number(params.get("passengers")) || 1;
  const travelDate = params.get("date") || new Date().toISOString().slice(0, 10);
  const formattedDate = new Date(travelDate + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const [step, setStep] = useState<Step>(1);
  const [selectedSeatNum, setSelectedSeatNum] = useState<string>("");
  const [lockedSeatPrice, setLockedSeatPrice] = useState<number>(trip.price);
  const [heldUntilISO, setHeldUntilISO] = useState<string>("");

  const [profile] = useState(() => loadProfile());
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);
  const [pickupPoint, setPickupPoint] = useState<string>(`${trip.from} Main Terminal / Depot`);
  const [addOnPriority, setAddOnPriority] = useState<boolean>(false);
  const [addOnInsurance, setAddOnInsurance] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  const [form, setForm] = useState(() => {
    const saved = profile;
    const [firstName = "", surname = ""] = String(saved.name || "").split(" ");
    return {
      name: firstName,
      surname,
      phone: saved.phone || "",
      email: saved.email || "",
      emergencyName: "Johanna Shilongo",
      emergencyPhone: "+264 81 333 1188",
      luggage: "small",
    };
  });
  const [payment, setPayment] = useState<Payment>("card");

  const luggage = LUGGAGE.find((item) => item.id === form.luggage) || LUGGAGE[0];
  const subtotal = selectedSeatNum ? lockedSeatPrice : trip.price * passengerCount;
  const serviceFee = 25;
  const addOnsTotal = (addOnPriority ? 30 : 0) + (addOnInsurance ? 25 : 0);
  const total = Math.max(0, subtotal + luggage.price + serviceFee + addOnsTotal - promoDiscount);

  const next = () => {
    if (step === 1) {
      if (!selectedSeatNum) {
        toast.error("Please select and hold a seat on the coach diagram below first.");
        return;
      }
    }
    if (step === 2) {
      if (!form.name || !form.surname || !form.phone || !form.emergencyName || !form.emergencyPhone) {
        toast.error("Please add passenger and emergency contact details.");
        return;
      }
      localStorage.setItem(
        "citylink_profile",
        JSON.stringify({ name: `${form.name} ${form.surname}`, phone: form.phone, email: form.email })
      );
    }
    setStep((current) => (current + 1) as Step);
  };

  const confirm = () => {
    setIsGatewayOpen(true);
  };

  return (
    <div className="safe-page bg-background">
      <TopBar title={`${trip.from} to ${trip.to}`} subtitle={`${formattedDate} · ${trip.departure} - ${trip.bus.name}`} />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-5">
        <Stepper step={step} />

        <section className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-elegant)] border border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-extrabold text-accent uppercase mb-1">
                <Sparkles className="h-3 w-3" /> {trip.badge || "Luxury Sleeper"}
              </span>
              <h2 className="text-lg font-extrabold">{trip.bus.name}</h2>
              <p className="mt-1 text-xs font-semibold text-white/75">
                {trip.from} to {trip.to} · {trip.duration}
              </p>
              <p className="mt-1 text-[11px] font-extrabold text-accent">
                📅 Travel Date: {formattedDate}
              </p>
            </div>
            <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold">
              N${trip.price} Base
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] font-bold text-white/80 border-t border-white/10 pt-3">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {trip.bus.rating} Rating
            </span>
            <span className="flex items-center gap-1">
              <Wifi className="h-3.5 w-3.5 text-accent" /> Free Wi-Fi
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-accent" /> USB Ports
            </span>
          </div>
        </section>

        {step === 1 && (
          <div className="space-y-4 animate-fade-up">
            <SupabaseSeatBooking
              tripId={trip.id}
              routePrice={trip.price}
              onSeatSelected={(seatNum, price, heldUntil) => {
                setSelectedSeatNum(seatNum);
                setLockedSeatPrice(price);
                if (heldUntil) setHeldUntilISO(heldUntil);
              }}
            />
            <CoachDetails trip={trip} />
          </div>
        )}

        {step === 2 && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-5 animate-fade-up">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-primary">Passenger & Boarding Details</h3>
              {selectedSeatNum && (
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-extrabold text-accent">
                  Seat {selectedSeatNum} Locked
                </span>
              )}
            </div>

            {/* Saved Passengers Quick-Fill */}
            {profile.savedPassengers && profile.savedPassengers.length > 0 && (
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-3.5 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> 1-Click Saved Passenger Autofill
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.savedPassengers.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => {
                        const parts = sp.name.split(" ");
                        const firstName = parts[0];
                        const surname = parts.slice(1).join(" ") || "";
                        setForm({ ...form, name: firstName, surname, phone: sp.phone });
                        toast.success(`Autofilled details for ${sp.name}!`);
                      }}
                      className="rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-extrabold text-primary hover:border-accent shadow-2xs active:scale-95 transition-all"
                    >
                      {sp.name} ({sp.relation})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pickup Point Selection within City */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 text-accent" /> Select Boarding Depot / Stop in {trip.from}
              </label>
              <select
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-xs font-bold text-primary focus:border-accent focus:outline-none"
              >
                <option value={`${trip.from} Main Terminal / Depot`}>📍 {trip.from} Main Terminal / Depot</option>
                <option value={`${trip.from} Bahnhof Street Central Hub`}>🏢 {trip.from} Bahnhof Street Central Hub</option>
                <option value={`${trip.from} Shoprite Express Junction`}>🛒 {trip.from} Shoprite Express Junction</option>
                <option value={`${trip.from} Airport / Highway Access Stop`}>✈️ {trip.from} Airport / Highway Access Stop</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="John" />
                <Input label="Surname" value={form.surname} onChange={(value) => setForm({ ...form, surname: value })} placeholder="Mwafangeyo" />
              </div>
              <Input label="Phone" type="tel" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} placeholder="+264 81 123 4567" />
              <Input label="Email Address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="john@example.com" />

              <div className="pt-2 border-t border-border">
                <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Emergency Contact (Required for Highway Insurance)</h4>
                <div className="space-y-3">
                  <Input
                    label="Contact full name"
                    value={form.emergencyName}
                    onChange={(value) => setForm({ ...form, emergencyName: value })}
                    placeholder="E.g. Maria Mwafangeyo"
                  />
                  <Input
                    label="Contact phone number"
                    type="tel"
                    value={form.emergencyPhone}
                    onChange={(value) => setForm({ ...form, emergencyPhone: value })}
                    placeholder="+264 81 555 0130"
                  />
                </div>
              </div>

              {/* Add-ons & Promo Code */}
              <div className="pt-2 border-t border-border space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Optional Travel Add-ons</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAddOnPriority(!addOnPriority)}
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      addOnPriority ? "border-accent bg-accent/15 shadow-xs" : "border-border bg-secondary/40"
                    }`}
                  >
                    <span className="text-xs font-extrabold text-primary flex justify-between">
                      <span>Priority Boarding</span>
                      <span className="text-accent">+N$30</span>
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground block">First to board & store luggage</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddOnInsurance(!addOnInsurance)}
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      addOnInsurance ? "border-success bg-success/15 shadow-xs" : "border-border bg-secondary/40"
                    }`}
                  >
                    <span className="text-xs font-extrabold text-primary flex justify-between">
                      <span>Highway Shield</span>
                      <span className="text-success">+N$25</span>
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground block">Trip protection & luggage cover</span>
                  </button>
                </div>

                <div className="pt-1">
                  <label className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">Promo / Discount Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. CITYLINK20"
                      className="flex-1 rounded-xl border border-border bg-input px-3 py-2 text-xs font-bold text-primary focus:border-accent focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (promoCode === "CITYLINK20" || promoCode.startsWith("VIP")) {
                          setPromoDiscount(40);
                          toast.success("Promo code applied! N$40 off your booking.");
                        } else {
                          toast.error("Invalid or expired promo code.");
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-secondary text-primary text-xs font-extrabold hover:bg-secondary/80"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Checked Luggage Allowance</p>
                <div className="grid grid-cols-2 gap-2">
                  {LUGGAGE.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setForm({ ...form, luggage: item.id })}
                      className={`rounded-2xl border p-3.5 text-left transition-all ${
                        form.luggage === item.id ? "border-accent bg-accent/15 shadow-[var(--shadow-glow)]" : "border-border bg-secondary/50"
                      }`}
                    >
                      <span className="block text-sm font-extrabold text-primary">{item.label}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-muted-foreground">{item.desc}</span>
                      <span className="mt-2 block text-xs font-extrabold text-accent">{item.price === 0 ? "Included Free" : `+ N$${item.price}`}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 animate-fade-up">
            <h3 className="text-base font-extrabold text-primary border-b border-border pb-3">Review & Payment Gateway</h3>
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary font-extrabold text-xs">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <span>Ready for Namibian DPO & EFT Secure Authorization</span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                Clicking <span className="font-bold text-primary">"Authorize & Issue Ticket"</span> below will launch the secure payment modal where you can select between <span className="font-bold text-primary">Mobile Money (MTC/PayToday), Bank EFT, Store Credit Wallet, or Cash on Delivery</span>.
              </p>
            </div>
          </div>
        )}

        <FareSummary
          seatNum={selectedSeatNum}
          subtotal={subtotal}
          luggageFee={luggage.price}
          serviceFee={serviceFee}
          addOnsFee={addOnsTotal - promoDiscount}
          total={total}
        />
      </main>

      <div className="fixed bottom-20 inset-x-0 z-40 px-4 pb-2 bg-gradient-to-t from-background via-background/90 to-transparent pt-3">
        <div className="mx-auto max-w-md">
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="h-14 w-full rounded-2xl bg-accent text-base font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98]"
            >
              Continue to {step === 1 ? "Passenger Details" : "Payment Gateway"} →
            </button>
          ) : (
            <button
              type="button"
              onClick={confirm}
              className="h-14 w-full rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span>Authorize & Issue Ticket (N${total})</span>
            </button>
          )}
        </div>
      </div>

      <PaymentGatewayModal
        open={isGatewayOpen}
        onOpenChange={setIsGatewayOpen}
        amountNAD={total}
        description={`Seat ${selectedSeatNum || "12A"} · ${trip.from} to ${trip.to}`}
        onSuccess={(method, ref) => {
          setIsGatewayOpen(false);
          const name = encodeURIComponent(`${form.name} ${form.surname}`.trim());
          navigate(
            `/confirmation?ref=${ref}&trip=${trip.id}&seats=${selectedSeatNum || "12A"}&total=${total}&name=${name}&payment=${encodeURIComponent(method)}&date=${travelDate}&pickup=${encodeURIComponent(pickupPoint)}`
          );
        }}
      />
    </div>
  );
};

const Stepper = ({ step }: { step: Step }) => {
  const labels = ["Coach Seat", "Passenger", "Checkout"];
  return (
    <div className="mb-4 flex items-center justify-between px-1">
      {labels.map((label, index) => {
        const value = (index + 1) as Step;
        const done = step > value;
        const active = step === value;
        return (
          <div key={label} className="flex flex-1 items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold ${
                done ? "bg-success text-white" : active ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)]" : "bg-secondary text-muted-foreground"
              }`}
            >
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

const CoachDetails = ({ trip }: { trip: (typeof TRIPS)[number] }) => (
  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-extrabold text-primary">Coach Specifications</h3>
        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{trip.bus.model}</p>
      </div>
      <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-primary">
        <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {trip.bus.comfortRating} Comfort
      </span>
    </div>
    <div className="flex flex-wrap gap-1.5 pt-1">
      {trip.bus.amenities.map((amenity) => (
        <AmenityIcon key={amenity} a={amenity} />
      ))}
    </div>
    <div className="grid gap-2.5 pt-2 border-t border-border/60 text-xs font-bold text-muted-foreground">
      <p className="flex gap-2 items-center">
        <Wifi className="h-4 w-4 shrink-0 text-accent" /> {trip.bus.wifiInfo}
      </p>
      <p className="flex gap-2 items-center">
        <Zap className="h-4 w-4 shrink-0 text-accent" /> {trip.bus.chargingInfo}
      </p>
      <p className="flex gap-2 items-center">
        <ShieldCheck className="h-4 w-4 shrink-0 text-success" /> {trip.bus.safetyNote}
      </p>
    </div>
  </section>
);

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <label className="block min-w-0">
    <span className="text-[10px] font-extrabold uppercase text-muted-foreground">{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 h-12 w-full rounded-xl border border-border bg-input px-3.5 text-xs font-bold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
    />
  </label>
);

const FareSummary = ({
  seatNum,
  subtotal,
  luggageFee,
  serviceFee,
  addOnsFee,
  total,
}: {
  seatNum: string;
  subtotal: number;
  luggageFee: number;
  serviceFee: number;
  addOnsFee: number;
  total: number;
}) => (
  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm mb-16 space-y-3">
    <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
      Fare Breakdown & Receipt
    </h3>
    <div className="space-y-2 text-xs font-bold">
      <Row label="Reserved Coach Seat">{seatNum ? `Seat ${seatNum}` : "To be selected"}</Row>
      <Row label="Base Passenger Fare">N${subtotal}</Row>
      <Row label="Luggage Allowance Fee">N${luggageFee}</Row>
      <Row label="Booking & Service Fee">N${serviceFee}</Row>
      {addOnsFee !== 0 && <Row label="Optional Add-ons / Discounts">N${addOnsFee}</Row>}
    </div>
    <div className="border-t border-border pt-3 flex items-center justify-between">
      <span className="text-sm font-extrabold text-muted-foreground">Total Due</span>
      <span className="text-2xl font-extrabold text-primary">N${total}</span>
    </div>
  </section>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-extrabold text-primary">{children}</span>
  </div>
);

export default Booking;
