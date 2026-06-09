import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  ClipboardList,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Filter,
} from "lucide-react";

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: "Pending Review", className: "bg-yellow-100 text-yellow-700", icon: <Clock3 className="w-3 h-3" /> },
  shortlisted: { label: "Shortlisted", className: "bg-blue-100 text-blue-700", icon: <Filter className="w-3 h-3" /> },
  accepted: { label: "Accepted", className: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "Not Selected", className: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
};

export default function StudentApplications() {
  const { user } = useAuth();
  const { data: applications, isLoading } = trpc.application.listByStudent.useQuery(
    { studentUserId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const statusOrder = ["accepted", "shortlisted", "pending", "rejected"];
  const sortedApplications = applications?.slice().sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500">Track the status of your internship applications</p>
        </div>
        <Link to="/student/internships">
          <Button variant="outline" className="gap-2">
            <Briefcase className="w-4 h-4" />
            Browse More
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : sortedApplications && sortedApplications.length > 0 ? (
        <div className="grid gap-4">
          {sortedApplications.map((app) => {
            const status = statusConfig[app.status] || statusConfig.pending;
            return (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{app.opportunity.title}</h3>
                        <Badge className={`gap-1 ${status.className}`}>
                          {status.icon}
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Building2 className="w-4 h-4" />
                        <span>{app.opportunity.employer.companyName}</span>
                        <span className="text-slate-300">|</span>
                        <MapPin className="w-4 h-4" />
                        <span>{app.opportunity.location || "Remote"}</span>
                        <span className="text-slate-300">|</span>
                        <Clock className="w-4 h-4" />
                        <span>{app.opportunity.duration}</span>
                      </div>
                      {app.coverLetter && (
                        <div className="bg-slate-50 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-slate-700 mb-1">Your Cover Letter:</p>
                          <p className="text-sm text-slate-600 line-clamp-3">{app.coverLetter}</p>
                        </div>
                      )}
                      <p className="text-xs text-slate-400">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {app.status === "accepted" && (
                      <Link to="/student/reports">
                        <Button variant="outline" size="sm" className="gap-1">
                          Submit Reports <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
            <p className="text-slate-500 mb-4 max-w-md mx-auto">
              You haven&apos;t applied to any internships yet. Browse available opportunities and submit your first application.
            </p>
            <Link to="/student/internships">
              <Button className="gap-2">
                <Briefcase className="w-4 h-4" />
                Browse Internships
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
