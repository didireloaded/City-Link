import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { ProfilePreferences, SavedPassenger, SavedRoute } from "@db/schema";
import { getDb } from "./connection";

const DEFAULT_PREFERENCES: ProfilePreferences = {
  notifications: true,
  promoEmails: false,
  language: "en",
  smsReminders: true,
};

function generateReferralCode(name?: string | null) {
  const base = (name || "GUEST")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 8)
    .toUpperCase();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-${base}${suffix}`;
}

export async function getOrCreateProfile(userId: number, name?: string | null) {
  const db = getDb();
  const existing = await db.query.profiles.findFirst({
    where: eq(schema.profiles.userId, userId),
  });
  if (existing) return existing;

  await db.insert(schema.profiles).values({
    userId,
    phone: "",
    walletBalanceNad: 150,
    loyaltyPoints: 120,
    referralCode: generateReferralCode(name),
    referralsCount: 0,
    savedPassengers: [] as SavedPassenger[],
    savedRoutes: [
      { from: "Windhoek", to: "Hosea Kutako International Airport" },
      { from: "Windhoek", to: "Swakopmund" },
    ] as SavedRoute[],
    preferences: DEFAULT_PREFERENCES,
  });

  const created = await db.query.profiles.findFirst({
    where: eq(schema.profiles.userId, userId),
  });
  if (!created) throw new Error("Failed to create profile");
  return created;
}

export type ProfileUpdate = Partial<{
  phone: string;
  walletBalanceNad: number;
  loyaltyPoints: number;
  referralsCount: number;
  savedPassengers: SavedPassenger[];
  savedRoutes: SavedRoute[];
  preferences: ProfilePreferences;
}>;

export async function updateProfile(userId: number, data: ProfileUpdate) {
  await getDb()
    .update(schema.profiles)
    .set(data)
    .where(eq(schema.profiles.userId, userId));
  return getDb().query.profiles.findFirst({
    where: eq(schema.profiles.userId, userId),
  });
}

export async function adjustWallet(userId: number, deltaNad: number) {
  const profile = await getOrCreateProfile(userId);
  const next = Math.max(0, profile.walletBalanceNad + deltaNad);
  await getDb()
    .update(schema.profiles)
    .set({ walletBalanceNad: next })
    .where(eq(schema.profiles.userId, userId));
  return next;
}

/** Atomically debit the wallet. Returns false when the balance is insufficient. */
export async function debitWallet(userId: number, amountNad: number) {
  const profile = await getOrCreateProfile(userId);
  if (profile.walletBalanceNad < amountNad) return false;
  await getDb()
    .update(schema.profiles)
    .set({ walletBalanceNad: profile.walletBalanceNad - amountNad })
    .where(eq(schema.profiles.userId, userId));
  return true;
}
