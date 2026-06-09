import { getDb } from "./connection";
import { applications } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findAllApplications() {
  return getDb().query.applications.findMany({
    with: {
      student: { with: { user: true } },
      opportunity: { with: { employer: { with: { user: true } } } },
    },
    orderBy: [desc(applications.appliedAt)],
  });
}

export async function findApplicationsByStudent(studentProfileId: number) {
  return getDb().query.applications.findMany({
    where: eq(applications.studentId, studentProfileId),
    with: {
      opportunity: { with: { employer: { with: { user: true } } } },
      placement: true,
    },
    orderBy: [desc(applications.appliedAt)],
  });
}

export async function findApplicationsByOpportunity(opportunityId: number) {
  return getDb().query.applications.findMany({
    where: eq(applications.opportunityId, opportunityId),
    with: {
      student: { with: { user: true } },
    },
    orderBy: [desc(applications.appliedAt)],
  });
}

export async function findApplicationById(id: number) {
  return getDb().query.applications.findFirst({
    where: eq(applications.id, id),
    with: {
      student: { with: { user: true } },
      opportunity: { with: { employer: { with: { user: true } } } },
    },
  });
}

export async function createApplication(data: {
  studentId: number;
  opportunityId: number;
  coverLetter?: string;
  resumeUrl?: string;
  transcriptUrl?: string;
}) {
  const [{ id }] = await getDb()
    .insert(applications)
    .values({
      studentId: data.studentId,
      opportunityId: data.opportunityId,
      coverLetter: data.coverLetter ?? null,
      resumeUrl: data.resumeUrl ?? null,
      transcriptUrl: data.transcriptUrl ?? null,
      status: "pending",
    })
    .$returningId();
  return findApplicationById(id);
}

export async function updateApplicationStatus(id: number, status: "pending" | "shortlisted" | "accepted" | "rejected") {
  await getDb()
    .update(applications)
    .set({ status })
    .where(eq(applications.id, id));
  return findApplicationById(id);
}

export async function deleteApplication(id: number) {
  await getDb().delete(applications).where(eq(applications.id, id));
  return { success: true };
}
