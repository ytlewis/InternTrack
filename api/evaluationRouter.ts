import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import {
  findEvaluationsByPlacement,
  findEvaluationsByEvaluator,
  findEvaluationById,
  createEvaluation,
  deleteEvaluation,
} from "./queries/evaluations";

export const evaluationRouter = createRouter({
  listByPlacement: authedQuery
    .input(z.object({ placementId: z.number() }))
    .query(async ({ input }) => {
      return findEvaluationsByPlacement(input.placementId);
    }),

  listByEvaluator: authedQuery
    .input(
      z.object({
        evaluatorId: z.number(),
        evaluatorRole: z.enum(["supervisor", "employer"]),
      })
    )
    .query(async ({ input }) => {
      return findEvaluationsByEvaluator(input.evaluatorId, input.evaluatorRole);
    }),

  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findEvaluationById(input.id);
    }),

  create: authedQuery
    .input(
      z.object({
        placementId: z.number(),
        evaluatorRole: z.enum(["supervisor", "employer"]),
        evaluatorId: z.number(),
        rating: z.number().min(1).max(5),
        comments: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createEvaluation({
        placementId: input.placementId,
        evaluatorRole: input.evaluatorRole,
        evaluatorId: input.evaluatorId,
        rating: input.rating,
        comments: input.comments,
      });
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteEvaluation(input.id);
    }),
});
