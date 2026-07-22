import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminOpportunities() {
  const utils = trpc.useUtils();
  const { data: opportunities, isLoading } = trpc.opportunity.listAll.useQuery();

  const approve = trpc.opportunity.approve.useMutation({
    onSuccess: () => {
      toast.success("Opportunity approved!");
      utils.opportunity.listAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const reject = trpc.opportunity.reject.useMutation({
    onSuccess: () => {
      toast.success("Opportunity rejected!");
      utils.opportunity.listAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const del = trpc.opportunity.delete.useMutation({
    onSuccess: () => {
      toast.success("Opportunity deleted!");
      utils.opportunity.listAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const statusMap: Record<string, { label: string; className: string }> = {
    approved: { label: "Approved", className: "bg-green-100 text-green-700" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Opportunity Management</h1>
        <p className="text-slate-500">Review and manage all internship opportunities</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const status = statusMap[opp.status] || statusMap.pending;
            return (
              <Card key={opp.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{opp.title}</h3>
                        <Badge className={status.className}>{status.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Building2 className="w-4 h-4" />
                        <span>{opp.employer?.companyName || opp.employer?.user?.name || "Unknown Company"}</span>
                        <span className="text-slate-300">|</span>
                        <MapPin className="w-4 h-4" />
                        <span>{opp.location || "Remote"}</span>
                        <span className="text-slate-300">|</span>
                        <Clock className="w-4 h-4" />
                        <span>{opp.duration || "Not specified"}</span>
                        <span className="text-slate-300">|</span>
                        <Users className="w-4 h-4" />
                        <span>{opp.slotsAvailable} slots</span>
                      </div>
                      <p className="text-slate-600 mb-2">{opp.description}</p>
                      {opp.requirements && (
                        <p className="text-sm text-slate-500">Requirements: {opp.requirements}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {opp.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => approve.mutate({ id: opp.id })}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => reject.mutate({ id: opp.id })}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-600"
                        onClick={() => del.mutate({ id: opp.id })}
                      >
                        Delete
                      </Button>
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
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">No opportunities found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
