import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import MainLayout from "./components/layout/MainLayout";
import RoleGuard from "./components/layout/RoleGuard";

// Student pages
import StudentInternships from "./pages/student/Internships";
import StudentApplications from "./pages/student/Applications";
import StudentReports from "./pages/student/Reports";
import StudentFeedback from "./pages/student/Feedback";

// Supervisor pages
import SupervisorStudents from "./pages/supervisor/Students";
import SupervisorStudentDetail from "./pages/supervisor/StudentDetail";
import SupervisorEvaluations from "./pages/supervisor/Evaluations";

// Employer pages
import EmployerOpportunities from "./pages/employer/Opportunities";
import EmployerNewOpportunity from "./pages/employer/NewOpportunity";
import EmployerApplications from "./pages/employer/Applications";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminOpportunities from "./pages/admin/Opportunities";
import AdminApplications from "./pages/admin/Applications";
import AdminReports from "./pages/admin/Reports";
import AdminPlacements from "./pages/admin/Placements";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />

                {/* Student Routes */}
                <Route
                  path="/student/internships"
                  element={
                    <RoleGuard allowedRoles={["student"]}>
                      <StudentInternships />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/student/applications"
                  element={
                    <RoleGuard allowedRoles={["student"]}>
                      <StudentApplications />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/student/reports"
                  element={
                    <RoleGuard allowedRoles={["student"]}>
                      <StudentReports />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/student/feedback"
                  element={
                    <RoleGuard allowedRoles={["student"]}>
                      <StudentFeedback />
                    </RoleGuard>
                  }
                />

                {/* Supervisor Routes */}
                <Route
                  path="/supervisor/students"
                  element={
                    <RoleGuard allowedRoles={["supervisor"]}>
                      <SupervisorStudents />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/supervisor/students/:id"
                  element={
                    <RoleGuard allowedRoles={["supervisor"]}>
                      <SupervisorStudentDetail />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/supervisor/evaluations"
                  element={
                    <RoleGuard allowedRoles={["supervisor"]}>
                      <SupervisorEvaluations />
                    </RoleGuard>
                  }
                />

                {/* Employer Routes */}
                <Route
                  path="/employer/opportunities"
                  element={
                    <RoleGuard allowedRoles={["employer"]}>
                      <EmployerOpportunities />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employer/opportunities/new"
                  element={
                    <RoleGuard allowedRoles={["employer"]}>
                      <EmployerNewOpportunity />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employer/applications"
                  element={
                    <RoleGuard allowedRoles={["employer"]}>
                      <EmployerApplications />
                    </RoleGuard>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminUsers />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/opportunities"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminOpportunities />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/applications"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminApplications />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminReports />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/placements"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminPlacements />
                    </RoleGuard>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
