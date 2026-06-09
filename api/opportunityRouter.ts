import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import {
  findAllOpportunities,
  findApprovedOpportunities,
  findOpportunitiesByEmployer,
  findOpportunityById,
  createOpportunity,
  updateOpportunityStatus,
  deleteOpportunity,
} from "./queries/opportunities";
import { findEmployerProfileByUserId } from "./queries/users";

export const opportunityRouter = createRouter({
  list: publicQuery.query(async () => {
    return findApprovedOpportunities();
  }),

  listAll: adminQuery.query(async () => {
    return findAllOpportunities();
  }),

  listByEmployer: authedQuery
    .input(z.object({ employerUserId: z.number() }))
    .query(async ({ input }) => {
      return findOpportunitiesByEmployer(input.employerUserId);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findOpportunityById(input.id);
    }),

  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        requirements: z.string().optional(),
        location: z.string().optional(),
        duration: z.string().optional(),
        slotsAvailable: z.number().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const employerProfile = await findEmployerProfileByUserId(ctx.user.id);
      if (!employerProfile) {
        throw new Error("Employer profile not found");
      }
      return createOpportunity({
        employerId: employerProfile.id,
        title: input.title,
        description: input.description,
        requirements: input.requirements,
        location: input.location,
        duration: input.duration,
        slotsAvailable: input.slotsAvailable,
      });
    }),

  approve: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return updateOpportunityStatus(input.id, "approved");
    }),

  reject: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return updateOpportunityStatus(input.id, "rejected");
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteOpportunity(input.id);
    }),
});
