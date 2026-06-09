import { getDb } from "../api/queries/connection";
import { users, studentProfiles, supervisorProfiles, employerProfiles, internshipOpportunities, applications, placements, reports, evaluations, notifications } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Check if already seeded
  const existingUsers = await db.query.users.findMany();
  if (existingUsers.length > 1) {
    console.log("Database already seeded, skipping...");
    return;
  }

  // ─── Create Students ──────────────────────────────────────────────
  const studentUser1 = await db.insert(users).values({
    unionId: "student_001_union",
    name: "John Kamau",
    email: "john.kamau@university.ac.ke",
    role: "student",
    isApproved: true,
  }).$returningId();
  const s1 = await db.query.users.findFirst({ where: eq(users.id, studentUser1[0].id) });

  const studentUser2 = await db.insert(users).values({
    unionId: "student_002_union",
    name: "Mary Ochieng",
    email: "mary.ochieng@university.ac.ke",
    role: "student",
    isApproved: true,
  }).$returningId();
  const s2 = await db.query.users.findFirst({ where: eq(users.id, studentUser2[0].id) });

  await db.insert(studentProfiles).values({
    userId: s1!.id,
    studentId: "SCT202-001",
    program: "BSc Computer Science",
    yearOfStudy: 4,
    phone: "+254712345678",
    institution: "University of Nairobi",
  });

  await db.insert(studentProfiles).values({
    userId: s2!.id,
    studentId: "SCT202-002",
    program: "BSc Software Engineering",
    yearOfStudy: 4,
    phone: "+254723456789",
    institution: "University of Nairobi",
  });

  // ─── Create Supervisor ────────────────────────────────────────────
  const supervisorUser = await db.insert(users).values({
    unionId: "supervisor_001_union",
    name: "Dr. Jane Wanjiku",
    email: "j.wanjiku@university.ac.ke",
    role: "supervisor",
    isApproved: true,
  }).$returningId();
  const sup = await db.query.users.findFirst({ where: eq(users.id, supervisorUser[0].id) });

  const supervisorProfile = await db.insert(supervisorProfiles).values({
    userId: sup!.id,
    department: "School of Computing and Informatics",
    phone: "+254734567890",
    specialization: "Software Engineering",
  }).$returningId();
  const supProf = await db.query.supervisorProfiles.findFirst({ where: eq(supervisorProfiles.id, supervisorProfile[0].id) });

  // ─── Create Employer ──────────────────────────────────────────────
  const employerUser = await db.insert(users).values({
    unionId: "employer_001_union",
    name: "Peter Ndegwa",
    email: "peter.ndegwa@safaricom.co.ke",
    role: "employer",
    isApproved: true,
  }).$returningId();
  const emp = await db.query.users.findFirst({ where: eq(users.id, employerUser[0].id) });

  const employerProfile = await db.insert(employerProfiles).values({
    userId: emp!.id,
    companyName: "Safaricom PLC",
    companyAddress: "Safaricom House, Waiyaki Way, Nairobi",
    contactPerson: "Peter Ndegwa",
    phone: "+254722000000",
    industry: "Telecommunications",
  }).$returningId();
  const empProf = await db.query.employerProfiles.findFirst({ where: eq(employerProfiles.id, employerProfile[0].id) });

  // ─── Create Internship Opportunities ──────────────────────────────
  const opp1 = await db.insert(internshipOpportunities).values({
    employerId: empProf!.id,
    title: "Software Developer Intern",
    description: "Join our engineering team to build and maintain mobile and web applications serving over 30 million customers. You will work with React, Node.js, and cloud technologies.",
    requirements: "Knowledge of JavaScript/TypeScript, React, and Node.js. Understanding of REST APIs and databases. Good problem-solving skills.",
    location: "Nairobi, Kenya",
    duration: "3 months",
    slotsAvailable: 3,
    status: "approved",
  }).$returningId();

  const opp2 = await db.insert(internshipOpportunities).values({
    employerId: empProf!.id,
    title: "Data Analyst Intern",
    description: "Work with our data science team to analyze customer behavior, build dashboards, and generate insights that drive business decisions.",
    requirements: "Knowledge of Python, SQL, and data visualization tools. Basic understanding of statistics and machine learning concepts.",
    location: "Nairobi, Kenya",
    duration: "4 months",
    slotsAvailable: 2,
    status: "approved",
  }).$returningId();

  const opp3 = await db.insert(internshipOpportunities).values({
    employerId: empProf!.id,
    title: "Cybersecurity Intern",
    description: "Assist the security operations team in monitoring network traffic, conducting vulnerability assessments, and implementing security protocols.",
    requirements: "Understanding of network protocols, security frameworks, and penetration testing tools. Knowledge of Linux systems is a plus.",
    location: "Nairobi, Kenya (Hybrid)",
    duration: "3 months",
    slotsAvailable: 1,
    status: "pending",
  }).$returningId();

  // ─── Create Applications ──────────────────────────────────────────
  const studentProfile1 = await db.query.studentProfiles.findFirst({ where: eq(studentProfiles.userId, s1!.id) });
  const studentProfile2 = await db.query.studentProfiles.findFirst({ where: eq(studentProfiles.userId, s2!.id) });

  const app1 = await db.insert(applications).values({
    studentId: studentProfile1!.id,
    opportunityId: opp1[0].id,
    coverLetter: "I am excited to apply for the Software Developer Intern position at Safaricom. With a strong foundation in web development and a passion for building scalable applications, I believe I would be a great fit for your team.",
    status: "accepted",
  }).$returningId();

  const app2 = await db.insert(applications).values({
    studentId: studentProfile2!.id,
    opportunityId: opp2[0].id,
    coverLetter: "As a data enthusiast with strong analytical skills, I am eager to contribute to Safaricom's data-driven initiatives. My experience with Python and SQL makes me well-suited for this role.",
    status: "shortlisted",
  }).$returningId();

  // ─── Create Placement ─────────────────────────────────────────────
  const placement1 = await db.insert(placements).values({
    applicationId: app1[0].id,
    supervisorId: supProf!.id,
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-04-15"),
    status: "active",
  }).$returningId();

  // ─── Create Reports ───────────────────────────────────────────────
  const plc = await db.query.placements.findFirst({ where: eq(placements.id, placement1[0].id) });

  await db.insert(reports).values({
    placementId: plc!.id,
    weekNumber: 1,
    title: "Week 1: Onboarding and Environment Setup",
    content: "This week I completed the onboarding process, set up my development environment, and familiarized myself with the company's codebase. I attended orientation sessions and met with my mentor.",
    status: "approved",
    feedback: "Good start. Keep up the enthusiasm.",
  });

  await db.insert(reports).values({
    placementId: plc!.id,
    weekNumber: 2,
    title: "Week 2: First Feature Implementation",
    content: "I worked on implementing a new user authentication feature using JWT tokens. I collaborated with senior developers and learned about the company's coding standards and review process.",
    status: "approved",
    feedback: "Excellent work on the auth feature. Code quality is high.",
  });

  await db.insert(reports).values({
    placementId: plc!.id,
    weekNumber: 3,
    title: "Week 3: API Integration and Testing",
    content: "This week I focused on integrating third-party APIs and writing comprehensive unit tests. I also participated in daily stand-ups and sprint planning meetings.",
    status: "pending",
  });

  // ─── Create Evaluations ──────────────────────────────────────────
  await db.insert(evaluations).values({
    placementId: plc!.id,
    evaluatorRole: "supervisor",
    evaluatorId: supProf!.id,
    rating: 5,
    comments: "John has shown exceptional growth and dedication. His technical skills are impressive and he integrates well with the team.",
  });

  // ─── Create Notifications ────────────────────────────────────────
  await db.insert(notifications).values({
    userId: s1!.id,
    message: "Your application for Software Developer Intern has been accepted!",
    type: "success",
  });

  await db.insert(notifications).values({
    userId: s1!.id,
    message: "Week 3 report is due in 2 days.",
    type: "warning",
  });

  await db.insert(notifications).values({
    userId: s2!.id,
    message: "Your application for Data Analyst Intern has been shortlisted.",
    type: "info",
  });

  await db.insert(notifications).values({
    userId: sup!.id,
    message: "New report submitted by John Kamau for review.",
    type: "info",
  });

  console.log("Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
