import { Link, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { TRIPS } from "@/data/trips";
import { Check, Download, Home, MapPin, MessageCircle, ReceiptText, Ticket } from "lucide-react";

const Confirmation = () => {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "CL000000";
  const trip = TRIPS.find((item) => item.id === params.get("trip"));
  const seats = (params.get("seats") || "").split(",").filter(Boolean);
  const total = params.get("total") || "0";
  const name = params.get("name") || "Passenger";
  const payment = params.get("payment") || "card";
  const pickup = params.get("pickup") || trip?.pickup || "Main Terminal Depot";
  const travelDate = params.get("date") || new Date().toISOString().slice(0, 10);
  const formattedDate = new Date(travelDate + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const ticketPayload = JSON.stringify({
    ref,
    trip: trip?.id,
    seats,
    name,
    total,
    date: travelDate,
    from: trip?.from,
    to: trip?.to,
    departure: trip?.departure,
  });

  return (
    <div className="safe-page bg-background px-4 pt-10 pb-24">
      <div className="mx-auto max-w-md text-center animate-fade-up">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/12 text-success glow-ring">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-extrabold text-primary">Booking Confirmed</h1>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">Your CityLink QR ticket is ready for boarding.</p>
      </div>

      <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
        <div className="flex items-start justify-between bg-primary p-5 text-primary-foreground">
          <div className="min-w-0">
            <span className="text-[11px] font-extrabold uppercase text-white/70">Digital Ticket</span>
            <div className="mt-1 truncate text-xl font-extrabold">{name}</div>
          </div>
          <Ticket className="h-7 w-7 shrink-0 text-accent" />
        </div>

        {trip && (
          <div className="border-b border-border bg-secondary/55 p-5">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-2xl font-extrabold text-primary">{trip.departure}</div>
                <div className="mt-1 text-[11px] font-bold uppercase text-muted-foreground">{trip.from.slice(0, 3)}</div>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <div className="mb-1 text-[11px] font-bold text-muted-foreground">{trip.duration}</div>
                <div className="relative h-px w-full bg-border">
                  <MapPin className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-accent" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-primary">{trip.arrival}</div>
                <div className="mt-1 text-[11px] font-bold uppercase text-muted-foreground">{trip.to.slice(0, 3)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 p-5">
          <Detail label="Reference">{ref}</Detail>
          <Detail label="Travel Date">{formattedDate}</Detail>
          <Detail label="Total Paid">N${total}</Detail>
          <Detail label="Payment Method">{payment}</Detail>
          <Detail label="Seats">{seats.join(", ") || "Pending"}</Detail>
          <Detail label="Pickup Depot">{pickup}</Detail>
          {trip && <Detail label="Coach">{trip.bus.name}</Detail>}
        </div>

        <div className="relative border-t border-dashed border-border">
          <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-background" />
          <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background" />
        </div>

        <div className="flex flex-col items-center p-5">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <QRCodeSVG value={ticketPayload} size={156} level="M" />
          </div>
          <div className="mt-3 text-[11px] font-extrabold uppercase text-muted-foreground">Scan at boarding</div>
          <div className="mt-1 font-mono text-xs font-bold text-primary">{ref}</div>
        </div>

        <div className="flex flex-col gap-2 p-5 pt-0">
          <button
            onClick={() => window.print()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-extrabold text-primary active:scale-95 transition-transform"
          >
            <Download className="h-4 w-4" /> Save or Print QR Ticket
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `My CityLink ticket ${ref}: ${trip?.from} to ${trip?.to}, ${trip?.departure}, seats ${seats.join(", ")}, pickup at ${pickup}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-extrabold text-primary active:scale-95 transition-transform"
          >
            <MessageCircle className="h-4 w-4 text-success" /> Send Ticket to WhatsApp
          </a>
        </div>
      </div>

      {/* SMS Ticket Delivery Fallback Box */}
      <div className="mx-auto mt-5 max-w-md rounded-2xl border border-accent/40 bg-accent/5 p-4 space-y-3 animate-fade-up">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-primary flex items-center gap-2">
            📲 SMS Ticket Delivery Fallback
          </span>
          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-extrabold text-accent">
            No Data Required
          </span>
        </div>
        <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
          In low-signal areas or for travelers without smartphones up north, we can deliver an SMS with your reference and boarding details directly to mobile phone via MTC / Telecel SMS gateway.
        </p>
        <button
          type="button"
          onClick={() => {
            alert(`📲 SMS sent to registered mobile: "City-Link Ticket #${ref}. ${trip?.from}->${trip?.to}. Boarding ${travelDate} at ${trip?.departure}. Pickup: ${pickup}. Seat: ${seats.join(", ")}. Show to driver."`);
          }}
          className="w-full h-11 rounded-xl bg-accent text-accent-foreground font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <span>Send SMS Ticket Fallback Now</span>
        </button>
      </div>

      {/* Separate Printable/Downloadable Tax Receipt for Expense Claims */}
      <div className="mx-auto mt-4 max-w-md rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 text-primary">
            <ReceiptText className="h-6 w-6 text-accent shrink-0" />
            <div>
              <h2 className="text-sm font-extrabold">Tax Invoice & Expense Receipt</h2>
              <p className="text-[11px] font-semibold text-muted-foreground">City-Link Transport (Pty) Ltd · TIN: 8840192</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-secondary text-[11px] font-extrabold text-primary flex items-center gap-1 active:scale-95"
          >
            <Download className="h-3 w-3" /> PDF Receipt
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold border-t border-border pt-2 text-muted-foreground">
          <span>Base Ticket + Add-ons: N${total}</span>
          <span>VAT (15% Included): N${Math.round(Number(total) * 0.15)}</span>
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2">
        <Link to="/tickets" className="flex h-12 items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">
          My Tickets
        </Link>
        <Link to="/" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-primary-foreground">
          <Home className="h-4 w-4" /> Home
        </Link>
      </div>
    </div>
  );
};

const Detail = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="min-w-0">
    <div className="text-[11px] font-extrabold uppercase text-muted-foreground">{label}</div>
    <div className="mt-0.5 truncate text-sm font-extrabold text-primary">{children}</div>
  </div>
);

export default Confirmation;
