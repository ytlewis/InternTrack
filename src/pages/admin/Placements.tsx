import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { GraduationCap, UserCheck, Building2, Calendar } from "lucide-react";

export default function AdminPlacements() {
  const utils = trpc.useUtils();
  const { data: placements, isLoading: loadingPlacements } = trpc.admin.listPlacements.useQuery();
  const { data: students, isLoading: loadingStudents } = trpc.admin.listStudents.useQuery();
  const { data: supervisors, isLoading: loadingSupervisors } = trpc.admin.listSupervisors.useQuery();

  const assignSupervisor = trpc.admin.assignSupervisor.useMutation({
    onSuccess: () => {
      toast.success("Supervisor assigned successfully!");
      utils.admin.listPlacements.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const isLoading = loadingPlacements || loadingStudents || loadingSupervisors;

  // Create a map of student profile ID to student data
  const studentMap = students?.reduce((acc, student) => {
    acc[student.id] = student;
    return acc;
  }, {} as Record<number, any>) || {};

  // Create a map of supervisor profile ID to supervisor data
  const supervisorMap = supervisors?.reduce((acc, supervisor) => {
    acc[supervisor.id] = supervisor;
    return acc;
  }, {} as Record<number, any>) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Placement Management</h1>
        <p className="text-slate-500">Manage student placements and assign supervisors</p>
      </div>

      {/* Summary Cards */}
      {!isLoading && placements && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                  <GraduationCap className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{placements.length}</p>
                  <p className="text-sm text-slate-500">Total Placements</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                  <UserCheck className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {placements.filter((p) => p.supervisorId).length}
                  </p>
                  <p className="text-sm text-slate-500">With Supervisors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100">
                  <Calendar className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {placements.filter((p) => p.status === "active").length}
                  </p>
                  <p className="text-sm text-slate-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : placements && placements.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Placement ID</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Application ID</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Start Date</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">End Date</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Supervisor</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((placement) => {
                    const supervisor = placement.supervisorId ? supervisorMap[placement.supervisorId] : null;
                    return (
                      <tr key={placement.id} className="border-b hover:bg-slate-50">
                        <td className="p-4">
                          <span className="font-medium text-slate-900">#{placement.id}</span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">App #{placement.applicationId}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              placement.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-700"
                            }
                          >
                            {placement.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {placement.startDate
                            ? new Date(placement.startDate).toLocaleDateString()
                            : "Not set"}
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {placement.endDate
                            ? new Date(placement.endDate).toLocaleDateString()
                            : "Not set"}
                        </td>
                        <td className="p-4">
                          {supervisor ? (
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-slate-700">
                                {supervisor.user?.name || "Supervisor #" + supervisor.id}
                              </span>
                            </div>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700">Unassigned</Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <Select
                            value={placement.supervisorId?.toString() || "none"}
                            onValueChange={(value) => {
                              const supervisorId = value === "none" ? null : parseInt(value);
                              assignSupervisor.mutate({
                                placementId: placement.id,
                                supervisorId,
                              });
                            }}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Assign Supervisor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Supervisor</SelectItem>
                              {supervisors?.map((sup) => (
                                <SelectItem key={sup.id} value={sup.id.toString()}>
                                  {sup.user?.name || `Supervisor #${sup.id}`} -{" "}
                                  {sup.department || "N/A"}
                                </SelectItem>
                              ))}
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
            <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">No placements found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
