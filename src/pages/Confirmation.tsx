import { Link, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Check, Download, Home, MapPin, MessageCircle, ReceiptText, Route, ScanLine } from "lucide-react";

const Confirmation = () => {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "WCC000000";
  const from = params.get("from") || "Hosea Kutako International Airport";
  const to = params.get("to") || "Windhoek";
  const vehicle = params.get("vehicle") || "SUV";
  const total = params.get("total") || "0";
  const name = params.get("name") || "Passenger";
  const payment = params.get("payment") || "card";
  const pickup = params.get("pickup") || "Arrivals Hall Meet & Greet";
  const pickupTime = params.get("pickupTime") || "14:30";
  const travelDate = params.get("date") || new Date().toISOString().slice(0, 10);
  const formattedDate = new Date(travelDate + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const payload = JSON.stringify({ ref, name, total, date: travelDate, from, to, pickupTime, vehicle });

  return (
    <div className="safe-page bg-background px-4 pt-10 pb-24">
      <div className="mx-auto max-w-md text-center animate-fade-up">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/12 text-success glow-ring">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-extrabold text-primary">Transfer Confirmed</h1>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">Your Windhoek City Cab transfer reference is ready.</p>
      </div>

      <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
        <div className="flex items-start justify-between bg-primary p-5 text-primary-foreground">
          <div className="min-w-0">
            <span className="text-[11px] font-extrabold uppercase text-white/70">Digital Transfer</span>
            <div className="mt-1 truncate text-xl font-extrabold">{name}</div>
          </div>
          <Route className="h-7 w-7 shrink-0 text-accent" />
        </div>

        <div className="border-b border-border bg-secondary/55 p-5">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-2xl font-extrabold text-primary">{pickupTime}</div>
              <div className="mt-1 text-[11px] font-bold uppercase text-muted-foreground">{shortPlace(from)}</div>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div className="mb-1 text-[11px] font-bold text-muted-foreground">Private transfer</div>
              <div className="relative h-px w-full bg-border">
                <MapPin className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-accent" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold text-primary">Tracked</div>
              <div className="mt-1 text-[11px] font-bold uppercase text-muted-foreground">{shortPlace(to)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          <Detail label="Reference">{ref}</Detail>
          <Detail label="Pickup Date">{formattedDate}</Detail>
          <Detail label="Total Paid">N${total}</Detail>
          <Detail label="Payment Method">{payment}</Detail>
          <Detail label="Vehicle">{vehicle}</Detail>
          <Detail label="Pickup">{pickup}</Detail>
        </div>

        <div className="relative border-t border-dashed border-border">
          <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-background" />
          <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background" />
        </div>

        <div className="flex flex-col items-center p-5">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <QRCodeSVG value={payload} size={156} level="M" />
          </div>
          <div className="mt-3 text-[11px] font-extrabold uppercase text-muted-foreground">Transfer reference</div>
          <div className="mt-1 font-mono text-xs font-bold text-primary">{ref}</div>
        </div>

        <div className="flex flex-col gap-2 p-5 pt-0">
          <button onClick={() => window.print()} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-extrabold text-primary active:scale-95 transition-transform">
            <Download className="h-4 w-4" /> Save or Print Transfer
          </button>
          <a
            href={`https://wa.me/264812572188?text=${encodeURIComponent(`Windhoek City Cab transfer ${ref}: ${from} to ${to}, ${pickupTime}, pickup at ${pickup}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-extrabold text-primary active:scale-95 transition-transform"
          >
            <MessageCircle className="h-4 w-4 text-success" /> WhatsApp City Cab
          </a>
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-md rounded-2xl border border-accent/40 bg-accent/5 p-4 space-y-3 animate-fade-up">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-primary flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-accent" /> Driver Assignment
          </span>
          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-extrabold text-accent">24/7 Support</span>
        </div>
        <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
          City Cab will share driver and vehicle details before pickup. For airport arrivals, your driver can meet you in the arrivals hall with a name board.
        </p>
      </div>

      <div className="mx-auto mt-4 max-w-md rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 text-primary">
            <ReceiptText className="h-6 w-6 text-accent shrink-0" />
            <div>
              <h2 className="text-sm font-extrabold">Transfer Receipt</h2>
              <p className="text-[11px] font-semibold text-muted-foreground">JS City Cab cc T/A City Cab Transfers</p>
            </div>
          </div>
          <button type="button" onClick={() => window.print()} className="px-3 py-1.5 rounded-xl bg-secondary text-[11px] font-extrabold text-primary flex items-center gap-1 active:scale-95">
            <Download className="h-3 w-3" /> PDF
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold border-t border-border pt-2 text-muted-foreground">
          <span>Transfer: N${total}</span>
          <span>VAT included where applicable</span>
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2">
        <Link to="/tickets" className="flex h-12 items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">
          My Transfers
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

const shortPlace = (value: string) => value.replace("Hosea Kutako International Airport", "HKIA");

export default Confirmation;
