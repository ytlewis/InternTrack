import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import { Shield, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const signin = trpc.auth.signin.useMutation();

  const isPending = signin.status === "pending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await signin.mutateAsync({ email, role: "admin" });
      if (result?.user?.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        alert("Access denied. Admin credentials required.");
      }
    } catch (err: unknown) {
      console.error("Admin login failed", err);
      const error = err as { data?: { message?: string }; message?: string };
      const msg = error?.data?.message || error?.message || "Admin login failed";
      alert(msg);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
            <p className="text-sm text-slate-400 mt-2">
              Secure login for system administrators
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Admin Email
              </label>
              <Input
                type="email"
                placeholder="admin@interntrack.com"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300 mb-1">Secure Authentication</p>
                  <p>This login is restricted to authorized administrators only. Your access is monitored and logged.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Sign In as Admin
                  </>
                )}
              </Button>

              <a 
                href="/login"
                className="block text-center text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                ← Back to regular login
              </a>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-xs text-center text-slate-500">
              For security purposes, all admin login attempts are logged and monitored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
