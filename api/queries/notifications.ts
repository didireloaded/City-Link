import { and, eq, isNull } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createNotification(data: {
  userId: number;
  title: string;
  body?: string;
  type?: string;
}) {
  await getDb().insert(schema.notifications).values({
    userId: data.userId,
    title: data.title,
    body: data.body,
    type: data.type ?? "info",
  });
}

export async function listNotificationsByUser(userId: number) {
  return getDb().query.notifications.findMany({
    where: eq(schema.notifications.userId, userId),
    orderBy: (n, { desc }) => [desc(n.createdAt)],
    limit: 100,
  });
}

export async function markNotificationRead(userId: number, id: number) {
  await getDb()
    .update(schema.notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(schema.notifications.id, id),
        eq(schema.notifications.userId, userId),
      ),
    );
  return listNotificationsByUser(userId);
}

export async function markAllNotificationsRead(userId: number) {
  await getDb()
    .update(schema.notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(schema.notifications.userId, userId),
        isNull(schema.notifications.readAt),
      ),
    );
  return listNotificationsByUser(userId);
}
