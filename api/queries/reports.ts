import { getDb } from "./connection";
import { reports } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findReportsByPlacement(placementId: number) {
  return getDb().query.reports.findMany({
    where: eq(reports.placementId, placementId),
    orderBy: [desc(reports.submittedAt)],
  });
}

export async function findReportById(id: number) {
  return getDb().query.reports.findFirst({
    where: eq(reports.id, id),
  });
}

export async function createReport(data: {
  placementId: number;
  weekNumber?: number;
  title: string;
  content: string;
  fileUrl?: string;
}) {
  const result = await getDb()
    .insert(reports)
    .values({
      placementId: data.placementId,
      weekNumber: data.weekNumber ?? null,
      title: data.title,
      content: data.content,
      fileUrl: data.fileUrl ?? null,
      status: "pending",
    });
  const insertId = Number(result[0].insertId);
  return findReportById(insertId);
}

export async function updateReportFeedback(id: number, feedback: string, status: "pending" | "approved" | "rejected") {
  await getDb()
    .update(reports)
    .set({ feedback, status })
    .where(eq(reports.id, id));
  return findReportById(id);
}

export async function deleteReport(id: number) {
  await getDb().delete(reports).where(eq(reports.id, id));
  return { success: true };
}
