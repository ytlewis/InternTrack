import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Users,
  GraduationCap,
  UserCheck,
  Building2,
  Shield,
} from "lucide-react";

const roleIcons: Record<string, React.ReactNode> = {
  student: <GraduationCap className="w-4 h-4" />,
  supervisor: <UserCheck className="w-4 h-4" />,
  employer: <Building2 className="w-4 h-4" />,
  admin: <Shield className="w-4 h-4" />,
};

const roleColors: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  supervisor: "bg-green-100 text-green-700",
  employer: "bg-purple-100 text-purple-700",
  admin: "bg-red-100 text-red-700",
};

export default function AdminUsers() {
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();

  const updateRole = trpc.admin.updateRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated!");
      utils.admin.listUsers.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500">Manage all users and their roles</p>
      </div>

      {/* Summary Cards */}
      {!isLoading && users && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["student", "supervisor", "employer", "admin"].map((role) => (
            <Card key={role}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${roleColors[role].split(" ")[0]}`}>
                    {roleIcons[role]}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {users.filter((u) => u.role === role).length}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">{role}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : users && users.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-4 text-sm font-medium text-slate-700">User</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Joined</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <span className="font-medium text-slate-900">{user.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{user.email || "—"}</td>
                      <td className="p-4">
                        <Badge className={`capitalize gap-1 ${roleColors[user.role] || "bg-slate-100 text-slate-700"}`}>
                          {roleIcons[user.role]}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={user.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {user.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            updateRole.mutate({ userId: user.id, role: value as "student" | "supervisor" | "employer" | "admin" })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="employer">Employer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">No users found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
