import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  boolean,
} from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["student", "supervisor", "employer", "admin"])
    .default("student")
    .notNull(),
  isApproved: boolean("isApproved").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Student Profiles ────────────────────────────────────────────────
export const studentProfiles = mysqlTable("studentProfiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  studentId: varchar("studentId", { length: 50 }).notNull(),
  program: varchar("program", { length: 255 }).notNull(),
  yearOfStudy: int("yearOfStudy").notNull(),
  phone: varchar("phone", { length: 50 }),
  institution: varchar("institution", { length: 255 }),
});

export type StudentProfile = typeof studentProfiles.$inferSelect;

// ─── Supervisor Profiles ─────────────────────────────────────────────
export const supervisorProfiles = mysqlTable("supervisorProfiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  specialization: varchar("specialization", { length: 255 }),
});

export type SupervisorProfile = typeof supervisorProfiles.$inferSelect;

// ─── Employer Profiles ───────────────────────────────────────────────
export const employerProfiles = mysqlTable("employerProfiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyAddress: text("companyAddress"),
  contactPerson: varchar("contactPerson", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  industry: varchar("industry", { length: 255 }),
});

export type EmployerProfile = typeof employerProfiles.$inferSelect;

// ─── Internship Opportunities ────────────────────────────────────────
export const internshipOpportunities = mysqlTable("internshipOpportunities", {
  id: serial("id").primaryKey(),
  employerId: bigint("employerId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  location: varchar("location", { length: 255 }),
  duration: varchar("duration", { length: 100 }),
  slotsAvailable: int("slotsAvailable").default(1).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type InternshipOpportunity = typeof internshipOpportunities.$inferSelect;

// ─── Applications ────────────────────────────────────────────────────
export const applications = mysqlTable("applications", {
  id: serial("id").primaryKey(),
  studentId: bigint("studentId", { mode: "number", unsigned: true }).notNull(),
  opportunityId: bigint("opportunityId", { mode: "number", unsigned: true }).notNull(),
  coverLetter: text("coverLetter"),
  resumeUrl: text("resumeUrl"),
  transcriptUrl: text("transcriptUrl"),
  status: mysqlEnum("status", ["pending", "shortlisted", "accepted", "rejected"])
    .default("pending")
    .notNull(),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Application = typeof applications.$inferSelect;

// ─── Placements ──────────────────────────────────────────────────────
export const placements = mysqlTable("placements", {
  id: serial("id").primaryKey(),
  applicationId: bigint("applicationId", { mode: "number", unsigned: true }).notNull(),
  supervisorId: bigint("supervisorId", { mode: "number", unsigned: true }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["active", "completed"])
    .default("active")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Placement = typeof placements.$inferSelect;

// ─── Reports ─────────────────────────────────────────────────────────
export const reports = mysqlTable("reports", {
  id: serial("id").primaryKey(),
  placementId: bigint("placementId", { mode: "number", unsigned: true }).notNull(),
  weekNumber: int("weekNumber"),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  fileUrl: text("fileUrl"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"])
    .default("pending")
    .notNull(),
  feedback: text("feedback"),
});

export type Report = typeof reports.$inferSelect;

// ─── Evaluations ─────────────────────────────────────────────────────
export const evaluations = mysqlTable("evaluations", {
  id: serial("id").primaryKey(),
  placementId: bigint("placementId", { mode: "number", unsigned: true }).notNull(),
  evaluatorRole: mysqlEnum("evaluatorRole", ["supervisor", "employer"]).notNull(),
  evaluatorId: bigint("evaluatorId", { mode: "number", unsigned: true }).notNull(),
  rating: int("rating").notNull(),
  comments: text("comments"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;

// ─── Notifications ───────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("info").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
