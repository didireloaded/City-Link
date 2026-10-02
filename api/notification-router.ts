import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  listNotificationsByUser,
  markAllNotificationsRead,
  markNotificationRead,
} from "./queries/notifications";

export const notificationRouter = createRouter({
  listMine: authedQuery.query(({ ctx }) => listNotificationsByUser(ctx.user.id)),

  markRead: authedQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(({ ctx, input }) => markNotificationRead(ctx.user.id, input.id)),

  markAllRead: authedQuery.mutation(({ ctx }) =>
    markAllNotificationsRead(ctx.user.id),
  ),
});
