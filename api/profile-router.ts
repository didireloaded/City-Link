import { savedPlacesSchema } from "../contracts/places";
import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { adjustWallet, getOrCreateProfile, updateProfile } from "./queries/profiles";
import { createNotification } from "./queries/notifications";

export const profileRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name);
    const isFresh =
      !profile.phone &&
      (profile.savedPassengers?.length ?? 0) === 0 &&
      Date.now() - new Date(profile.createdAt).getTime() < 60_000;
    if (isFresh) {
      await createNotification({
        userId: ctx.user.id,
        title: "Welcome to City Link",
        body: "Your account is ready. Book transfers and send parcels across Namibia.",
        type: "info",
      });
    }
    return { ...profile, name: ctx.user.name ?? "", email: ctx.user.email ?? "" };
  }),

  update: authedQuery
    .input(
      z.object({
        phone: z.string().max(32).optional(),
        savedPassengers: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              phone: z.string(),
              relation: z.string(),
              idNumber: z.string().optional(),
            }),
          )
          .optional(),
        savedRoutes: z
          .array(z.object({ from: z.string(), to: z.string() }))
          .optional(),
        preferences: z
          .object({
            savedPlaces: savedPlacesSchema.optional(),
            notifications: z.boolean(),
            promoEmails: z.boolean(),
            language: z.enum(["en", "af", "osh"]),
            smsReminders: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateProfile(ctx.user.id, input);
      return getOrCreateProfile(ctx.user.id, ctx.user.name);
    }),

  topUp: authedQuery
    .input(z.object({ amountNad: z.number().int().min(10).max(100000) }))
    .mutation(async ({ ctx, input }) => {
      const balance = await adjustWallet(ctx.user.id, input.amountNad);
      await createNotification({
        userId: ctx.user.id,
        title: `Wallet topped up · N$${input.amountNad}`,
        body: `Your City Link wallet balance is now N$${balance}.`,
        type: "wallet",
      });
      return { balance };
    }),
});
