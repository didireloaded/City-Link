import { useState } from "react";
import { Info, X, Sparkles, CreditCard, Clock, Package, Shield, Bus } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "Pick your exact seat", desc: "Cinema-style booking. Window, aisle, front, back — your choice." },
  { icon: CreditCard, title: "Pay any way", desc: "Card, EFT, e-wallet, PayToCell, or cash on board." },
  { icon: Clock, title: "Pre-book ahead", desc: "Lock in month-end and holiday seats weeks in advance." },
  { icon: Package, title: "Live parcel tracking", desc: "Share a tracking link. The driver's phone is the tracker." },
  { icon: Shield, title: "Confirmed & secure", desc: "Instant SMS confirmation, next-of-kin recorded for safety." },
  { icon: Bus, title: "Premium fleet", desc: "AC, WiFi, USB charging, reclining seats — every ride." },
];

export const InfoSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="w-4 h-4" /> Why City-Link
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <div
            className="relative w-full md:max-w-2xl glass rounded-t-3xl md:rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Built for Namibian Comfort & Speed</h2>
                <p className="text-sm text-muted-foreground mt-1">From Windhoek to the far North — City-Link connects people and parcels on time.</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="card-elevated rounded-2xl p-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <f.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
