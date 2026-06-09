import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Shield,
  Bell,
  BookOpen,
  Calendar,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout, roleDisplay } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Your account information and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
              {user.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{user.name || "User"}</h3>
              <Badge variant="outline" className="capitalize">
                {roleDisplay}
              </Badge>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900">{user.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Shield className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="text-sm font-medium text-slate-900 capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Joined</p>
                <p className="text-sm font-medium text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Last Sign In</p>
                <p className="text-sm font-medium text-slate-900">{new Date(user.lastSignInAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Notification preferences will be available in a future update.
          </p>
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={logout} className="w-full">
        Sign Out
      </Button>
    </div>
  );
}
