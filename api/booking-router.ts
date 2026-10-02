import { validateSchedule, windhoekTime } from "../contracts/booking-time";
import { recentDestinations } from "../contracts/places";
import { getDb } from "./queries/connection";
import { bookings } from "../db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import {
  cancelBooking,
  createBooking,
  findBookingByReference,
  getTakenSeats,
  holdSeat,
  listBookingsByUser,
  rateBooking,
  recentReviews,
} from "./queries/bookings";
import { VEHICLE_CATEGORIES, createTransferOptions } from "../src/data/trips";
import { inferService, serviceDefaults } from "../src/lib/transfer-service";
import { adjustWallet, debitWallet } from "./queries/profiles";

export const bookingRouter = createRouter({
  availability: authedQuery
    .input(z.object({ tripId: z.string().min(1), travelDate: z.string().min(8) }))
    .query(async ({ input }) => {
      const taken = await getTakenSeats(input.tripId, input.travelDate);
      return { taken };
    }),

  holdSeat: authedQuery
    .input(
      z.object({
        tripId: z.string().min(1),
        travelDate: z.string().min(8),
        seatNumber: z.string().min(2).max(4),
        passengerName: z.string().min(2),
        passengerType: z.string().default("regular"),
        priceNad: z.number().int().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await holdSeat({ ...input, userId: ctx.user.id });
      if (result.conflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That seat was just taken by another passenger.",
        });
      }
      return result;
    }),

  create: authedQuery
    .input(
      z.object({
        tripId: z.string().nullish(),
        service: z.enum(["Airport", "City", "Lodge", "Safari", "Executive", "Staff"]),
        vehicle: z.string().min(2).max(128),
        fromLocation: z.string().min(1).max(255),
        toLocation: z.string().min(1).max(255),
        pickup: z.string().max(255).nullish(),
        dropoff: z.string().max(255).nullish(),
        timing: z.enum(["now", "scheduled"]).default("scheduled"),
        travelDate: z.string().min(8).max(10),
        pickupTime: z.string().min(4).max(5),
        passengers: z.number().int().min(1).max(50),
        seats: z.array(z.string()).max(50).optional(),
        passengerName: z.string().min(2).max(255),
        passengerPhone: z.string().min(5).max(64),
        passengerEmail: z.string().email().max(320).nullish().or(z.literal("")),
        passengerType: z.string().max(32).optional(),
        luggage: z.number().int().min(0).max(20),
        childSeat: z.boolean(),
        flightNumber: z.string().max(32).nullish(),
        notes: z.string().max(2000).nullish(),
        amountNad: z.number().int().nonnegative(),
        paymentMethod: z.string().max(32).nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const error = input.timing === "scheduled" ? validateSchedule(input.travelDate, input.pickupTime) : null;
      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });
      const { timing, ...bookingInput } = input;
      if (timing === "now") { const current = windhoekTime(); bookingInput.travelDate = current.date; bookingInput.pickupTime = current.time; }
      const vehicle = VEHICLE_CATEGORIES.find(item => item.name === input.vehicle);
      const inferred = inferService(input.fromLocation, input.toLocation);
      if (!vehicle || !serviceDefaults[input.service].vehicles.includes(vehicle.id) ||
          input.passengers > vehicle.capacity || input.luggage > vehicle.luggageCapacity ||
          (!["Executive", "Staff"].includes(input.service) && inferred !== input.service)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Vehicle, capacity or route does not match this service." });
      }
      const fare = createTransferOptions(input.fromLocation, input.toLocation, input.pickupTime).find(item => item.bus.id === vehicle.id);
      if (!fare || fare.quoteOnly || input.amountNad !== fare.price) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A valid configured fare is required." });
      }
      if (input.paymentMethod !== "Store Credit Wallet") {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Online payment provider is not connected." });
      }
      if (input.paymentMethod === "Store Credit Wallet") {
        const ok = await debitWallet(ctx.user.id, input.amountNad);
        if (!ok) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Insufficient wallet balance. Please choose another payment method.",
          });
        }
      }
      return createBooking({
        ...bookingInput,
        passengerEmail: input.passengerEmail || null,
        userId: ctx.user.id,
      });
    }),

  recentDestinations: authedQuery.query(async ({ ctx }) => {
    const rows = await getDb().query.bookings.findMany({ where: eq(bookings.userId, ctx.user.id), orderBy: (booking, { desc }) => [desc(booking.createdAt)], limit: 100 });
    return recentDestinations(rows.filter(row => row.status !== "held" && row.status !== "cancelled")).map(row => ({ locality: row.toLocation, address: row.dropoff || row.toLocation }));
  }),

  listMine: authedQuery.query(async ({ ctx }) => {
    return listBookingsByUser(ctx.user.id);
  }),

  trackByReference: authedQuery
    .input(z.object({ reference: z.string().min(3).max(20) }))
    .query(async ({ ctx, input }) => {
      const booking = await findBookingByReference(ctx.user.id, input.reference);
      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Transfer not found." });
      }
      return booking;
    }),

  cancel: authedQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await cancelBooking(ctx.user.id, input.id);
      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
      }
      if (booking.status === "cancelled") {
        await adjustWallet(ctx.user.id, booking.amountNad);
      }
      return booking;
    }),

  rate: authedQuery
    .input(
      z.object({
        id: z.number().int(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await rateBooking(ctx.user.id, input.id, input.rating, input.comment);
      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
      }
      return booking;
    }),

  recentReviews: publicQuery.query(async () => {
    return recentReviews();
  }),
});
