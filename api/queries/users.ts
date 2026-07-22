import { getDb } from "./connection";
import { users, studentProfiles, supervisorProfiles, employerProfiles } from "@db/schema";
import { eq } from "drizzle-orm";

export async function upsertUser(data: {
  unionId: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  lastSignInAt?: Date;
}) {
  const existing = await findUserByUnionId(data.unionId);
  if (existing) {
    await getDb()
      .update(users)
      .set({
        name: data.name ?? existing.name,
        email: data.email ?? existing.email,
        avatar: data.avatar ?? existing.avatar,
        lastSignInAt: data.lastSignInAt ?? new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));
    return findUserByUnionId(data.unionId);
  }
  const result = await getDb()
    .insert(users)
    .values({
      unionId: data.unionId,
      name: data.name ?? null,
      email: data.email ?? null,
      avatar: data.avatar ?? null,
      lastSignInAt: data.lastSignInAt ?? new Date(),
    });
  const insertId = Number(result[0].insertId);
  return findUserById(insertId);
}

export async function findUserByUnionId(unionId: string) {
  return getDb().query.users.findFirst({
    where: eq(users.unionId, unionId),
  });
}

export async function findUserById(id: number) {
  return getDb().query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function findUserByEmail(email: string) {
  return getDb().query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function findAllUsers() {
  return getDb().query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });
}

export async function createUser(data: {
  unionId: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: "student" | "supervisor" | "employer" | "admin";
}) {
  const result = await getDb()
    .insert(users)
    .values({
      unionId: data.unionId,
      name: data.name ?? null,
      email: data.email ?? null,
      avatar: data.avatar ?? null,
      role: data.role ?? "student",
    });
  const insertId = Number(result[0].insertId);
  return findUserById(insertId);
}

export async function updateUserRole(userId: number, role: string) {
  await getDb()
    .update(users)
    .set({ role: role as "student" | "supervisor" | "employer" | "admin" })
    .where(eq(users.id, userId));
  return findUserById(userId);
}

export async function approveUser(userId: number) {
  await getDb()
    .update(users)
    .set({ isApproved: true })
    .where(eq(users.id, userId));
  return findUserById(userId);
}

export async function findStudentProfileByUserId(userId: number) {
  return getDb().query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId),
  });
}

export async function findSupervisorProfileByUserId(userId: number) {
  return getDb().query.supervisorProfiles.findFirst({
    where: eq(supervisorProfiles.userId, userId),
  });
}

export async function findEmployerProfileByUserId(userId: number) {
  try {
    return await getDb().query.employerProfiles.findFirst({
      where: eq(employerProfiles.userId, userId),
    });
  } catch (dbErr) {
    // Fallback to in-memory store
    try {
      const { employerProfileStore } = await import("../auth-router");
      return employerProfileStore.get(userId);
    } catch {
      return undefined;
    }
  }
}

export async function createStudentProfile(data: {
  userId: number;
  studentId: string;
  program: string;
  yearOfStudy: number;
  phone?: string;
  institution?: string;
}) {
  const result = await getDb().insert(studentProfiles).values({
    userId: data.userId,
    studentId: data.studentId,
    program: data.program,
    yearOfStudy: data.yearOfStudy,
    phone: data.phone ?? null,
    institution: data.institution ?? null,
  });
  const insertId = Number(result[0].insertId);
  return getDb().query.studentProfiles.findFirst({
    where: eq(studentProfiles.id, insertId),
  });
}

export async function createSupervisorProfile(data: {
  userId: number;
  department: string;
  phone?: string;
  specialization?: string;
}) {
  const result = await getDb().insert(supervisorProfiles).values({
    userId: data.userId,
    department: data.department,
    phone: data.phone ?? null,
    specialization: data.specialization ?? null,
  });
  const insertId = Number(result[0].insertId);
  return getDb().query.supervisorProfiles.findFirst({
    where: eq(supervisorProfiles.id, insertId),
  });
}

export async function createEmployerProfile(data: {
  userId: number;
  companyName: string;
  companyAddress?: string;
  contactPerson?: string;
  phone?: string;
  industry?: string;
}) {
  const result = await getDb().insert(employerProfiles).values({
    userId: data.userId,
    companyName: data.companyName,
    companyAddress: data.companyAddress ?? null,
    contactPerson: data.contactPerson ?? null,
    phone: data.phone ?? null,
    industry: data.industry ?? null,
  });
  const insertId = Number(result[0].insertId);
  return getDb().query.employerProfiles.findFirst({
    where: eq(employerProfiles.id, insertId),
  });
}

export async function findAllStudents() {
  return getDb().query.studentProfiles.findMany({
    with: { user: true },
  });
}

export async function findAllSupervisors() {
  return getDb().query.supervisorProfiles.findMany({
    with: { user: true },
  });
}

export async function findAllEmployers() {
  return getDb().query.employerProfiles.findMany({
    with: { user: true },
  });
}
