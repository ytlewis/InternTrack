import { getDb } from "./connection";
import { placements } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findAllPlacements() {
  // Fetch placements without nested relations to avoid LATERAL join issues in MariaDB
  const placementsList = await getDb().query.placements.findMany({
    orderBy: [desc(placements.createdAt)],
  });
  
  if (placementsList.length === 0) return [];
  
  // For admin stats, we just need the count, so return simple data
  return placementsList;
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
  const result = await getDb()
    .insert(placements)
    .values({
      applicationId: data.applicationId,
      supervisorId: data.supervisorId ?? null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      status: "active",
    });
  const insertId = Number(result[0].insertId);
  return findPlacementById(insertId);
}

export async function updatePlacementStatus(id: number, status: "active" | "completed") {
  await getDb()
    .update(placements)
    .set({ status })
    .where(eq(placements.id, id));
  return findPlacementById(id);
}

export async function updatePlacementSupervisor(placementId: number, supervisorId: number | null) {
  await getDb()
    .update(placements)
    .set({ supervisorId: supervisorId ?? null })
    .where(eq(placements.id, placementId));
  return findPlacementById(placementId);
}

export async function findPlacementsByStudentId(studentProfileId: number) {
  const db = getDb();
  const allPlacements = await db.query.placements.findMany({
    orderBy: [desc(placements.createdAt)],
  });
  
  // Manually filter by student - we need to join with applications
  const applications = await db.query.applications.findMany();
  
  const studentPlacements = allPlacements.filter(placement => {
    const application = applications.find(app => app.id === placement.applicationId);
    return application && application.studentId === studentProfileId;
  });
  
  return studentPlacements;
}
