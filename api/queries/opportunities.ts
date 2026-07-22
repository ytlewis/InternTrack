import { getDb } from "./connection";
import { internshipOpportunities, employerProfiles, users } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findAllOpportunities() {
  // Fetch opportunities without nested relations to avoid LATERAL join in MariaDB
  const opportunities = await getDb().query.internshipOpportunities.findMany({
    orderBy: [desc(internshipOpportunities.createdAt)],
  });
  
  // Manually fetch employer data if needed
  const employerIds = [...new Set(opportunities.map(o => o.employerId))];
  const employers = await getDb().query.employerProfiles.findMany({
    where: employerIds.length > 0 ? 
      employerProfiles.id in employerIds.map(id => id) : undefined,
  });
  
  const userIds = [...new Set(employers.map(e => e.userId))];
  const users = await getDb().query.users.findMany({
    where: userIds.length > 0 ? 
      users.id in userIds.map(id => id) : undefined,
  });
  
  // Combine data manually
  return opportunities.map(opp => {
    const employer = employers.find(e => e.id === opp.employerId);
    const user = employer ? users.find(u => u.id === employer.userId) : null;
    return {
      ...opp,
      employer: employer ? {
        ...employer,
        user: user || null,
      } : null,
    };
  });
}

export async function findApprovedOpportunities() {
  // Fetch approved opportunities without nested relations
  const opportunities = await getDb().query.internshipOpportunities.findMany({
    where: eq(internshipOpportunities.status, "approved"),
    orderBy: [desc(internshipOpportunities.createdAt)],
  });
  
  if (opportunities.length === 0) return [];
  
  // Manually fetch employer data
  const employerIds = [...new Set(opportunities.map(o => o.employerId))];
  const employers = await getDb().query.employerProfiles.findMany();
  
  const userIds = [...new Set(employers.map(e => e.userId))];
  const users = await getDb().query.users.findMany();
  
  // Combine data manually
  return opportunities.map(opp => {
    const employer = employers.find(e => e.id === opp.employerId);
    const user = employer ? users.find(u => u.id === employer.userId) : null;
    return {
      ...opp,
      employer: employer ? {
        ...employer,
        user: user || null,
      } : null,
    };
  });
}

export async function findOpportunitiesByEmployer(employerUserId: number) {
  const employerProfile = await getDb().query.employerProfiles.findFirst({
    where: eq(employerProfiles.userId, employerUserId),
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
  try {
    console.log("[createOpportunity] Starting with data:", data);
    
    const result = await getDb()
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
      });
    
    console.log("[createOpportunity] Insert result:", result);
    
    // For MariaDB/MySQL, get the last inserted ID
    const insertId = Number(result[0].insertId);
    console.log("[createOpportunity] Insert ID:", insertId);
    
    // Return simple opportunity without nested relations to avoid LATERAL join issues in MariaDB
    const opportunity = await getDb().query.internshipOpportunities.findFirst({
      where: eq(internshipOpportunities.id, insertId),
    });
    console.log("[createOpportunity] Retrieved opportunity:", opportunity);
    
    return opportunity;
  } catch (err) {
    console.error("[createOpportunity] ERROR:", err);
    throw err;
  }
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
