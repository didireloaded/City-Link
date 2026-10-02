import type { SavedPlace } from "../../contracts/places";
/**
 * Profile domain types. Persistence is server-side via the tRPC `profile`
 * router — see src/hooks/useProfile.ts. No localStorage persistence.
 */

export interface Profile {
  name: string;
  phone: string;
  email?: string;
  walletBalanceNAD?: number;
  loyaltyPoints?: number;
  referralCode?: string;
  referralsCount?: number;
  savedPassengers?: {
    id: string;
    name: string;
    phone: string;
    relation: string;
    idNumber?: string;
  }[];
  savedRoutes?: { from: string; to: string }[];
  preferences?: {
    savedPlaces?: SavedPlace[];
    notifications: boolean;
    promoEmails: boolean;
    language: "en" | "af" | "osh";
    smsReminders?: boolean;
  };
}

export const defaultProfile: Profile = {
  name: "Traveler",
  phone: "",
  email: "",
  walletBalanceNAD: 0,
  loyaltyPoints: 0,
  referralCode: "",
  referralsCount: 0,
  savedPassengers: [],
  savedRoutes: [],
  preferences: { notifications: true, promoEmails: false, language: "en", smsReminders: true },
};
