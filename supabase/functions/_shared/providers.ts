export type Coordinates = { lat: number; lng: number };
export type RouteResult = { distanceKm: number; durationMinutes: number; geometry?: unknown };
export type PaymentIntent = { providerId: string; status: "pending" | "paid" | "failed" };
export type ProviderResult = { providerId: string; accepted: boolean; message?: string };

export interface MapsProvider { geocode(query: string): Promise<Coordinates | null>; route(from: Coordinates, to: Coordinates): Promise<RouteResult>; }
export interface PaymentsProvider { createIntent(input: { bookingId: string; amountNad: number; method: string }): Promise<PaymentIntent>; refund(providerId: string, amountNad?: number): Promise<PaymentIntent>; }
export interface MessagingProvider { send(input: { to: string; template: string; variables: Record<string, string> }): Promise<ProviderResult>; }
export interface FlightProvider { getStatus(flightNumber: string, date: string): Promise<{ status: string; scheduledAt?: string; estimatedAt?: string } | null>; }
export interface PushProvider { send(input: { token: string; title: string; body: string; data?: Record<string, string> }): Promise<ProviderResult>; }

const hash = (value: string) => Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
export const mockMaps: MapsProvider = {
  async geocode(query) { return { lat: -22.56 + (hash(query) % 100) / 10000, lng: 17.08 + (hash(query) % 100) / 10000 }; },
  async route(from, to) { const distanceKm = Math.max(2, Math.hypot(from.lat - to.lat, from.lng - to.lng) * 111); return { distanceKm: Number(distanceKm.toFixed(1)), durationMinutes: Math.ceil(distanceKm * 2.2) }; },
};
export const mockPayments: PaymentsProvider = { async createIntent(input) { return { providerId: `mock_payment_${input.bookingId}`, status: "pending" }; }, async refund(providerId) { return { providerId, status: "pending" }; } };
export const mockMessaging: MessagingProvider = { async send(input) { return { providerId: `mock_message_${Date.now()}`, accepted: true, message: `Mock ${input.template} sent to ${input.to}` }; } };
export const mockFlight: FlightProvider = { async getStatus(flightNumber, date) { return { status: "scheduled", scheduledAt: `${date}T14:30:00Z` }; } };
export const mockPush: PushProvider = { async send() { return { providerId: `mock_push_${Date.now()}`, accepted: true }; } };

export const providers = { maps: mockMaps, payments: mockPayments, messaging: mockMessaging, flight: mockFlight, push: mockPush };
