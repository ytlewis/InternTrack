import { getDb } from "./connection";
import { evaluations } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findEvaluationsByPlacement(placementId: number) {
  return getDb().query.evaluations.findMany({
    where: eq(evaluations.placementId, placementId),
    orderBy: [desc(evaluations.submittedAt)],
  });
}

export async function findEvaluationsByEvaluator(evaluatorId: number, _evaluatorRole: "supervisor" | "employer") {
  return getDb().query.evaluations.findMany({
    where: eq(evaluations.evaluatorId, evaluatorId),
    orderBy: [desc(evaluations.submittedAt)],
  });
}

export async function findEvaluationById(id: number) {
  return getDb().query.evaluations.findFirst({
    where: eq(evaluations.id, id),
  });
}

export async function createEvaluation(data: {
  placementId: number;
  evaluatorRole: "supervisor" | "employer";
  evaluatorId: number;
  rating: number;
  comments?: string;
}) {
  const [{ id }] = await getDb()
    .insert(evaluations)
    .values({
      placementId: data.placementId,
      evaluatorRole: data.evaluatorRole,
      evaluatorId: data.evaluatorId,
      rating: data.rating,
      comments: data.comments ?? null,
    })
    .$returningId();
  return findEvaluationById(id);
}

export async function deleteEvaluation(id: number) {
  await getDb().delete(evaluations).where(eq(evaluations.id, id));
  return { success: true };
}
