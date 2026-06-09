import { getDb } from "./connection";
import { placements } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findAllPlacements() {
  return getDb().query.placements.findMany({
    with: {
      application: {
        with: {
          student: { with: { user: true } },
          opportunity: { with: { employer: { with: { user: true } } } },
        },
      },
      supervisor: { with: { user: true } },
      reports: true,
      evaluations: true,
    },
    orderBy: [desc(placements.createdAt)],
  });
}

export async function findPlacementsBySupervisor(supervisorProfileId: number) {
  return getDb().query.placements.findMany({
    where: eq(placements.supervisorId, supervisorProfileId),
    with: {
      application: {
        with: {
          student: { with: { user: true } },
          opportunity: { with: { employer: { with: { user: true } } } },
        },
      },
      supervisor: { with: { user: true } },
      reports: true,
      evaluations: true,
    },
    orderBy: [desc(placements.createdAt)],
  });
}

export async function findPlacementById(id: number) {
  return getDb().query.placements.findFirst({
    where: eq(placements.id, id),
    with: {
      application: {
        with: {
          student: { with: { user: true } },
          opportunity: { with: { employer: { with: { user: true } } } },
        },
      },
      supervisor: { with: { user: true } },
      reports: true,
      evaluations: true,
    },
  });
}

export async function createPlacement(data: {
  applicationId: number;
  supervisorId?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const [{ id }] = await getDb()
    .insert(placements)
    .values({
      applicationId: data.applicationId,
      supervisorId: data.supervisorId ?? null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      status: "active",
    })
    .$returningId();
  return findPlacementById(id);
}

export async function updatePlacementStatus(id: number, status: "active" | "completed") {
  await getDb()
    .update(placements)
    .set({ status })
    .where(eq(placements.id, id));
  return findPlacementById(id);
}
