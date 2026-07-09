import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Smartphone,
  Building2,
  CreditCard,
  Wallet,
  CheckCircle2,
  Copy,
  Loader2,
  ArrowRight,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { loadProfile, saveProfile } from "@/lib/profile";

interface PaymentGatewayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountNAD: number;
  description: string;
  onSuccess: (paymentMethod: string, reference: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  open,
  onOpenChange,
  amountNAD,
  description,
  onSuccess,
}) => {
  const [method, setMethod] = useState<"mobile" | "eft" | "wallet" | "card" | "cod">("mobile");
  const [phone, setPhone] = useState("+264 81 234 5678");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8812");
  const [cardExp, setCardExp] = useState("11/28");
  const [cardCvv, setCardCvv] = useState("391");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pushStep, setPushStep] = useState<number>(0); // 0=idle, 1=push sent, 2=confirmed
  const [eftRef] = useState(() => `CL-EFT-${Math.floor(10000 + Math.random() * 90000)}`);
  const [profile, setProfile] = useState(() => loadProfile());

  useEffect(() => {
    if (open) {
      setProfile(loadProfile());
      setIsProcessing(false);
      setPushStep(0);
    }
  }, [open]);

  const handleCopyEft = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleProcessPayment = () => {
    if (method === "wallet") {
      const balance = profile.walletBalanceNAD || 0;
      if (balance < amountNAD) {
        toast.error("Insufficient Store Credit Wallet balance! Please choose another payment method.");
        return;
      }
      setIsProcessing(true);
      setTimeout(() => {
        const updated = { ...profile, walletBalanceNAD: balance - amountNAD };
        saveProfile(updated);
        setIsProcessing(false);
        toast.success(`Paid N$${amountNAD} using Store Credit Wallet!`);
        onSuccess("Store Credit Wallet", `CL-WAL-${Date.now().toString().slice(-6)}`);
      }, 1200);
      return;
    }

    if (method === "mobile") {
      if (!phone || phone.length < 8) {
        toast.error("Please enter a valid MTC or Telecel mobile money phone number.");
        return;
      }
      setIsProcessing(true);
      setPushStep(1);
      setTimeout(() => {
        setPushStep(2);
        toast.success("Mobile Money push approved on device!");
        setTimeout(() => {
          setIsProcessing(false);
          onSuccess("DPO Pay / PayToday Mobile Money", `DPO-MM-${Date.now().toString().slice(-6)}`);
        }, 800);
      }, 2800);
      return;
    }

    if (method === "eft") {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        toast.success("EFT payment logged! Reference bound to your booking.");
        onSuccess("Namibian EFT / Bank Transfer", eftRef);
      }, 1500);
      return;
    }

    if (method === "cod") {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        toast.success("Reservation confirmed! Cash payment due at departure depot.");
        onSuccess("Pay Cash on Delivery / Check-in", `CL-COD-${Date.now().toString().slice(-6)}`);
      }, 1000);
      return;
    }

    // Card
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Card authorization verified via DPO Secure Gateway!");
      onSuccess("Credit/Debit Card (DPO Pay)", `DPO-CARD-${Date.now().toString().slice(-6)}`);
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-card border border-border shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-extrabold text-primary flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" />
              <span>Namibia Secure Checkout</span>
            </DialogTitle>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-extrabold text-success border border-success/30">
              DPO Pay & PayToday
            </span>
          </div>
        </DialogHeader>

        {/* Amount Header Banner */}
        <div className="rounded-2xl bg-secondary/60 p-4 border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
              Total Amount Payable
            </span>
            <p className="text-xl font-extrabold text-primary mt-0.5">{description}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-accent">N${amountNAD.toLocaleString()}</span>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { id: "mobile", label: "Mobile Money", icon: Smartphone },
            { id: "eft", label: "Bank EFT", icon: Building2 },
            { id: "wallet", label: "Wallet", icon: Wallet },
            { id: "card", label: "Card Pay", icon: CreditCard },
            { id: "cod", label: "Cash / COD", icon: Banknote },
          ].map((item) => {
            const active = method === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id as any)}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-2.5 text-center transition-all active:scale-95 ${
                  active
                    ? "border-accent bg-accent/15 text-accent font-extrabold ring-2 ring-accent/30 shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground font-semibold"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-[10px] leading-tight truncate w-full">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* METHOD 1: DPO Pay / PayToday Mobile Money */}
        {method === "mobile" && (
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3.5 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-primary">MTC Pay & PayToday Push</span>
              <span className="text-[10px] font-bold text-success">Instant Mobile Authorization</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              Enter your mobile number. DPO Pay will send a push notification directly to your phone to approve N${amountNAD}.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-primary">Mobile Money Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+264 81 ••• ••••"
                  className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-xs font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {pushStep === 1 && (
              <div className="rounded-xl border border-accent/40 bg-accent/10 p-3.5 text-center space-y-2 animate-pulse">
                <Loader2 className="h-6 w-6 text-accent animate-spin mx-auto" />
                <p className="text-xs font-extrabold text-primary">Check your phone now!</p>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  Tap "Approve" on your MTC / PayToday push notification to authorize N${amountNAD}.
                </p>
              </div>
            )}
            {pushStep === 2 && (
              <div className="rounded-xl border border-success/40 bg-success/15 p-3 text-center text-xs font-extrabold text-success flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Push Approved successfully! Completing ticket...
              </div>
            )}
          </div>
        )}

        {/* METHOD 2: Bank EFT / Transfer */}
        {method === "eft" && (
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3 animate-fade-up">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div>
                <h4 className="text-xs font-extrabold text-primary">City-Link Transport (Pty) Ltd</h4>
                <p className="text-[10px] font-semibold text-muted-foreground">Bank Windhoek · Main Branch</p>
              </div>
              <span className="rounded-lg bg-secondary px-2 py-1 font-mono text-[11px] font-extrabold text-primary">
                EFT Direct
              </span>
            </div>

            <div className="space-y-2 text-xs font-semibold text-primary">
              <div className="flex justify-between items-center rounded-xl bg-card p-2.5 border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Account Number</span>
                  <span className="font-mono font-extrabold">800 1923 8122</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyEft("80019238122", "Account Number")}
                  className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex justify-between items-center rounded-xl bg-card p-2.5 border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Branch Code</span>
                  <span className="font-mono font-extrabold">481-972 (Bank Windhoek)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyEft("481972", "Branch Code")}
                  className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex justify-between items-center rounded-xl border border-accent/40 bg-accent/10 p-2.5">
                <div>
                  <span className="text-[10px] font-extrabold text-accent block">Required Payment Reference</span>
                  <span className="font-mono font-extrabold text-sm text-primary">{eftRef}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyEft(eftRef, "Payment Reference")}
                  className="px-2.5 py-1.5 rounded-lg bg-accent text-accent-foreground font-extrabold text-[11px] flex items-center gap-1 active:scale-95"
                >
                  <Copy className="h-3 w-3" /> Copy Ref
                </button>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-muted-foreground leading-tight pt-1">
              Transfer exact fare of <span className="font-bold text-primary">N${amountNAD}</span> via standard online banking or FNB/Standard Bank ATM using reference <span className="font-mono font-bold text-primary">{eftRef}</span>.
            </p>
          </div>
        )}

        {/* METHOD 3: Store Credit Wallet */}
        {method === "wallet" && (
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3.5 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-accent" /> City-Link Credit Wallet
              </span>
              <span className="text-[10px] font-bold text-success">Instant Settlement</span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Available Balance</span>
                <span className="text-xl font-extrabold text-primary">N${(profile.walletBalanceNAD || 0).toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">After Payment</span>
                <span className={`text-sm font-extrabold ${
                  (profile.walletBalanceNAD || 0) >= amountNAD ? "text-success" : "text-destructive"
                }`}>
                  N${Math.max(0, (profile.walletBalanceNAD || 0) - amountNAD).toLocaleString()}
                </span>
              </div>
            </div>

            {(profile.walletBalanceNAD || 0) < amountNAD && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs font-bold text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Your wallet balance is N${amountNAD - (profile.walletBalanceNAD || 0)} short. Please select Mobile Money or Bank EFT above.</span>
              </div>
            )}
          </div>
        )}

        {/* METHOD 4: Card Checkout */}
        {method === "card" && (
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-primary">DPO Secure Card Gateway</span>
              <span className="text-[10px] font-bold text-accent">Visa / Mastercard / AMEX</span>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-mono font-bold text-primary focus:border-accent focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-mono font-bold text-primary focus:border-accent focus:outline-none"
                />
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="CVV"
                  maxLength={4}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-mono font-bold text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 pt-1">
              🔒 256-bit encrypted checkout via DPO Group Africa.
            </p>
          </div>
        )}

        {/* METHOD 5: Cash on Delivery / Pay at Office */}
        {method === "cod" && (
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-primary">Cash on Delivery / Office Check-in</span>
              <span className="text-[10px] font-bold text-accent">Pay on Arrival</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              Your ticket reservation or parcel dispatch will be locked instantly. Simply pay cash <span className="font-bold text-primary">(N${amountNAD})</span> at our Bahnhof Street Windhoek desk or Oshakati Terminal prior to boarding or parcel collection.
            </p>
            <div className="rounded-xl border border-success/30 bg-success/10 p-2.5 text-[11px] font-extrabold text-success flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Seat / Waybill reserved without upfront card payment.
            </div>
          </div>
        )}

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleProcessPayment}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary via-primary to-primary-glow text-primary-foreground font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                <span>Processing Authorization...</span>
              </>
            ) : (
              <>
                <span>Authorize & Pay N${amountNAD.toLocaleString()}</span>
                <ArrowRight className="h-4 w-4 text-accent" />
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
