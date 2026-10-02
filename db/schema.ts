import type { SavedPlace } from "../contracts/places";
import {
  mysqlTable,
  mysqlEnum,
  serial,
  bigint,
  boolean,
  double,
  int,
  json,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here. See docs/Database.md for schema examples and patterns.
//
// Example:
// export const posts = mysqlTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()

/* ------------------------------------------------------------------ */
/* City Link domain tables                                            */
/* ------------------------------------------------------------------ */

export type SavedPassenger = {
  id: string;
  name: string;
  phone: string;
  relation: string;
  idNumber?: string;
};

export type SavedRoute = { from: string; to: string };

export type ProfilePreferences = {
  savedPlaces?: SavedPlace[];
  notifications: boolean;
  promoEmails: boolean;
  language: "en" | "af" | "osh";
  smsReminders?: boolean;
};

export const profiles = mysqlTable("profiles", {
  userId: bigint("userId", { mode: "number", unsigned: true })
    .primaryKey()
    .references(() => users.id),
  phone: varchar("phone", { length: 32 }),
  walletBalanceNad: int("walletBalanceNad").notNull().default(150),
  loyaltyPoints: int("loyaltyPoints").notNull().default(0),
  referralCode: varchar("referralCode", { length: 32 }).notNull(),
  referralsCount: int("referralsCount").notNull().default(0),
  savedPassengers: json("savedPassengers").$type<SavedPassenger[]>(),
  savedRoutes: json("savedRoutes").$type<SavedRoute[]>(),
  preferences: json("preferences").$type<ProfilePreferences>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ProfileRow = typeof profiles.$inferSelect;

export const BOOKING_STATUSES = [
  "held",
  "confirmed",
  "dispatched",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  reference: varchar("reference", { length: 20 }).notNull().unique(),
  tripId: varchar("tripId", { length: 64 }),
  service: varchar("service", { length: 64 }).notNull().default("City Transfer"),
  vehicle: varchar("vehicle", { length: 128 }).notNull().default("Sedan"),
  fromLocation: varchar("fromLocation", { length: 255 }).notNull(),
  toLocation: varchar("toLocation", { length: 255 }).notNull(),
  pickup: varchar("pickup", { length: 255 }),
  dropoff: varchar("dropoff", { length: 255 }),
  travelDate: varchar("travelDate", { length: 10 }).notNull(),
  pickupTime: varchar("pickupTime", { length: 5 }).notNull().default("08:00"),
  passengers: int("passengers").notNull().default(1),
  seats: json("seats").$type<string[]>(),
  passengerName: varchar("passengerName", { length: 255 }).notNull(),
  passengerPhone: varchar("passengerPhone", { length: 64 }).notNull(),
  passengerEmail: varchar("passengerEmail", { length: 320 }),
  passengerType: varchar("passengerType", { length: 32 }).notNull().default("regular"),
  luggage: int("luggage").notNull().default(0),
  childSeat: boolean("childSeat").notNull().default(false),
  flightNumber: varchar("flightNumber", { length: 32 }),
  notes: text("notes"),
  amountNad: int("amountNad").notNull().default(0),
  paymentMethod: varchar("paymentMethod", { length: 32 }),
  status: mysqlEnum("status", BOOKING_STATUSES).notNull().default("confirmed"),
  heldUntil: timestamp("heldUntil"),
  driverName: varchar("driverName", { length: 255 }),
  driverPhone: varchar("driverPhone", { length: 32 }),
  driverVehicle: varchar("driverVehicle", { length: 255 }),
  rating: int("rating"),
  ratingComment: text("ratingComment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Booking = typeof bookings.$inferSelect;

export const PARCEL_STATUSES = [
  "booked",
  "dropped_off",
  "in_transit",
  "arrived",
  "ready_for_collection",
  "collected",
  "expired",
  "cancelled",
] as const;
export type ParcelStatus = (typeof PARCEL_STATUSES)[number];

export const parcels = mysqlTable("parcels", {
  id: serial("id").primaryKey(),
  trackingCode: varchar("trackingCode", { length: 20 }).notNull().unique(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(
    () => users.id,
  ),
  senderName: varchar("senderName", { length: 255 }).notNull(),
  senderPhone: varchar("senderPhone", { length: 64 }).notNull(),
  receiverName: varchar("receiverName", { length: 255 }).notNull(),
  receiverPhone: varchar("receiverPhone", { length: 64 }).notNull(),
  originOffice: varchar("originOffice", { length: 255 }).notNull(),
  destinationOffice: varchar("destinationOffice", { length: 255 }).notNull(),
  size: varchar("size", { length: 16 }).notNull().default("small"),
  weightKg: double("weightKg").notNull().default(1),
  description: text("description"),
  declaredValueNad: int("declaredValueNad"),
  priceNad: int("priceNad").notNull().default(80),
  status: mysqlEnum("status", PARCEL_STATUSES).notNull().default("booked"),
  currentLocation: varchar("currentLocation", { length: 255 }),
  receiverConfirmedAt: timestamp("receiverConfirmedAt"),
  senderConfirmedAt: timestamp("senderConfirmedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Parcel = typeof parcels.$inferSelect;

export const parcelEvents = mysqlTable("parcel_events", {
  id: serial("id").primaryKey(),
  parcelId: bigint("parcelId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => parcels.id),
  status: varchar("status", { length: 32 }).notNull(),
  location: varchar("location", { length: 255 }),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ParcelEvent = typeof parcelEvents.$inferSelect;

export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  type: varchar("type", { length: 32 }).notNull().default("info"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
