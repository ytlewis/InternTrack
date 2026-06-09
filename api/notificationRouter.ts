import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import {
  findNotificationsByUser,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "./queries/notifications";

export const notificationRouter = createRouter({
  listByUser: authedQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return findNotificationsByUser(input.userId);
    }),

  create: adminQuery
    .input(
      z.object({
        userId: z.number(),
        message: z.string().min(1),
        type: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createNotification({
        userId: input.userId,
        message: input.message,
        type: input.type,
      });
    }),

  markRead: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return markNotificationAsRead(input.id);
    }),

  markAllRead: authedQuery
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return markAllNotificationsAsRead(input.userId);
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteNotification(input.id);
    }),
});
