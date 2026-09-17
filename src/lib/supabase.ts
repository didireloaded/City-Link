import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL || "";
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export const isSupabaseConfigured = Boolean(supabase);

export async function requestBookingQuote(input: { from: string; to: string; vehicleCategoryId?: string; passengers?: number; luggage?: number }) {
  if (!supabase) return null;
  const { data, error } = await supabase.functions.invoke("booking-quote", { body: input });
  if (error) throw error;
  return data as { route: { distanceKm: number; durationMinutes: number }; quote: { amountNad: number; quoteRequired: boolean; currency: string } };
}

export async function queueBookingDispatch(bookingId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.functions.invoke("dispatch-booking", { body: { bookingId } });
  if (error) throw error;
  return data;
}

export function subscribeToBooking(bookingId: string, onChange: (payload: unknown) => void) {
  if (!supabase) return () => undefined;
  const channel = supabase.channel(`booking:${bookingId}`).on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `id=eq.${bookingId}` }, onChange).subscribe();
  return () => { void supabase.removeChannel(channel); };
}
