import { useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Filter,
  Clock,
} from "lucide-react";

export default function EmployerApplications() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const opportunityId = searchParams.get("opportunityId");

  const { data: allApplications, isLoading } = trpc.application.listByEmployer.useQuery(
    undefined,
    { enabled: !!user?.id && user?.role === "employer" }
  );

  const utils = trpc.useUtils();
  const updateStatus = trpc.application.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated!");
      utils.application.listByEmployer.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredApplications = allApplications?.filter((app) => {
    if (opportunityId && app.opportunityId !== parseInt(opportunityId)) return false;
    return true;
  });

  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    shortlisted: { label: "Shortlisted", className: "bg-blue-100 text-blue-700" },
    accepted: { label: "Accepted", className: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Review Applications</h1>
        <p className="text-slate-500">Review and manage applications for your opportunities</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filteredApplications && filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const status = statusMap[app.status] || statusMap.pending;
            return (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                          {app.student.user.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{app.student.user.name}</h3>
                          <p className="text-sm text-slate-500">{app.student.studentId} · {app.student.program}</p>
                        </div>
                        <Badge className={status.className}>{status.label}</Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Applied for: {app.opportunity.title}
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                      {app.coverLetter && (
                        <div className="bg-slate-50 rounded-lg p-3 mb-2">
                          <p className="text-sm font-medium text-slate-700 mb-1">Cover Letter:</p>
                          <p className="text-sm text-slate-600">{app.coverLetter}</p>
                        </div>
                      )}
                      {app.resumeUrl && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-slate-700 mb-1">Resume/CV:</p>
                          <a 
                            href={app.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                          >
                            View Resume
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Select
                        value={app.status}
                        onValueChange={(value) =>
                          updateStatus.mutate({ id: app.id, status: value as "pending" | "shortlisted" | "accepted" | "rejected" })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <span className="flex items-center gap-2">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          </SelectItem>
                          <SelectItem value="shortlisted">
                            <span className="flex items-center gap-2">
                              <Filter className="w-3 h-3" /> Shortlist
                            </span>
                          </SelectItem>
                          <SelectItem value="accepted">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3" /> Accept
                            </span>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <span className="flex items-center gap-2">
                              <XCircle className="w-3 h-3" /> Reject
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
            <p className="text-slate-500">Applications will appear here once students apply to your opportunities.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
