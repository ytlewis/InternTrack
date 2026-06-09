import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Briefcase,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  GraduationCap,
  Users,
  Building2,
  Star,
  ArrowRight,
  Bell,
} from "lucide-react";

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentDashboard() {
  const { user } = useAuth();
  const { data: applications } = trpc.application.listByStudent.useQuery(
    { studentUserId: user?.id || 0 },
    { enabled: !!user?.id }
  );
  const { data: opportunities } = trpc.opportunity.list.useQuery();
  const { data: notifications } = trpc.notification.listByUser.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const activeApplications = applications?.filter((a) => ["pending", "shortlisted"].includes(a.status)) || [];
  const acceptedApplications = applications?.filter((a) => a.status === "accepted") || [];
  const unreadNotifications = notifications?.filter((n) => !n.isRead) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.name?.split(" ")[0] || "Student"}</p>
        </div>
        <Link to="/student/internships">
          <Button className="gap-2">
            <Briefcase className="w-4 h-4" />
            Browse Internships
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Internships" value={opportunities?.length || 0} icon={<Briefcase className="w-6 h-6" />} color="blue" />
        <StatCard title="Active Applications" value={activeApplications.length} icon={<ClipboardList className="w-6 h-6" />} color="orange" />
        <StatCard title="Placed Internships" value={acceptedApplications.length} icon={<CheckCircle2 className="w-6 h-6" />} color="green" />
        <StatCard title="Notifications" value={unreadNotifications.length} icon={<AlertCircle className="w-6 h-6" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Recent Applications
            </h3>
          </div>
          <CardContent className="p-6">
            {applications && applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{app.opportunity.title}</p>
                      <p className="text-sm text-slate-500">{app.opportunity.employer.companyName}</p>
                    </div>
                    <Badge className={
                      app.status === "accepted" ? "bg-green-100 text-green-700" :
                      app.status === "rejected" ? "bg-red-100 text-red-700" :
                      app.status === "shortlisted" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No applications yet. Start browsing internships!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Recent Notifications
            </h3>
          </div>
          <CardContent className="p-6">
            {notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notif) => (
                  <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-lg ${notif.isRead ? 'bg-slate-50' : 'bg-blue-50'}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${notif.isRead ? 'bg-slate-300' : 'bg-blue-500'}`} />
                    <div>
                      <p className={`text-sm ${notif.isRead ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No notifications yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Problem Solution Info Box */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            How InternTrack Helps You
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { problem: "Manual record-keeping", solution: "Digital application tracking with real-time status updates" },
              { problem: "Communication gaps", solution: "Built-in notifications and feedback system" },
              { problem: "Progress tracking", solution: "Weekly logbook submissions with supervisor feedback" },
              { problem: "Delays", solution: "Streamlined approval workflows and automated reminders" },
            ].map((item) => (
              <div key={item.problem} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.problem}</p>
                  <p className="text-xs text-slate-500">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SupervisorDashboard() {
  const { user } = useAuth();
  const { data: placements } = trpc.placement.listBySupervisor.useQuery(
    { supervisorUserId: user?.id || 0 },
    { enabled: !!user?.id && user?.role === "supervisor" }
  );
  const { data: notifications } = trpc.notification.listByUser.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const activePlacements = placements?.filter((p) => p.status === "active") || [];
  const pendingReports = activePlacements.flatMap((p) => p.reports.filter((r) => r.status === "pending"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Supervisor Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.name || "Supervisor"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Students" value={placements?.length || 0} icon={<GraduationCap className="w-6 h-6" />} color="blue" />
        <StatCard title="Active Placements" value={activePlacements.length} icon={<CheckCircle2 className="w-6 h-6" />} color="green" />
        <StatCard title="Pending Reports" value={pendingReports.length} icon={<Clock className="w-6 h-6" />} color="orange" />
        <StatCard title="Notifications" value={notifications?.filter((n) => !n.isRead).length || 0} icon={<AlertCircle className="w-6 h-6" />} color="purple" />
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            My Supervisees
          </h3>
        </div>
        <CardContent className="p-6">
          {placements && placements.length > 0 ? (
            <div className="space-y-3">
              {placements.map((placement) => (
                <div key={placement.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                      {placement.application.student.user.name?.charAt(0) || "S"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{placement.application.student.user.name}</p>
                      <p className="text-sm text-slate-500">{placement.application.opportunity.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={placement.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                      {placement.status}
                    </Badge>
                    <Link to={`/supervisor/students/${placement.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        View <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No students assigned yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmployerDashboard() {
  const { user } = useAuth();
  const { data: opportunities } = trpc.opportunity.listByEmployer.useQuery(
    { employerUserId: user?.id || 0 },
    { enabled: !!user?.id && user?.role === "employer" }
  );

  const activeOpportunities = opportunities?.filter((o) => o.status === "approved") || [];
  const pendingOpportunities = opportunities?.filter((o) => o.status === "pending") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.name || "Employer"}</p>
        </div>
        <Link to="/employer/opportunities/new">
          <Button className="gap-2">
            <Briefcase className="w-4 h-4" />
            Post Opportunity
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Posts" value={opportunities?.length || 0} icon={<Building2 className="w-6 h-6" />} color="blue" />
        <StatCard title="Active Posts" value={activeOpportunities.length} icon={<CheckCircle2 className="w-6 h-6" />} color="green" />
        <StatCard title="Pending Approval" value={pendingOpportunities.length} icon={<Clock className="w-6 h-6" />} color="orange" />
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            My Opportunities
          </h3>
        </div>
        <CardContent className="p-6">
          {opportunities && opportunities.length > 0 ? (
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{opp.title}</p>
                    <p className="text-sm text-slate-500">{opp.location} · {opp.duration} · {opp.slotsAvailable} slots</p>
                  </div>
                  <Badge className={
                    opp.status === "approved" ? "bg-green-100 text-green-700" :
                    opp.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }>
                    {opp.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No opportunities posted yet.</p>
              <Link to="/employer/opportunities/new">
                <Button variant="outline" className="mt-3">Create your first post</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const { data: stats } = trpc.admin.stats.useQuery();
  const { data: pendingOpportunities } = trpc.opportunity.listAll.useQuery();
  const { data: recentApplications } = trpc.application.list.useQuery();

  const pendingOpps = pendingOpportunities?.filter((o) => o.status === "pending") || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrator Dashboard</h1>
        <p className="text-slate-500">System overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<Users className="w-6 h-6" />} color="blue" />
        <StatCard title="Students" value={stats?.totalStudents || 0} icon={<GraduationCap className="w-6 h-6" />} color="green" />
        <StatCard title="Applications" value={stats?.totalApplications || 0} icon={<ClipboardList className="w-6 h-6" />} color="orange" />
        <StatCard title="Placements" value={stats?.totalPlacements || 0} icon={<CheckCircle2 className="w-6 h-6" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Pending Approvals
            </h3>
            <Badge variant="secondary">{pendingOpps.length} opportunities</Badge>
          </div>
          <CardContent className="p-6">
            {pendingOpps.length > 0 ? (
              <div className="space-y-3">
                {pendingOpps.slice(0, 5).map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{opp.title}</p>
                      <p className="text-sm text-slate-500">{opp.employer.companyName}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">pending</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-300" />
                <p>All caught up! No pending approvals.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Recent Applications
            </h3>
          </div>
          <CardContent className="p-6">
            {recentApplications && recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{app.student.user.name}</p>
                      <p className="text-sm text-slate-500">{app.opportunity.title}</p>
                    </div>
                    <Badge className={
                      app.status === "accepted" ? "bg-green-100 text-green-700" :
                      app.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No applications yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Manage Users", path: "/admin/users", icon: <Users className="w-5 h-5" />, color: "bg-blue-600 hover:bg-blue-700" },
          { label: "Opportunities", path: "/admin/opportunities", icon: <Briefcase className="w-5 h-5" />, color: "bg-green-600 hover:bg-green-700" },
          { label: "Applications", path: "/admin/applications", icon: <ClipboardList className="w-5 h-5" />, color: "bg-purple-600 hover:bg-purple-700" },
          { label: "View Reports", path: "/admin/reports", icon: <Star className="w-5 h-5" />, color: "bg-orange-600 hover:bg-orange-700" },
        ].map((action) => (
          <Link key={action.path} to={action.path}>
            <Button className={`w-full gap-2 ${action.color} text-white`}>
              {action.icon}
              {action.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isStudent, isSupervisor, isEmployer, isAdmin } = useAuth();

  if (isStudent) return <StudentDashboard />;
  if (isSupervisor) return <SupervisorDashboard />;
  if (isEmployer) return <EmployerDashboard />;
  if (isAdmin) return <AdminDashboard />;

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Loading dashboard...</p>
    </div>
  );
}
