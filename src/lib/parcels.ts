/**
 * Shared parcel types and presentation helpers.
 * Data access lives in the tRPC `parcels` router — see src/hooks/useParcels.ts.
 */

export type ParcelStatus =
  | "booked"
  | "dropped_off"
  | "in_transit"
  | "arrived"
  | "ready_for_collection"
  | "collected"
  | "expired"
  | "cancelled";

/** @deprecated Alias kept for compatibility with existing imports. */
export type SupabaseParcelStatus = ParcelStatus;

export type ParcelStage = "received" | "loaded" | "transit" | "arrived";

export const STATUS_STEPS: { key: ParcelStatus; label: string; desc: string }[] = [
  { key: "booked", label: "Booked", desc: "Parcel registered on City Link system" },
  { key: "dropped_off", label: "Dropped off", desc: "Handed in at origin terminal counter" },
  { key: "in_transit", label: "In transit", desc: "Traveling along B1 Highway corridor" },
  { key: "arrived", label: "Arrived", desc: "Coach arrived at destination terminal" },
  { key: "ready_for_collection", label: "Ready for collection", desc: "Sorted and waiting at desk" },
  { key: "collected", label: "Collected", desc: "Successfully handed over to receiver" },
];

export const STAGE_LABELS: Record<ParcelStage, { label: string; desc: string }> = {
  received: { label: "Dropped Off", desc: "Parcel received at City Link office counter" },
  loaded: { label: "Coach Loaded", desc: "Loaded onto luxury sleeper coach" },
  transit: { label: "In Transit", desc: "On B1 Highway route towards destination" },
  arrived: { label: "Ready for Collection", desc: "Arrived at destination office terminal" },
};

export const STAGE_ORDER: ParcelStage[] = ["received", "loaded", "transit", "arrived"];

export function mapStatusToStage(status: ParcelStatus): ParcelStage {
  switch (status) {
    case "booked":
    case "dropped_off":
      return "received";
    case "in_transit":
      return "transit";
    case "arrived":
    case "ready_for_collection":
    case "collected":
      return "arrived";
    default:
      return "received";
  }
}

/** @deprecated Alias kept for compatibility with existing imports. */
export const mapSupabaseStatusToStage = mapStatusToStage;

export const calcParcelPrice = (weightKg: number): number =>
  Math.max(50, Math.round(weightKg) * 8 + 50);
