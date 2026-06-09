import { getDb } from "./connection";
import { internshipOpportunities } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findAllOpportunities() {
  return getDb().query.internshipOpportunities.findMany({
    with: { employer: { with: { user: true } } },
    orderBy: [desc(internshipOpportunities.createdAt)],
  });
}

export async function findApprovedOpportunities() {
  return getDb().query.internshipOpportunities.findMany({
    where: eq(internshipOpportunities.status, "approved"),
    with: { employer: { with: { user: true } } },
    orderBy: [desc(internshipOpportunities.createdAt)],
  });
}

export async function findOpportunitiesByEmployer(employerUserId: number) {
  const employerProfile = await getDb().query.employerProfiles.findFirst({
    where: eq(internshipOpportunities.employerId, employerUserId),
  });
  if (!employerProfile) return [];

  return getDb().query.internshipOpportunities.findMany({
    where: eq(internshipOpportunities.employerId, employerProfile.id),
    orderBy: [desc(internshipOpportunities.createdAt)],
  });
}

export async function findOpportunityById(id: number) {
  return getDb().query.internshipOpportunities.findFirst({
    where: eq(internshipOpportunities.id, id),
    with: { employer: { with: { user: true } } },
  });
}

export async function createOpportunity(data: {
  employerId: number;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  duration?: string;
  slotsAvailable?: number;
}) {
  const [{ id }] = await getDb()
    .insert(internshipOpportunities)
    .values({
      employerId: data.employerId,
      title: data.title,
      description: data.description,
      requirements: data.requirements ?? null,
      location: data.location ?? null,
      duration: data.duration ?? null,
      slotsAvailable: data.slotsAvailable ?? 1,
      status: "pending",
    })
    .$returningId();
  return findOpportunityById(id);
}

export async function updateOpportunityStatus(id: number, status: "pending" | "approved" | "rejected") {
  await getDb()
    .update(internshipOpportunities)
    .set({ status })
    .where(eq(internshipOpportunities.id, id));
  return findOpportunityById(id);
}

export async function deleteOpportunity(id: number) {
  await getDb().delete(internshipOpportunities).where(eq(internshipOpportunities.id, id));
  return { success: true };
}
