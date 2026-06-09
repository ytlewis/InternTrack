import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Users,
  ArrowRight,
  Clock,
  BookOpen,
} from "lucide-react";

export default function SupervisorStudents() {
  const { user } = useAuth();

  const { data: placements, isLoading } = trpc.placement.listBySupervisor.useQuery(
    { supervisorUserId: user?.id || 0 },
    { enabled: !!user?.id && user?.role === "supervisor" }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Students</h1>
        <p className="text-slate-500">View and manage your assigned internship students</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : placements && placements.length > 0 ? (
        <div className="grid gap-4">
          {placements.map((placement) => {
            const pendingReports = placement.reports.filter((r) => r.status === "pending").length;
            return (
              <Card key={placement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                        {placement.application.student.user.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {placement.application.student.user.name}
                        </h3>
                        <p className="text-sm text-slate-500">{placement.application.student.studentId}</p>
                        <p className="text-sm text-slate-600">{placement.application.opportunity.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {placement.reports.length} reports
                          </span>
                          {pendingReports > 0 && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Clock className="w-3.5 h-3.5" />
                              {pendingReports} pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={placement.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                        {placement.status}
                      </Badge>
                      <Link to={`/supervisor/students/${placement.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Details <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Students Assigned</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              You don&apos;t have any students assigned yet. The administrator will assign students to you.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
