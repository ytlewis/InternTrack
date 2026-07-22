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
import { findStudentProfileByUserId, findEmployerProfileByUserId } from "./queries/users";
import { findOpportunityById } from "./queries/opportunities";
import { getDb } from "./queries/connection";
import { applications, internshipOpportunities } from "@db/schema";
import { eq, desc, inArray } from "drizzle-orm";

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

  listByEmployer: authedQuery.query(async ({ ctx }) => {
    try {
      const employerProfile = await findEmployerProfileByUserId(ctx.user.id);
      if (!employerProfile) return [];
      
      // Get all opportunities by this employer
      const opportunities = await getDb().query.internshipOpportunities.findMany({
        where: eq(internshipOpportunities.employerId, employerProfile.id),
      });
      
      if (opportunities.length === 0) return [];
      
      const opportunityIds = opportunities.map(o => o.id);
      
      // Get all applications for these opportunities
      const apps = await getDb().query.applications.findMany({
        where: inArray(applications.opportunityId, opportunityIds),
        orderBy: [desc(applications.appliedAt)],
      });
      
      if (apps.length === 0) return [];
      
      // Manually fetch related data
      const students = await getDb().query.studentProfiles.findMany();
      const allOpportunities = await getDb().query.internshipOpportunities.findMany();
      const allUsers = await getDb().query.users.findMany();
      
      // Combine data manually
      return apps.map(app => {
        const student = students.find(s => s.id === app.studentId);
        const studentUser = student ? allUsers.find(u => u.id === student.userId) : null;
        const opportunity = allOpportunities.find(o => o.id === app.opportunityId);
        
        return {
          ...app,
          student: student ? {
            ...student,
            user: studentUser || { id: 0, name: null, email: null },
          } : null,
          opportunity: opportunity || null,
        };
      });
    } catch (err) {
      console.error("[application.listByEmployer] ERROR:", err);
      return [];
    }
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
      try {
        console.log("[application.create] User ID:", ctx.user.id);
        console.log("[application.create] User role:", ctx.user.role);
        console.log("[application.create] Input:", input);
        
        const studentProfile = await findStudentProfileByUserId(ctx.user.id);
        console.log("[application.create] Student profile:", studentProfile);
        
        if (!studentProfile) {
          console.error("[application.create] ERROR: Student profile not found for user:", ctx.user.id);
          throw new Error("Student profile not found. Please complete your profile setup.");
        }
        
        console.log("[application.create] Looking for opportunity:", input.opportunityId);
        const opportunity = await findOpportunityById(input.opportunityId);
        console.log("[application.create] Opportunity:", opportunity);
        
        if (!opportunity) {
          console.error("[application.create] ERROR: Opportunity not found:", input.opportunityId);
          throw new Error("Opportunity not found");
        }
        
        if (opportunity.status !== "approved") {
          console.error("[application.create] ERROR: Opportunity not approved:", opportunity.status);
          throw new Error("This opportunity is not available for applications");
        }
        
        console.log("[application.create] Creating application with studentId:", studentProfile.id);
        const result = await createApplication({
          studentId: studentProfile.id,
          opportunityId: input.opportunityId,
          coverLetter: input.coverLetter,
          resumeUrl: input.resumeUrl,
          transcriptUrl: input.transcriptUrl,
        });
        
        console.log("[application.create] Success! Created application:", result?.id);
        return result;
      } catch (err) {
        console.error("[application.create] ERROR:", err);
        throw err;
      }
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
