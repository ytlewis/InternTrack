import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ClipboardList,
  MessageSquare,
  Users,
  Settings,
  Menu,
  LogOut,
  Shield,
  Building2,
  GraduationCap,
  BookOpen,
  BarChart3,
  CheckSquare,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["admin"] },
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["student", "supervisor", "employer"] },
  { label: "Browse Internships", path: "/student/internships", icon: <Briefcase className="w-5 h-5" />, roles: ["student"] },
  { label: "My Applications", path: "/student/applications", icon: <ClipboardList className="w-5 h-5" />, roles: ["student"] },
  { label: "Reports", path: "/student/reports", icon: <FileText className="w-5 h-5" />, roles: ["student", "supervisor"] },
  { label: "Feedback", path: "/student/feedback", icon: <MessageSquare className="w-5 h-5" />, roles: ["student"] },
  { label: "My Students", path: "/supervisor/students", icon: <GraduationCap className="w-5 h-5" />, roles: ["supervisor"] },
  { label: "Evaluations", path: "/supervisor/evaluations", icon: <CheckSquare className="w-5 h-5" />, roles: ["supervisor"] },
  { label: "Post Opportunity", path: "/employer/opportunities/new", icon: <Briefcase className="w-5 h-5" />, roles: ["employer"] },
  { label: "My Opportunities", path: "/employer/opportunities", icon: <Building2 className="w-5 h-5" />, roles: ["employer"] },
  { label: "Applications", path: "/employer/applications", icon: <ClipboardList className="w-5 h-5" />, roles: ["employer"] },
  { label: "User Management", path: "/admin/users", icon: <Users className="w-5 h-5" />, roles: ["admin"] },
  { label: "Opportunities", path: "/admin/opportunities", icon: <Briefcase className="w-5 h-5" />, roles: ["admin"] },
  { label: "All Applications", path: "/admin/applications", icon: <ClipboardList className="w-5 h-5" />, roles: ["admin"] },
  { label: "Placements", path: "/admin/placements", icon: <GraduationCap className="w-5 h-5" />, roles: ["admin"] },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="w-5 h-5" />, roles: ["admin"] },
  { label: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" />, roles: ["student", "supervisor", "employer", "admin"] },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout, roleDisplay, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role || ""));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">InternTrack</h1>
          <p className="text-xs text-slate-500">Internship Management</p>
        </div>
      </div>

      {isAuthenticated && user && (
        <div className="px-4 py-3 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name || "User"}</p>
              <Badge variant="outline" className="text-xs font-normal mt-0.5">
                {roleDisplay}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3 space-y-2">
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span>Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden h-14" />
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
