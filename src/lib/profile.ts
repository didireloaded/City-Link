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
    notifications: boolean;
    promoEmails: boolean;
    language: "en" | "af" | "osh";
    smsReminders?: boolean;
  };
}

const KEY = "citylink_profile";

export const defaultProfile: Profile = {
  name: "Tangeni Shilongo",
  phone: "+264 81 234 5678",
  email: "tangeni.s@na.network",
  walletBalanceNAD: 150,
  loyaltyPoints: 420,
  referralCode: "CITYLINK-TANGENI81",
  referralsCount: 3,
  savedPassengers: [
    { id: "sp-1", name: "Tangeni Shilongo (Self)", phone: "+264 81 234 5678", relation: "Self", idNumber: "94051200381" },
    { id: "sp-2", name: "Nangula Shilongo (Wife)", phone: "+264 81 444 9911", relation: "Spouse", idNumber: "96081100221" },
    { id: "sp-3", name: "Johanna Shilongo (Mother)", phone: "+264 81 333 1188", relation: "Parent", idNumber: "65010100881" },
  ],
  savedRoutes: [
    { from: "Windhoek", to: "Oshakati" },
    { from: "Windhoek", to: "Walvis Bay" },
    { from: "Ondangwa", to: "Windhoek" },
  ],
  preferences: { notifications: true, promoEmails: false, language: "en", smsReminders: true },
};

export const loadProfile = (): Profile => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!saved) return defaultProfile;
    return {
      ...defaultProfile,
      ...saved,
      walletBalanceNAD: saved.walletBalanceNAD ?? defaultProfile.walletBalanceNAD,
      loyaltyPoints: saved.loyaltyPoints ?? defaultProfile.loyaltyPoints,
      referralCode: saved.referralCode ?? defaultProfile.referralCode,
      referralsCount: saved.referralsCount ?? defaultProfile.referralsCount,
      savedPassengers: saved.savedPassengers ?? defaultProfile.savedPassengers,
      savedRoutes: saved.savedRoutes ?? defaultProfile.savedRoutes,
      preferences: { ...defaultProfile.preferences!, ...(saved.preferences || {}) },
    };
  } catch {
    return defaultProfile;
  }
};

export const saveProfile = (p: Profile) => {
  localStorage.setItem(KEY, JSON.stringify(p));
};

export const clearProfile = () => {
  localStorage.removeItem(KEY);
};
