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
import { getDb } from "./queries/connection";
import { internshipOpportunities } from "@db/schema";
import { eq } from "drizzle-orm";

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
      try {
        console.log("[opportunity.create] User ID:", ctx.user.id);
        console.log("[opportunity.create] User role:", ctx.user.role);
        console.log("[opportunity.create] Input:", input);
        
        const employerProfile = await findEmployerProfileByUserId(ctx.user.id);
        console.log("[opportunity.create] Employer profile:", employerProfile);
        
        if (!employerProfile) {
          console.error("[opportunity.create] ERROR: Employer profile not found for user:", ctx.user.id);
          throw new Error("Employer profile not found");
        }
        
        console.log("[opportunity.create] Creating opportunity with employerId:", employerProfile.id);
        const result = await createOpportunity({
          employerId: employerProfile.id,
          title: input.title,
          description: input.description,
          requirements: input.requirements,
          location: input.location,
          duration: input.duration,
          slotsAvailable: input.slotsAvailable,
        });
        
        console.log("[opportunity.create] Success! Created opportunity:", result?.id);
        return result;
      } catch (err) {
        console.error("[opportunity.create] ERROR:", err);
        throw err;
      }
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

  deleteByEmployer: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("[opportunity.deleteByEmployer] User ID:", ctx.user.id);
        console.log("[opportunity.deleteByEmployer] Opportunity ID:", input.id);
        
        // Verify employer owns this opportunity
        const employerProfile = await findEmployerProfileByUserId(ctx.user.id);
        console.log("[opportunity.deleteByEmployer] Employer profile:", employerProfile);
        
        if (!employerProfile) {
          throw new Error("Employer profile not found");
        }
        
        // Get opportunity without nested relations to avoid LATERAL join issue in MariaDB
        const opportunity = await getDb().query.internshipOpportunities.findFirst({
          where: eq(internshipOpportunities.id, input.id),
        });
        console.log("[opportunity.deleteByEmployer] Opportunity:", opportunity);
        
        if (!opportunity) {
          throw new Error("Opportunity not found");
        }
        
        if (opportunity.employerId !== employerProfile.id) {
          console.error("[opportunity.deleteByEmployer] Ownership mismatch:", {
            opportunityEmployerId: opportunity.employerId,
            profileId: employerProfile.id,
          });
          throw new Error("You can only delete your own opportunities");
        }
        
        console.log("[opportunity.deleteByEmployer] Deleting opportunity...");
        const result = await deleteOpportunity(input.id);
        console.log("[opportunity.deleteByEmployer] Delete result:", result);
        
        return result;
      } catch (err) {
        console.error("[opportunity.deleteByEmployer] ERROR:", err);
        throw err;
      }
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteOpportunity(input.id);
    }),
});
