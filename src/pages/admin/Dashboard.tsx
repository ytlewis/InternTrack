import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  UserCheck,
  Building2,
  Briefcase,
  ClipboardList,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
      link: "/admin/users",
    },
    {
      title: "Students",
      value: stats?.totalStudents || 0,
      icon: <GraduationCap className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Supervisors",
      value: stats?.totalSupervisors || 0,
      icon: <UserCheck className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Employers",
      value: stats?.totalEmployers || 0,
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-orange-500",
    },
    {
      title: "Total Opportunities",
      value: stats?.totalOpportunities || 0,
      icon: <Briefcase className="w-6 h-6" />,
      color: "bg-indigo-500",
      link: "/admin/opportunities",
    },
    {
      title: "Pending Opportunities",
      value: stats?.pendingOpportunities || 0,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-yellow-500",
      link: "/admin/opportunities",
      badge: true,
    },
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: <ClipboardList className="w-6 h-6" />,
      color: "bg-pink-500",
      link: "/admin/applications",
    },
    {
      title: "Pending Applications",
      value: stats?.pendingApprovals || 0,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-red-500",
      link: "/admin/applications",
      badge: true,
    },
    {
      title: "Active Placements",
      value: stats?.totalPlacements || 0,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "bg-teal-500",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all system users",
      icon: <Users className="w-5 h-5" />,
      link: "/admin/users",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      title: "Review Opportunities",
      description: "Approve or reject internship postings",
      icon: <Briefcase className="w-5 h-5" />,
      link: "/admin/opportunities",
      color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      badge: stats?.pendingOpportunities,
    },
    {
      title: "View Applications",
      description: "Monitor all student applications",
      icon: <ClipboardList className="w-5 h-5" />,
      link: "/admin/applications",
      color: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      badge: stats?.pendingApprovals,
    },
    {
      title: "Placement Reports",
      description: "Review and manage placement reports",
      icon: <FileText className="w-5 h-5" />,
      link: "/admin/reports",
      color: "bg-green-50 text-green-700 hover:bg-green-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-500">Overview of the InternTrack system</p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat, index) => (
              <Card
                key={index}
                className={`hover:shadow-md transition-all ${stat.link ? "cursor-pointer" : ""}`}
              >
                <Link to={stat.link || "#"} className={stat.link ? "" : "pointer-events-none"}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                          {stat.badge && stat.value > 0 && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                              Needs Review
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`${stat.color} text-white p-3 rounded-lg`}>
                        {stat.icon}
                      </div>
                    </div>
                    {stat.link && (
                      <div className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-700">
                        View details <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <Card className="hover:shadow-md transition-all h-full">
                    <CardContent className="p-5">
                      <div className="relative">
                        {action.badge && action.badge > 0 && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {action.badge}
                          </span>
                        )}
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                          {action.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-slate-500">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* System Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">System Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">Platform Activity</p>
                      <p className="text-sm text-slate-500">
                        {stats?.totalApplications || 0} total applications submitted
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.totalApplications || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">Posted Opportunities</p>
                      <p className="text-sm text-slate-500">
                        {stats?.pendingOpportunities || 0} pending admin approval
                      </p>
                    </div>
                  </div>
                  <Link to="/admin/opportunities">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-medium text-slate-900">Active Placements</p>
                      <p className="text-sm text-slate-500">
                        Students currently in internship programs
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">
                    {stats?.totalPlacements || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
