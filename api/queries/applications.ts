import { getDb } from "./connection";
import { applications, internshipOpportunities, employerProfiles, users, placements, studentProfiles } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findAllApplications() {
  // Get applications without nested relations
  const apps = await getDb().query.applications.findMany({
    orderBy: [desc(applications.appliedAt)],
  });
  
  if (apps.length === 0) return [];
  
  // Manually fetch related data
  const studentIds = [...new Set(apps.map(a => a.studentId))];
  const opportunityIds = [...new Set(apps.map(a => a.opportunityId))];
  
  const students = await getDb().query.studentProfiles.findMany();
  const opportunities = await getDb().query.internshipOpportunities.findMany();
  const employers = await getDb().query.employerProfiles.findMany();
  const users = await getDb().query.users.findMany();
  
  // Combine data manually
  return apps.map(app => {
    const student = students.find(s => s.id === app.studentId);
    const studentUser = student ? users.find(u => u.id === student.userId) : null;
    const opportunity = opportunities.find(o => o.id === app.opportunityId);
    const employer = opportunity ? employers.find(e => e.id === opportunity.employerId) : null;
    const employerUser = employer ? users.find(u => u.id === employer.userId) : null;
    
    return {
      ...app,
      student: student ? {
        ...student,
        user: studentUser || null,
      } : null,
      opportunity: opportunity ? {
        ...opportunity,
        employer: employer ? {
          ...employer,
          user: employerUser || null,
        } : null,
      } : null,
    };
  });
}

export async function findApplicationsByStudent(studentProfileId: number) {
  // Get applications without nested relations
  const apps = await getDb().query.applications.findMany({
    where: eq(applications.studentId, studentProfileId),
    orderBy: [desc(applications.appliedAt)],
  });
  
  if (apps.length === 0) return [];
  
  // Manually fetch related data
  const opportunityIds = [...new Set(apps.map(a => a.opportunityId))];
  const opportunities = await getDb().query.internshipOpportunities.findMany();
  const employerIds = [...new Set(opportunities.map(o => o.employerId))];
  const employers = await getDb().query.employerProfiles.findMany();
  const users = await getDb().query.users.findMany();
  const placements = await getDb().query.placements.findMany();
  
  // Combine data manually
  return apps.map(app => {
    const opportunity = opportunities.find(o => o.id === app.opportunityId);
    const employer = opportunity ? employers.find(e => e.id === opportunity.employerId) : null;
    const user = employer ? users.find(u => u.id === employer.userId) : null;
    const placement = placements.find(p => p.applicationId === app.id);
    
    return {
      ...app,
      opportunity: opportunity ? {
        ...opportunity,
        employer: employer ? {
          ...employer,
          user: user || null,
        } : null,
      } : null,
      placement: placement || null,
    };
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
  try {
    console.log("[createApplication] Starting with data:", data);
    
    const result = await getDb()
      .insert(applications)
      .values({
        studentId: data.studentId,
        opportunityId: data.opportunityId,
        coverLetter: data.coverLetter ?? null,
        resumeUrl: data.resumeUrl ?? null,
        transcriptUrl: data.transcriptUrl ?? null,
        status: "pending",
      });
    
    console.log("[createApplication] Insert result:", result);
    
    // For MariaDB/MySQL, get the last inserted ID
    const insertId = Number(result[0].insertId);
    console.log("[createApplication] Insert ID:", insertId);
    
    // Return simple application without nested relations to avoid LATERAL join
    const application = await getDb().query.applications.findFirst({
      where: eq(applications.id, insertId),
    });
    
    console.log("[createApplication] Retrieved application:", application);
    return application;
  } catch (err) {
    console.error("[createApplication] ERROR:", err);
    throw err;
  }
}

export async function updateApplicationStatus(id: number, status: "pending" | "shortlisted" | "accepted" | "rejected") {
  try {
    console.log("[updateApplicationStatus] Updating application:", id, "to status:", status);
    
    await getDb()
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id));
    
    console.log("[updateApplicationStatus] Update successful");
    
    // Return simple application without nested relations to avoid LATERAL join
    const application = await getDb().query.applications.findFirst({
      where: eq(applications.id, id),
    });
    
    console.log("[updateApplicationStatus] Retrieved updated application:", application);
    return application;
  } catch (err) {
    console.error("[updateApplicationStatus] ERROR:", err);
    throw err;
  }
}

export async function deleteApplication(id: number) {
  await getDb().delete(applications).where(eq(applications.id, id));
  return { success: true };
}
