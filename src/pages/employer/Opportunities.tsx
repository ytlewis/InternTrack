import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Plus,
  ArrowRight,
  Trash2,
} from "lucide-react";

export default function EmployerOpportunities() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: opportunities, isLoading } = trpc.opportunity.listByEmployer.useQuery(
    { employerUserId: user?.id || 0 },
    { enabled: !!user?.id && user?.role === "employer" }
  );

  const deleteOpp = trpc.opportunity.deleteByEmployer.useMutation({
    onSuccess: () => {
      toast.success("Opportunity deleted successfully");
      utils.opportunity.listByEmployer.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteOpp.mutate({ id });
    }
  };

  const statusMap: Record<string, { label: string; className: string }> = {
    approved: { label: "Approved", className: "bg-green-100 text-green-700" },
    pending: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Opportunities</h1>
          <p className="text-slate-500">Manage your posted internship opportunities</p>
        </div>
        <Link to="/employer/opportunities/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Opportunity
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="grid gap-4">
          {opportunities.map((opp) => {
            const status = statusMap[opp.status] || statusMap.pending;
            return (
              <Card key={opp.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{opp.title}</h3>
                        <Badge className={status.className}>{status.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{opp.location || "Remote"}</span>
                        <span className="text-slate-300">|</span>
                        <Clock className="w-4 h-4" />
                        <span>{opp.duration}</span>
                        <span className="text-slate-300">|</span>
                        <Users className="w-4 h-4" />
                        <span>{opp.slotsAvailable} slots</span>
                      </div>
                      <p className="text-slate-600 mb-3">{opp.description}</p>
                      {opp.requirements && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-slate-700">Requirements: {opp.requirements}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/employer/applications?opportunityId=${opp.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          View Applications <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(opp.id, opp.title)}
                        disabled={deleteOpp.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
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
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Opportunities Yet</h3>
            <p className="text-slate-500 mb-4">Start by creating your first internship opportunity.</p>
            <Link to="/employer/opportunities/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Opportunity
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
