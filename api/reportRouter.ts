import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import {
  findReportsByPlacement,
  findReportById,
  createReport,
  updateReportFeedback,
  deleteReport,
} from "./queries/reports";

export const reportRouter = createRouter({
  listByPlacement: authedQuery
    .input(z.object({ placementId: z.number() }))
    .query(async ({ input }) => {
      return findReportsByPlacement(input.placementId);
    }),

  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findReportById(input.id);
    }),

  create: authedQuery
    .input(
      z.object({
        placementId: z.number(),
        weekNumber: z.number().optional(),
        title: z.string().min(1),
        content: z.string().min(1),
        fileUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createReport({
        placementId: input.placementId,
        weekNumber: input.weekNumber,
        title: input.title,
        content: input.content,
        fileUrl: input.fileUrl,
      });
    }),

  feedback: authedQuery
    .input(
      z.object({
        id: z.number(),
        feedback: z.string(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      return updateReportFeedback(input.id, input.feedback, input.status);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteReport(input.id);
    }),
});
