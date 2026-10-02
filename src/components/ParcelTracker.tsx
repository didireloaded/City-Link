import { useState } from "react";
import { STATUS_STEPS, type ParcelStatus } from "@/lib/parcels";
import { Package, Search, RefreshCw, CheckCircle2, ShieldCheck, MapPin, Check, Bell, Navigation, Lock } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";

export function ParcelTracker({ initialCode = "CP-2026-8842" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [activeCode, setActiveCode] = useState(initialCode);
  const utils = trpc.useUtils();

  const trackQuery = trpc.parcels.track.useQuery(
    { code: activeCode },
    { enabled: activeCode.trim().length >= 3, retry: false },
  );

  const logEvent = trpc.parcels.logEvent.useMutation();
  const confirmHandover = trpc.parcels.confirmHandover.useMutation();

  // Staff simulation state for logging quick events
  const [showStaffActions, setShowStaffActions] = useState(false);
  const [staffStatus, setStaffStatus] = useState<ParcelStatus>("in_transit");
  const [staffLocation, setStaffLocation] = useState("Otjiwarongo B1 Checkpoint");
  const [staffNote, setStaffNote] = useState("Coach clear, moving on schedule");

  const result = trackQuery.data ?? null;
  const loading = trackQuery.isFetching || logEvent.isPending || confirmHandover.isPending;

  // Map the server model to the display model used below.
  const parcel = result
    ? {
        tracking_code: result.parcel.trackingCode,
        origin_office: result.parcel.originOffice,
        destination_office: result.parcel.destinationOffice,
        status: result.parcel.status as ParcelStatus,
        current_location: result.parcel.currentLocation,
        description: result.parcel.description || `${result.parcel.size} (${result.parcel.weightKg}kg)`,
        created_at: result.parcel.createdAt,
        receiverConfirmed: Boolean(result.parcel.receiverConfirmedAt),
        senderConfirmed: Boolean(result.parcel.senderConfirmedAt),
        price: result.parcel.priceNad,
        isOwner: result.isOwner,
      }
    : null;

  const events = (result?.events ?? []).map((ev) => ({
    status: ev.status,
    location: ev.location,
    note: ev.note,
    created_at: ev.createdAt,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setActiveCode(code.trim().toUpperCase());
  };

  const refresh = () => utils.parcels.track.invalidate({ code: activeCode });

  const handleStaffLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcel?.tracking_code) return;
    try {
      await logEvent.mutateAsync({
        code: parcel.tracking_code,
        status: staffStatus,
        location: staffLocation,
        note: staffNote,
      });
      toast.success(`Logged ${staffStatus.replace(/_/g, " ")} for ${parcel.tracking_code}`);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log event.");
    }
  };

  const handleConfirm = async (role: "sender" | "receiver") => {
    if (!parcel?.tracking_code) return;
    try {
      await confirmHandover.mutateAsync({ code: parcel.tracking_code, role });
      toast.success(
        role === "receiver"
          ? "Delivery confirmed by receiver! Sender confirmation still pending."
          : "Sender confirmation recorded! Waiting for receiver confirmation.",
      );
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Confirmation failed.");
    }
  };

  const currentStepIndex = parcel
    ? STATUS_STEPS.findIndex((s) => s.key === parcel.status)
    : -1;

  const notFound = activeCode.trim().length >= 3 && !trackQuery.isFetching && trackQuery.data === null;

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* Tracking Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Enter tracking code (e.g. CP-2026-8842)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="h-12 w-full rounded-xl border border-border bg-input pl-10 pr-3 text-xs font-extrabold uppercase outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-accent px-5 text-xs font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] active:scale-95 disabled:opacity-50 transition-transform"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Track"}
        </button>
      </form>

      {notFound && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-extrabold text-destructive text-center">
          No parcel found with that tracking code.
        </div>
      )}

      {parcel && parcel.status === "expired" ? (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm text-center space-y-4 animate-fade-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Lock className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-extrabold text-primary">Tracking Link Expired</h3>
          <p className="text-xs font-semibold text-muted-foreground max-w-sm mx-auto leading-relaxed">
            This secure tracking link ({parcel.tracking_code}) has expired following mutually confirmed delivery by both sender and receiver. For privacy and security, real-time location tracking and waybill details are now closed.
          </p>
          <div className="rounded-2xl bg-secondary/80 p-3 text-[11px] font-extrabold text-success flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Handover Mutually Confirmed & Completed
          </div>
        </div>
      ) : parcel ? (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-5 animate-fade-up">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Waybill ID
              </span>
              <h3 className="text-lg font-extrabold text-primary">{parcel.tracking_code}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Route & Price</span>
              <p className="text-xs font-extrabold text-primary">
                {parcel.origin_office} → {parcel.destination_office}
              </p>
              <p className="text-[11px] font-extrabold text-accent">Fare: N${parcel.price}</p>
            </div>
          </div>

          {/* Landed / Arrived Notification Banner */}
          {(parcel.status === "arrived" || parcel.status === "ready_for_collection" || parcel.status === "collected") && (
            <div className="flex items-start gap-3 rounded-2xl border border-success/40 bg-success/15 p-3.5 text-xs font-extrabold text-primary">
              <Bell className="h-5 w-5 shrink-0 text-success animate-pulse" />
              <div>
                <span className="text-success block text-xs">Notification: Parcel Has Landed!</span>
                <span className="text-[11px] font-semibold text-muted-foreground block mt-0.5 leading-tight">
                  Coach arrived at {parcel.destination_office} Terminal. Ready for receiver collection and confirmation.
                </span>
              </div>
            </div>
          )}

          {/* Interactive Live Highway Corridor Tracker Map */}
          <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-accent animate-spin" style={{ animationDuration: "14s" }} /> Live Coach Map
              </span>
              <span className="text-[10px] font-bold text-accent">Express Route</span>
            </div>
            <div className="relative h-4 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-1000 rounded-full shadow-[0_0_12px_hsl(var(--accent))]"
                style={{
                  width:
                    parcel.status === "booked" || parcel.status === "dropped_off"
                      ? "20%"
                      : parcel.status === "in_transit"
                      ? "65%"
                      : "100%",
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-extrabold text-muted-foreground">
              <span className="text-primary">{parcel.origin_office}</span>
              <span>B1 Highway Checkpoints</span>
              <span className="text-primary">{parcel.destination_office}</span>
            </div>
          </div>

          {/* Status Stepper */}
          <div className="space-y-1 pt-1">
            {STATUS_STEPS.map((stepItem, i) => {
              const done = i <= currentStepIndex;
              const isLast = i === STATUS_STEPS.length - 1;
              const isCurrent = stepItem.key === parcel.status;
              return (
                <div key={stepItem.key} className="relative flex gap-3.5 pb-4 last:pb-0">
                  {!isLast && (
                    <div
                      className={`absolute left-[11px] top-6 bottom-0 w-[2px] ${
                        i < currentStepIndex ? "bg-success shadow-[0_0_8px_hsl(var(--success))]" : "bg-border"
                      }`}
                    />
                  )}
                  <div className="flex flex-col items-center">
                    <div
                      className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                        done
                          ? "bg-success text-white shadow-[0_0_10px_hsl(var(--success))]"
                          : "border-2 border-border bg-card text-transparent"
                      } ${isCurrent ? "ring-4 ring-success/30 animate-pulse" : ""}`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p
                      className={`text-xs font-extrabold leading-tight ${
                        done ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {stepItem.label}
                    </p>
                    {isCurrent && parcel.current_location && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-accent">
                        <MapPin className="h-3 w-3" /> {parcel.current_location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dual Handover Confirmation Security Box */}
          <div className="rounded-3xl border border-accent/40 bg-accent/5 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-accent/20 pb-2">
              <h4 className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" /> Mutual Delivery Confirmation
              </h4>
              <span className="text-[10px] font-bold text-muted-foreground">Expires Link When Both Confirm</span>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">
              To secure item handover, both the receiver and sender must verify receipt. Once both parties confirm, this tracking link expires automatically.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                disabled={parcel.receiverConfirmed || loading}
                onClick={() => handleConfirm("receiver")}
                className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-extrabold transition-all active:scale-95 ${
                  parcel.receiverConfirmed
                    ? "bg-success/20 text-success border border-success/30 cursor-default"
                    : "bg-card border border-border text-primary shadow-xs hover:border-accent"
                }`}
              >
                <Check className="h-4 w-4 shrink-0" />
                <span>{parcel.receiverConfirmed ? "Receiver Confirmed" : "Receiver: Confirm"}</span>
              </button>
              <button
                type="button"
                disabled={parcel.senderConfirmed || loading}
                onClick={() => handleConfirm("sender")}
                className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-extrabold transition-all active:scale-95 ${
                  parcel.senderConfirmed
                    ? "bg-success/20 text-success border border-success/30 cursor-default"
                    : "bg-card border border-border text-primary shadow-xs hover:border-accent"
                }`}
              >
                <Check className="h-4 w-4 shrink-0" />
                <span>{parcel.senderConfirmed ? "Sender Confirmed" : "Sender: Confirm"}</span>
              </button>
            </div>
          </div>

          {/* Staff quick actions (owner only) */}
          {parcel.isOwner && (
            <div className="rounded-2xl border border-border bg-secondary/30 p-3.5">
              <button
                type="button"
                onClick={() => setShowStaffActions((v) => !v)}
                className="flex w-full items-center justify-between text-xs font-extrabold text-primary"
              >
                <span className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-accent" /> Depot status update
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">{showStaffActions ? "Hide" : "Show"}</span>
              </button>
              {showStaffActions && (
                <form onSubmit={handleStaffLog} className="mt-3 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={staffStatus}
                      onChange={(e) => setStaffStatus(e.target.value as ParcelStatus)}
                      className="h-11 rounded-xl border border-border bg-input px-3 text-xs font-bold outline-none focus:border-accent"
                    >
                      {STATUS_STEPS.map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                    <input
                      value={staffLocation}
                      onChange={(e) => setStaffLocation(e.target.value)}
                      placeholder="Location"
                      className="h-11 rounded-xl border border-border bg-input px-3 text-xs font-bold outline-none focus:border-accent"
                    />
                  </div>
                  <input
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    placeholder="Note"
                    className="h-11 w-full rounded-xl border border-border bg-input px-3 text-xs font-bold outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl bg-accent text-xs font-extrabold text-accent-foreground active:scale-95 disabled:opacity-50 transition-transform"
                  >
                    Log Status Update
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Event History */}
          <div className="border-t border-border pt-4">
            <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Shipment Status History
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {events.map((ev, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-secondary/60 p-2.5 text-xs font-semibold text-primary space-y-0.5"
                >
                  <div className="flex justify-between font-extrabold">
                    <span>{ev.status ? ev.status.replace(/_/g, " ").toUpperCase() : "EVENT"}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(ev.created_at).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {ev.location && <p className="text-[11px] text-muted-foreground">{ev.location}</p>}
                  {ev.note && <p className="text-[11px] italic text-primary/80">"{ev.note}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
