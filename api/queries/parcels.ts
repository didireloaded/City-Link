import { asc, eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { ParcelStatus } from "@db/schema";
import { getDb } from "./connection";
import { createNotification } from "./notifications";

export function calcParcelPrice(weightKg: number): number {
  return Math.max(50, Math.round(weightKg) * 8 + 50);
}

export function generateTrackingCode() {
  return `CP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function getParcelWithEvents(trackingCode: string) {
  const db = getDb();
  const code = trackingCode.trim().toUpperCase();
  const parcel = await db.query.parcels.findFirst({
    where: eq(schema.parcels.trackingCode, code),
  });
  if (!parcel) return null;
  const events = await db
    .select()
    .from(schema.parcelEvents)
    .where(eq(schema.parcelEvents.parcelId, parcel.id))
    .orderBy(asc(schema.parcelEvents.createdAt));
  return { parcel, events };
}

export async function listParcelsByUser(userId: number) {
  const db = getDb();
  const owned = await db.query.parcels.findMany({
    where: eq(schema.parcels.userId, userId),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit: 100,
  });
  const withEvents = await Promise.all(
    owned.map(async (parcel) => {
      const events = await db
        .select()
        .from(schema.parcelEvents)
        .where(eq(schema.parcelEvents.parcelId, parcel.id))
        .orderBy(asc(schema.parcelEvents.createdAt));
      return { parcel, events };
    }),
  );
  return withEvents;
}

export type NewParcel = {
  userId: number;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  originOffice: string;
  destinationOffice: string;
  size: string;
  weightKg: number;
  description?: string | null;
  declaredValueNad?: number | null;
};

export async function createParcel(data: NewParcel) {
  const db = getDb();
  const trackingCode = generateTrackingCode();
  const priceNad = calcParcelPrice(data.weightKg);

  const [{ id }] = await db
    .insert(schema.parcels)
    .values({
      trackingCode,
      userId: data.userId,
      senderName: data.senderName,
      senderPhone: data.senderPhone,
      receiverName: data.receiverName,
      receiverPhone: data.receiverPhone,
      originOffice: data.originOffice,
      destinationOffice: data.destinationOffice,
      size: data.size,
      weightKg: data.weightKg,
      description: data.description ?? null,
      declaredValueNad: data.declaredValueNad ?? null,
      priceNad,
      status: "booked",
      currentLocation: data.originOffice,
    })
    .$returningId();

  await db.insert(schema.parcelEvents).values({
    parcelId: id,
    status: "booked",
    location: data.originOffice,
    note: "Parcel registered on City Link system",
  });

  await createNotification({
    userId: data.userId,
    title: `Parcel ${trackingCode} booked`,
    body: `${data.originOffice} → ${data.destinationOffice}. Drop off at the origin terminal counter. Price N$${priceNad}.`,
    type: "parcel",
  });

  return getParcelWithEvents(trackingCode);
}

export async function addParcelEvent(data: {
  trackingCode: string;
  status: ParcelStatus;
  location?: string;
  note?: string;
}) {
  const db = getDb();
  const found = await getParcelWithEvents(data.trackingCode);
  if (!found) return null;
  await db.insert(schema.parcelEvents).values({
    parcelId: found.parcel.id,
    status: data.status,
    location: data.location ?? found.parcel.currentLocation,
    note: data.note ?? `Status: ${data.status}`,
  });
  await db
    .update(schema.parcels)
    .set({
      status: data.status,
      currentLocation: data.location ?? found.parcel.currentLocation,
    })
    .where(eq(schema.parcels.id, found.parcel.id));
  return getParcelWithEvents(data.trackingCode);
}

export async function confirmHandover(data: {
  trackingCode: string;
  role: "sender" | "receiver";
}) {
  const db = getDb();
  const found = await getParcelWithEvents(data.trackingCode);
  if (!found) return null;

  const patch: Record<string, unknown> = {};
  if (data.role === "receiver") {
    patch.receiverConfirmedAt = new Date();
    patch.status = "collected" satisfies ParcelStatus;
  } else {
    patch.senderConfirmedAt = new Date();
  }
  await db.update(schema.parcels).set(patch).where(eq(schema.parcels.id, found.parcel.id));

  await db.insert(schema.parcelEvents).values({
    parcelId: found.parcel.id,
    status: data.role === "receiver" ? "collected" : found.parcel.status,
    location: found.parcel.currentLocation,
    note:
      data.role === "receiver"
        ? "Receiver confirmed handover"
        : "Sender confirmed handover",
  });

  return getParcelWithEvents(data.trackingCode);
}
