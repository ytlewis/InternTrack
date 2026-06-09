import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import {
  findAllApplications,
  findApplicationsByStudent,
  findApplicationsByOpportunity,
  findApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "./queries/applications";
import { findStudentProfileByUserId } from "./queries/users";
import { findOpportunityById } from "./queries/opportunities";

export const applicationRouter = createRouter({
  list: adminQuery.query(async () => {
    return findAllApplications();
  }),

  listByStudent: authedQuery
    .input(z.object({ studentUserId: z.number() }))
    .query(async ({ input }) => {
      const profile = await findStudentProfileByUserId(input.studentUserId);
      if (!profile) return [];
      return findApplicationsByStudent(profile.id);
    }),

  listByOpportunity: authedQuery
    .input(z.object({ opportunityId: z.number() }))
    .query(async ({ input }) => {
      return findApplicationsByOpportunity(input.opportunityId);
    }),

  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findApplicationById(input.id);
    }),

  create: authedQuery
    .input(
      z.object({
        opportunityId: z.number(),
        coverLetter: z.string().optional(),
        resumeUrl: z.string().optional(),
        transcriptUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const studentProfile = await findStudentProfileByUserId(ctx.user.id);
      if (!studentProfile) {
        throw new Error("Student profile not found");
      }
      const opportunity = await findOpportunityById(input.opportunityId);
      if (!opportunity || opportunity.status !== "approved") {
        throw new Error("Opportunity not found or not approved");
      }
      return createApplication({
        studentId: studentProfile.id,
        opportunityId: input.opportunityId,
        coverLetter: input.coverLetter,
        resumeUrl: input.resumeUrl,
        transcriptUrl: input.transcriptUrl,
      });
    }),

  updateStatus: authedQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "shortlisted", "accepted", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      return updateApplicationStatus(input.id, input.status);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteApplication(input.id);
    }),
});
