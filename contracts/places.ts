import { z } from "zod";

export const savedPlaceSchema = z.object({
  id: z.string().uuid(),
  label: z.string().trim().min(1).max(40),
  locality: z.string().trim().min(1).max(255),
  address: z.string().trim().min(1).max(255),
  coordinates: z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) }).optional(),
});
export const savedPlacesSchema = z.array(savedPlaceSchema).max(20).refine(
  places => new Set(places.map(place => place.id)).size === places.length,
  "Place identifiers must be unique",
);
export type SavedPlace = z.infer<typeof savedPlaceSchema>;

export function recentDestinations<T extends { toLocation: string; dropoff: string | null }>(bookings: T[]): T[] {
  const seen = new Set<string>();
  return bookings.filter(booking => {
    const key = JSON.stringify([booking.toLocation.trim().toLowerCase(), booking.dropoff?.trim().toLowerCase() || ""]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
}
