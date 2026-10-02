import { eq } from "drizzle-orm";
import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

/**
 * Seeds two public demo parcels so the tracking page works out of the box.
 * Idempotent: skips any tracking code that already exists.
 */
async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  const demoParcels = [
    {
      trackingCode: "CP-2026-8842",
      senderName: "Ndeshi Amutenya",
      senderPhone: "0811234567",
      receiverName: "Josef Shilongo",
      receiverPhone: "0817654321",
      originOffice: "Ongwediva",
      destinationOffice: "Windhoek",
      size: "small",
      weightKg: 0.5,
      description: "Documents envelope",
      priceNad: 80,
      status: "in_transit" as const,
      currentLocation: "On CL-01, en route to Windhoek",
      events: [
        { status: "booked", location: "Ongwediva office", note: "Booked in terminal", hoursAgo: 24 },
        { status: "dropped_off", location: "Ongwediva office", note: "Received at counter", hoursAgo: 20 },
        { status: "in_transit", location: "On CL-01, en route to Windhoek", note: "Departed Northern terminal on express run", hoursAgo: 1 },
      ],
    },
    {
      trackingCode: "CP-2026-1049",
      senderName: "John Mwafangeyo",
      senderPhone: "0818767676",
      receiverName: "Maria Mwafangeyo",
      receiverPhone: "0815550130",
      originOffice: "Windhoek",
      destinationOffice: "Oshakati",
      size: "medium",
      weightKg: 6.0,
      description: "Care package & electronics",
      priceNad: 130,
      status: "ready_for_collection" as const,
      currentLocation: "Oshakati Ekuku Mall Unit 10",
      events: [
        { status: "dropped_off", location: "Windhoek Bahnhof Street", note: "Received at counter", hoursAgo: 48 },
        { status: "in_transit", location: "On CL-03, en route North", note: "Passed Otjiwarongo checkpoint", hoursAgo: 24 },
        { status: "ready_for_collection", location: "Oshakati Ekuku Mall Unit 10", note: "Ready for collection", hoursAgo: 4 },
      ],
    },
  ];

  for (const demo of demoParcels) {
    const existing = await db.query.parcels.findFirst({
      where: eq(schema.parcels.trackingCode, demo.trackingCode),
    });
    if (existing) {
      console.log(`Skipping ${demo.trackingCode} (already exists)`);
      continue;
    }
    const { events, ...parcelData } = demo;
    const [{ id }] = await db.insert(schema.parcels).values(parcelData).$returningId();
    for (const event of events) {
      await db.insert(schema.parcelEvents).values({
        parcelId: id,
        status: event.status,
        location: event.location,
        note: event.note,
        createdAt: new Date(Date.now() - event.hoursAgo * 3600 * 1000),
      });
    }
    console.log(`Seeded parcel ${demo.trackingCode}`);
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
