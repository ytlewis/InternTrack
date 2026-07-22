import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignInDialog } from "@/components/SignInDialog";
import { motion } from "framer-motion";
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white min-h-[600px]">
        {/* Background Image with Parallax Effect */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
            alt="Students collaborating"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-950/70 to-slate-900/80" />
          {/* Overlay Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                <Zap className="w-3 h-3 mr-1" />
                Online Student Internship Management System
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Streamline Your{" "}
              <span className="text-blue-400 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Internship Journey
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              InternTrack connects students, supervisors, employers, and coordinators in one
              unified platform — simplifying applications, tracking progress, and managing
              evaluations from start to finish.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/login">
                <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <SignInDialog>
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Sign In
                </Button>
              </SignInDialog>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-50 border-b relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
            alt="University students"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-blue-50/90 to-slate-50/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow border-blue-100">
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
            alt="Team collaboration"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage internships efficiently — from application to evaluation.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur-sm h-full hover:scale-105">
                  <CardContent className="p-6">
                    <motion.div 
                      className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=2074&auto=format&fit=crop" 
            alt="Students working together"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-slate-50/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for Every Role</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tailored dashboards and workflows for students, supervisors, employers, and administrators.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-slate-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {role.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{role.title}</h3>
                        <p className="text-slate-600">{role.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
            alt="Team working together"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A streamlined process from application to completion.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register", desc: "Sign up with your institutional email and select your role." },
              { step: "02", title: "Apply", desc: "Browse approved internships and submit your application with documents." },
              { step: "03", title: "Get Placed", desc: "Get matched with a supervisor and begin your internship." },
              { step: "04", title: "Submit Reports", desc: "Log your weekly progress and receive feedback and evaluations." },
            ].map((item, index) => (
              <motion.div 
                key={item.step} 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop" 
            alt="Graduation celebration"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students, supervisors, and employers using InternTrack to streamline internship management.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="gap-2 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
                <Globe className="w-4 h-4" />
                Launch InternTrack
              </Button>
            </Link>
          </motion.div>
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
          <div className="mt-4">
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors"
            >
              <Shield className="w-3 h-3" />
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
