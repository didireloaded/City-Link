import { useMemo } from "react";
import { trpc } from "@/providers/trpc";
import { defaultProfile, type Profile } from "@/lib/profile";

type ProfileUpdate = Partial<{
  phone: string;
  savedPassengers: NonNullable<Profile["savedPassengers"]>;
  savedRoutes: NonNullable<Profile["savedRoutes"]>;
  preferences: NonNullable<Profile["preferences"]>;
}>;

/**
 * Server-backed profile hook. Returns the merged Profile view model the
 * existing UI expects, plus an async `save` that persists to the database.
 */
export function useProfile() {
  const utils = trpc.useUtils();
  const query = trpc.profile.get.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });

  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => utils.profile.get.invalidate(),
  });

  const profile: Profile = useMemo(() => {
    const data = query.data;
    if (!data) return defaultProfile;
    return {
      name: data.name || defaultProfile.name,
      email: data.email || "",
      phone: data.phone ?? "",
      walletBalanceNAD: data.walletBalanceNad,
      loyaltyPoints: data.loyaltyPoints,
      referralCode: data.referralCode,
      referralsCount: data.referralsCount,
      savedPassengers: data.savedPassengers ?? [],
      savedRoutes: data.savedRoutes ?? [],
      preferences: {
        ...defaultProfile.preferences!,
        ...(data.preferences ?? {}),
      },
    };
  }, [query.data]);

  const save = async (update: ProfileUpdate) => {
    await updateMutation.mutateAsync(update);
  };

  return {
    profile,
    isLoading: query.isLoading,
    save,
    isSaving: updateMutation.isPending,
    refresh: () => utils.profile.get.invalidate(),
  };
}
