import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignInDialog } from "@/components/SignInDialog";
import {
  BookOpen,
  Briefcase,
  ClipboardCheck,
  BarChart3,
  Bell,
  Shield,
  ArrowRight,
  GraduationCap,
  Building2,
  UserCheck,
  FileText,
  CheckCircle2,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: <Briefcase className="w-6 h-6 text-blue-600" />,
    title: "Internship Listings",
    description: "Browse and search approved internship opportunities from top employers.",
  },
  {
    icon: <ClipboardCheck className="w-6 h-6 text-green-600" />,
    title: "Application Tracking",
    description: "Submit applications with resumes and cover letters. Track status in real-time.",
  },
  {
    icon: <FileText className="w-6 h-6 text-purple-600" />,
    title: "Report Submissions",
    description: "Submit weekly logbooks and final reports. Get feedback from supervisors.",
  },
  {
    icon: <UserCheck className="w-6 h-6 text-orange-600" />,
    title: "Supervisor Oversight",
    description: "Academic supervisors monitor progress, approve reports, and give evaluations.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
    title: "Admin Dashboard",
    description: "Coordinators manage users, approve opportunities, and generate reports.",
  },
  {
    icon: <Bell className="w-6 h-6 text-red-500" />,
    title: "Notifications",
    description: "Get instant alerts for application updates, deadlines, and feedback.",
  },
];

const stats = [
  { label: "Students Enrolled", value: "1,200+", icon: <GraduationCap className="w-5 h-5" /> },
  { label: "Partner Companies", value: "85+", icon: <Building2 className="w-5 h-5" /> },
  { label: "Active Internships", value: "340+", icon: <Briefcase className="w-5 h-5" /> },
  { label: "Success Rate", value: "94%", icon: <CheckCircle2 className="w-5 h-5" /> },
];

const roles = [
  {
    icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
    title: "Students",
    desc: "Browse internships, apply with documents, track applications, submit reports, and view evaluations.",
  },
  {
    icon: <UserCheck className="w-8 h-8 text-green-600" />,
    title: "Supervisors",
    desc: "Monitor assigned students, review and approve reports, provide ratings and written feedback.",
  },
  {
    icon: <Building2 className="w-8 h-8 text-purple-600" />,
    title: "Employers",
    desc: "Post internship opportunities, review applications, shortlist candidates, and evaluate interns.",
  },
  {
    icon: <Shield className="w-8 h-8 text-red-500" />,
    title: "Administrators",
    desc: "Manage all users, approve opportunities, oversee applications, match students to supervisors, export data.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">InternTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <SignInDialog>
              <Button variant="ghost">Sign In</Button>
            </SignInDialog>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Online Student Internship Management System
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Streamline Your{" "}
              <span className="text-blue-400">Internship Journey</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed">
              InternTrack connects students, supervisors, employers, and coordinators in one
              unified platform — simplifying applications, tracking progress, and managing
              evaluations from start to finish.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <SignInDialog>
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                >
                  Sign In
                </Button>
              </SignInDialog>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage internships efficiently — from application to evaluation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for Every Role</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tailored dashboards and workflows for students, supervisors, employers, and administrators.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{role.title}</h3>
                      <p className="text-slate-600">{role.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A streamlined process from application to completion.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register", desc: "Sign up with your institutional email and select your role." },
              { step: "02", title: "Apply", desc: "Browse approved internships and submit your application with documents." },
              { step: "03", title: "Get Placed", desc: "Get matched with a supervisor and begin your internship." },
              { step: "04", title: "Submit Reports", desc: "Log your weekly progress and receive feedback and evaluations." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students, supervisors, and employers using InternTrack to streamline internship management.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="gap-2">
              <Globe className="w-4 h-4" />
              Launch InternTrack
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-white font-semibold">InternTrack</span>
          </div>
          <p className="text-sm">
            Online Student Internship Management System
          </p>
          <p className="text-xs mt-2 text-slate-500">
            &copy; {new Date().getFullYear()} InternTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
