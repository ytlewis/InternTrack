import { getDb } from "./connection";
import { notifications } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findNotificationsByUser(userId: number) {
  return getDb().query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
  });
}

export async function findUnreadNotificationsByUser(userId: number) {
  return getDb().query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
  });
}

export async function createNotification(data: {
  userId: number;
  message: string;
  type?: string;
}) {
  const result = await getDb()
    .insert(notifications)
    .values({
      userId: data.userId,
      message: data.message,
      type: data.type ?? "info",
      isRead: false,
    });
  const insertId = Number(result[0].insertId);
  return getDb().query.notifications.findFirst({
    where: eq(notifications.id, insertId),
  });
}

export async function markNotificationAsRead(id: number) {
  await getDb()
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, id));
  return getDb().query.notifications.findFirst({
    where: eq(notifications.id, id),
  });
}

export async function markAllNotificationsAsRead(userId: number) {
  await getDb()
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId));
  return { success: true };
}

export async function deleteNotification(id: number) {
  await getDb().delete(notifications).where(eq(notifications.id, id));
  return { success: true };
}
