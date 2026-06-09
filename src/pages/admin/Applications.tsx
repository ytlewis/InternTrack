import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  ClipboardList,
} from "lucide-react";

export default function AdminApplications() {
  const utils = trpc.useUtils();
  const { data: applications, isLoading } = trpc.application.list.useQuery();

  const updateStatus = trpc.application.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated!");
      utils.application.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
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
        <h1 className="text-2xl font-bold text-slate-900">All Applications</h1>
        <p className="text-slate-500">Manage and oversee all internship applications</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : applications && applications.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Student</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Opportunity</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Employer</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Applied</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const status = statusMap[app.status] || statusMap.pending;
                    return (
                      <tr key={app.id} className="border-b hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">
                              {app.student.user.name?.charAt(0) || "S"}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{app.student.user.name}</p>
                              <p className="text-xs text-slate-500">{app.student.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-700 max-w-xs truncate">
                          {app.opportunity.title}
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {app.opportunity.employer.companyName}
                        </td>
                        <td className="p-4">
                          <Badge className={status.className}>{status.label}</Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Select
                            value={app.status}
                            onValueChange={(value) =>
                              updateStatus.mutate({
                                id: app.id,
                                status: value as "pending" | "shortlisted" | "accepted" | "rejected",
                              })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">No applications found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
