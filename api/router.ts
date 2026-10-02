import { authRouter } from "./auth-router";
import { bookingRouter } from "./booking-router";
import { notificationRouter } from "./notification-router";
import { parcelRouter } from "./parcel-router";
import { profileRouter } from "./profile-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  profile: profileRouter,
  bookings: bookingRouter,
  parcels: parcelRouter,
  notifications: notificationRouter,
});

export type AppRouter = typeof appRouter;
