import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import {
  findAllUsers,
  updateUserRole,
  approveUser,
  findAllStudents,
  findAllSupervisors,
  findAllEmployers,
} from "./queries/users";
import { findAllOpportunities } from "./queries/opportunities";
import { findAllApplications } from "./queries/applications";
import { findAllPlacements, findPlacementsByStudentId, updatePlacementSupervisor } from "./queries/placements";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const [usersList, students, supervisors, employers, opportunities, applications, placements] =
      await Promise.all([
        findAllUsers(),
        findAllStudents(),
        findAllSupervisors(),
        findAllEmployers(),
        findAllOpportunities(),
        findAllApplications(),
        findAllPlacements(),
      ]);

    return {
      totalUsers: usersList.length,
      totalStudents: students.length,
      totalSupervisors: supervisors.length,
      totalEmployers: employers.length,
      totalOpportunities: opportunities.length,
      totalApplications: applications.length,
      totalPlacements: placements.length,
      pendingApprovals: applications.filter((a) => a.status === "pending").length,
      pendingOpportunities: opportunities.filter((o) => o.status === "pending").length,
    };
  }),

  listUsers: adminQuery.query(async () => {
    return findAllUsers();
  }),

  listStudents: adminQuery.query(async () => {
    return findAllStudents();
  }),

  listSupervisors: adminQuery.query(async () => {
    return findAllSupervisors();
  }),

  listEmployers: adminQuery.query(async () => {
    return findAllEmployers();
  }),

  updateRole: adminQuery
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["student", "supervisor", "employer", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      return updateUserRole(input.userId, input.role);
    }),

  approveUser: adminQuery
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return approveUser(input.userId);
    }),

  listPlacements: adminQuery.query(async () => {
    return findAllPlacements();
  }),

  listStudentPlacements: adminQuery
    .input(z.object({ studentProfileId: z.number() }))
    .query(async ({ input }) => {
      return findPlacementsByStudentId(input.studentProfileId);
    }),

  assignSupervisor: adminQuery
    .input(
      z.object({
        placementId: z.number(),
        supervisorId: z.number().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      return updatePlacementSupervisor(input.placementId, input.supervisorId);
    }),
});
