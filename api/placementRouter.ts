import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import {
  findAllPlacements,
  findPlacementsBySupervisor,
  findPlacementById,
  createPlacement,
  updatePlacementStatus,
} from "./queries/placements";
import { findSupervisorProfileByUserId } from "./queries/users";

export const placementRouter = createRouter({
  list: adminQuery.query(async () => {
    return findAllPlacements();
  }),

  listBySupervisor: authedQuery
    .input(z.object({ supervisorUserId: z.number() }))
    .query(async ({ input }) => {
      const profile = await findSupervisorProfileByUserId(input.supervisorUserId);
      if (!profile) return [];
      return findPlacementsBySupervisor(profile.id);
    }),

  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findPlacementById(input.id);
    }),

  create: adminQuery
    .input(
      z.object({
        applicationId: z.number(),
        supervisorId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createPlacement({
        applicationId: input.applicationId,
        supervisorId: input.supervisorId,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      });
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["active", "completed"]),
      })
    )
    .mutation(async ({ input }) => {
      return updatePlacementStatus(input.id, input.status);
    }),
});
