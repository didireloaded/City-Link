import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { PARCEL_STATUSES } from "@db/schema";
import {
  addParcelEvent,
  calcParcelPrice,
  confirmHandover,
  createParcel,
  getParcelWithEvents,
  listParcelsByUser,
} from "./queries/parcels";

function maskParcel<T extends { senderName: string; senderPhone: string; receiverName: string; receiverPhone: string }>(
  parcel: T,
) {
  return {
    ...parcel,
    senderName: "Confidential · Privacy Protected",
    senderPhone: "081 ••• ••••",
    receiverName: "Verified City Link Client",
    receiverPhone: "081 ••• ••••",
  };
}

export const parcelRouter = createRouter({
  quote: publicQuery
    .input(z.object({ weightKg: z.number().positive().max(500) }))
    .query(({ input }) => ({ priceNad: calcParcelPrice(input.weightKg) })),

  track: publicQuery
    .input(z.object({ code: z.string().min(3).max(20) }))
    .query(async ({ input, ctx }) => {
      const found = await getParcelWithEvents(input.code);
      if (!found) return null;
      const isOwner = ctx.user && found.parcel.userId === ctx.user.id;
      return {
        parcel: isOwner ? found.parcel : maskParcel(found.parcel),
        events: found.events,
        isOwner: Boolean(isOwner),
      };
    }),

  listMine: authedQuery.query(async ({ ctx }) => {
    return listParcelsByUser(ctx.user.id);
  }),

  create: authedQuery
    .input(
      z.object({
        senderName: z.string().min(2).max(255),
        senderPhone: z.string().min(5).max(64),
        receiverName: z.string().min(2).max(255),
        receiverPhone: z.string().min(5).max(64),
        originOffice: z.string().min(2).max(255),
        destinationOffice: z.string().min(2).max(255),
        size: z.enum(["small", "medium", "large"]),
        weightKg: z.number().positive().max(500),
        description: z.string().max(2000).nullish(),
        declaredValueNad: z.number().int().nonnegative().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return createParcel({ ...input, userId: ctx.user.id });
    }),

  logEvent: authedQuery
    .input(
      z.object({
        code: z.string().min(3).max(20),
        status: z.enum(PARCEL_STATUSES),
        location: z.string().max(255).optional(),
        note: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const found = await getParcelWithEvents(input.code);
      if (!found || found.parcel.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Parcel not found." });
      }
      return addParcelEvent({
        trackingCode: input.code,
        status: input.status,
        location: input.location,
        note: input.note,
      });
    }),

  confirmHandover: authedQuery
    .input(
      z.object({
        code: z.string().min(3).max(20),
        role: z.enum(["sender", "receiver"]),
      }),
    )
    .mutation(async ({ input }) => {
      const found = await getParcelWithEvents(input.code);
      if (!found) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Parcel not found." });
      }
      return confirmHandover({ trackingCode: input.code, role: input.role });
    }),
});
