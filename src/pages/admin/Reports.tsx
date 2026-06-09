import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  ClipboardList,
  CheckCircle2,
  Download,
} from "lucide-react";

export default function AdminReports() {
  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery();
  trpc.admin.listStudents.useQuery();
  const { data: placements } = trpc.placement.list.useQuery();

  const exportCSV = () => {
    if (!placements) return;

    const headers = ["Student Name", "Student ID", "Program", "Opportunity", "Company", "Supervisor", "Status", "Start Date", "End Date", "Reports Submitted", "Reports Approved"];
    const rows = placements.map((p) => [
      p.application.student.user.name || "",
      p.application.student.studentId || "",
      p.application.student.program || "",
      p.application.opportunity.title || "",
      p.application.opportunity.employer.companyName || "",
      p.supervisor?.user.name || "Unassigned",
      p.status,
      p.startDate ? new Date(p.startDate).toLocaleDateString() : "",
      p.endDate ? new Date(p.endDate).toLocaleDateString() : "",
      p.reports.length.toString(),
      p.reports.filter((r) => r.status === "approved").length.toString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interntrack-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500">System-wide analytics and data export</p>
        </div>
        <Button onClick={exportCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {statsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                    <p className="text-sm text-slate-500">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
                    <p className="text-sm text-slate-500">Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalEmployers}</p>
                    <p className="text-sm text-slate-500">Employers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalPlacements}</p>
                    <p className="text-sm text-slate-500">Placements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalOpportunities}</p>
                    <p className="text-sm text-slate-500">Total Opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalApplications}</p>
                    <p className="text-sm text-slate-500">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.pendingApprovals}</p>
                    <p className="text-sm text-slate-500">Pending Approvals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Placements Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Placements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left p-4 text-sm font-medium text-slate-700">Student</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-700">Internship</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-700">Supervisor</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-700">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-700">Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placements && placements.length > 0 ? (
                      placements.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-slate-50">
                          <td className="p-4">
                            <p className="font-medium text-slate-900 text-sm">{p.application.student.user.name}</p>
                            <p className="text-xs text-slate-500">{p.application.student.studentId}</p>
                          </td>
                          <td className="p-4 text-sm text-slate-700">{p.application.opportunity.title}</td>
                          <td className="p-4 text-sm text-slate-600">{p.supervisor?.user.name || "—"}</td>
                          <td className="p-4">
                            <Badge className={p.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-slate-500">
                            {p.reports.filter((r) => r.status === "approved").length}/{p.reports.length} approved
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No placements yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">No data available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
