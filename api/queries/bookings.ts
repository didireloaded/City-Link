import { and, eq, gt, inArray, or } from "drizzle-orm";
import * as schema from "@db/schema";
import type { Booking } from "@db/schema";
import { getDb } from "./connection";
import { createNotification } from "./notifications";

const DRIVER_POOL = [
  { name: "Johannes Mwafangeyo", phone: "+264812572188", vehicle: "Toyota Fortuner · N 123-456 W" },
  { name: "Selma Nangolo", phone: "+264814455667", vehicle: "Mercedes Vito · N 654-321 W" },
  { name: "Petrus Iipinge", phone: "+264817788990", vehicle: "Hyundai H1 · N 789-012 W" },
  { name: "Maria Shilongo", phone: "+264811122334", vehicle: "Toyota Quantum · N 345-678 W" },
];

export function generateReference() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, "0")}-${rand}`;
}

export type NewBooking = {
  userId: number;
  tripId?: string | null;
  service: string;
  vehicle: string;
  fromLocation: string;
  toLocation: string;
  pickup?: string | null;
  dropoff?: string | null;
  travelDate: string;
  pickupTime: string;
  passengers: number;
  seats?: string[];
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string | null;
  passengerType?: string;
  luggage: number;
  childSeat: boolean;
  flightNumber?: string | null;
  notes?: string | null;
  amountNad: number;
  paymentMethod?: string | null;
};

export async function createBooking(data: NewBooking): Promise<Booking> {
  const db = getDb();
  const reference = generateReference();
  await db.insert(schema.bookings).values({
    ...data,
    reference,
    status: "confirmed",
  });
  const created = await db.query.bookings.findFirst({
    where: eq(schema.bookings.reference, reference),
  });
  if (!created) throw new Error("Failed to create booking");

  await createNotification({
    userId: data.userId,
    title: `Transfer ${reference} confirmed`,
    body: `${data.fromLocation} → ${data.toLocation} on ${data.travelDate} at ${data.pickupTime}. Driver details will follow before pickup.`,
    type: "booking",
  });

  return created;
}

/** Seat numbers unavailable for a given trip/date: confirmed/dispatched seats + unexpired holds. */
export async function getTakenSeats(tripId: string, travelDate: string) {
  const db = getDb();
  const rows = await db.query.bookings.findMany({
    where: and(
      eq(schema.bookings.tripId, tripId),
      eq(schema.bookings.travelDate, travelDate),
      or(
        inArray(schema.bookings.status, ["confirmed", "dispatched", "completed"]),
        and(eq(schema.bookings.status, "held"), gt(schema.bookings.heldUntil, new Date())),
      ),
    ),
  });
  const taken = new Set<string>();
  for (const row of rows) {
    for (const seat of row.seats ?? []) taken.add(seat);
  }
  return [...taken];
}

export async function holdSeat(data: {
  userId: number;
  tripId: string;
  travelDate: string;
  seatNumber: string;
  passengerName: string;
  passengerType: string;
  priceNad: number;
}) {
  const db = getDb();
  const taken = await getTakenSeats(data.tripId, data.travelDate);
  if (taken.includes(data.seatNumber)) {
    return { conflict: true as const };
  }
  const reference = generateReference();
  const heldUntil = new Date(Date.now() + 10 * 60 * 1000);
  await db.insert(schema.bookings).values({
    userId: data.userId,
    reference,
    tripId: data.tripId,
    service: "Coach Seat",
    vehicle: "Luxury Coach",
    fromLocation: "Windhoek",
    toLocation: "Ongwediva",
    travelDate: data.travelDate,
    pickupTime: "07:00",
    passengers: 1,
    seats: [data.seatNumber],
    passengerName: data.passengerName,
    passengerPhone: "",
    passengerType: data.passengerType,
    luggage: 1,
    childSeat: false,
    amountNad: data.priceNad,
    status: "held",
    heldUntil,
  });
  return { conflict: false as const, reference, heldUntil };
}

/** Lazily assign drivers to confirmed bookings whose travel date is within 48h. */
export async function dispatchUpcoming(userId: number) {
  const db = getDb();
  const confirmed = await db.query.bookings.findMany({
    where: and(
      eq(schema.bookings.userId, userId),
      eq(schema.bookings.status, "confirmed"),
    ),
  });
  const cutoff = new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  for (const booking of confirmed) {
    if (booking.travelDate > cutoff || booking.travelDate < today) continue;
    const driver = DRIVER_POOL[booking.id % DRIVER_POOL.length];
    await db
      .update(schema.bookings)
      .set({
        status: "dispatched",
        driverName: driver.name,
        driverPhone: driver.phone,
        driverVehicle: driver.vehicle,
      })
      .where(eq(schema.bookings.id, booking.id));
    await createNotification({
      userId,
      title: `Driver assigned · ${booking.reference}`,
      body: `${driver.name} will meet you in ${driver.vehicle}. Pickup ${booking.travelDate} at ${booking.pickupTime}.`,
      type: "dispatch",
    });
  }
}

/** Lazily complete dispatched bookings whose travel date has passed. */
export async function completePast(userId: number) {
  const db = getDb();
  const active = await db.query.bookings.findMany({
    where: and(
      eq(schema.bookings.userId, userId),
      inArray(schema.bookings.status, ["confirmed", "dispatched"]),
    ),
  });
  const today = new Date().toISOString().slice(0, 10);
  for (const booking of active) {
    if (booking.travelDate >= today) continue;
    await db
      .update(schema.bookings)
      .set({ status: "completed" })
      .where(eq(schema.bookings.id, booking.id));
    await createNotification({
      userId,
      title: `Transfer ${booking.reference} completed`,
      body: "Thank you for riding with City Link. Please rate your transfer.",
      type: "booking",
    });
  }
}

export async function listBookingsByUser(userId: number) {
  await completePast(userId);
  await dispatchUpcoming(userId);
  return getDb().query.bookings.findMany({
    where: and(
      eq(schema.bookings.userId, userId),
      inArray(schema.bookings.status, ["confirmed", "dispatched", "completed", "cancelled"]),
    ),
    orderBy: (b, { desc }) => [desc(b.createdAt)],
    limit: 100,
  });
}

export async function findBookingForUser(userId: number, id: number) {
  return getDb().query.bookings.findFirst({
    where: and(eq(schema.bookings.id, id), eq(schema.bookings.userId, userId)),
  });
}

export async function findBookingByReference(userId: number, reference: string) {
  await completePast(userId);
  await dispatchUpcoming(userId);
  return getDb().query.bookings.findFirst({
    where: and(
      eq(schema.bookings.reference, reference.toUpperCase()),
      eq(schema.bookings.userId, userId),
    ),
  });
}

export async function cancelBooking(userId: number, id: number) {
  const booking = await findBookingForUser(userId, id);
  if (!booking) return null;
  if (booking.status === "completed" || booking.status === "cancelled") return booking;
  await getDb()
    .update(schema.bookings)
    .set({ status: "cancelled" })
    .where(eq(schema.bookings.id, id));
  await createNotification({
    userId,
    title: `Transfer ${booking.reference} cancelled`,
    body: `N$${booking.amountNad} has been credited to your City Link wallet.`,
    type: "booking",
  });
  return findBookingForUser(userId, id);
}

export async function rateBooking(userId: number, id: number, rating: number, comment?: string) {
  const booking = await findBookingForUser(userId, id);
  if (!booking) return null;
  await getDb()
    .update(schema.bookings)
    .set({ rating, ratingComment: comment ?? null })
    .where(eq(schema.bookings.id, id));
  return findBookingForUser(userId, id);
}

export async function recentReviews(limit = 12) {
  const db = getDb();
  const rows = await db.query.bookings.findMany({
    where: and(eq(schema.bookings.status, "completed")),
    orderBy: (b, { desc }) => [desc(b.updatedAt)],
    limit: 50,
  });
  return rows
    .filter((b) => b.rating !== null)
    .slice(0, limit)
    .map((b) => ({
      id: b.id,
      trip: `${b.fromLocation} → ${b.toLocation}`,
      driver: b.rating ?? 0,
      service: b.rating ?? 0,
      comment: b.ratingComment ?? "",
      at: (b.updatedAt ?? b.createdAt).toISOString(),
    }));
}
