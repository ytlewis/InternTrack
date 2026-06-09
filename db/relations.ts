import { relations } from "drizzle-orm";
import {
  users,
  studentProfiles,
  supervisorProfiles,
  employerProfiles,
  internshipOpportunities,
  applications,
  placements,
  reports,
  evaluations,
  notifications,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles),
  supervisorProfile: one(supervisorProfiles),
  employerProfile: one(employerProfiles),
  notifications: many(notifications),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one, many }) => ({
  user: one(users, { fields: [studentProfiles.userId], references: [users.id] }),
  applications: many(applications),
}));

export const supervisorProfilesRelations = relations(supervisorProfiles, ({ one, many }) => ({
  user: one(users, { fields: [supervisorProfiles.userId], references: [users.id] }),
  placements: many(placements),
}));

export const employerProfilesRelations = relations(employerProfiles, ({ one, many }) => ({
  user: one(users, { fields: [employerProfiles.userId], references: [users.id] }),
  opportunities: many(internshipOpportunities),
}));

export const internshipOpportunitiesRelations = relations(internshipOpportunities, ({ one, many }) => ({
  employer: one(employerProfiles, { fields: [internshipOpportunities.employerId], references: [employerProfiles.id] }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  student: one(studentProfiles, { fields: [applications.studentId], references: [studentProfiles.id] }),
  opportunity: one(internshipOpportunities, { fields: [applications.opportunityId], references: [internshipOpportunities.id] }),
  placement: one(placements, { fields: [applications.id], references: [placements.applicationId] }),
}));

export const placementsRelations = relations(placements, ({ one, many }) => ({
  application: one(applications, { fields: [placements.applicationId], references: [applications.id] }),
  supervisor: one(supervisorProfiles, { fields: [placements.supervisorId], references: [supervisorProfiles.id] }),
  reports: many(reports),
  evaluations: many(evaluations),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  placement: one(placements, { fields: [reports.placementId], references: [placements.id] }),
}));

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  placement: one(placements, { fields: [evaluations.placementId], references: [placements.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));
