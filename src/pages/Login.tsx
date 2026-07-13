import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";

type UserRole = "student" | "supervisor" | "employer";
type Mode = "signin" | "signup";

const redirectMap: Record<UserRole, string> = {
  student: "/student/internships",
  supervisor: "/supervisor/students",
  employer: "/employer/opportunities",
};

export default function Login() {
  // Check URL parameter for mode
  const params = new URLSearchParams(window.location.search);
  const initialMode = params.get("mode") === "signin" ? "signin" : "signup";
  
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const signup = trpc.auth.signup.useMutation();
  const signin = trpc.auth.signin.useMutation();

  const isPending = signup.status === "pending" || signin.status === "pending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === "signup") {
        const result = await signup.mutateAsync({ name, email, role });
        const userRole = (result?.user?.role as UserRole) ?? role;
        window.location.href = redirectMap[userRole] || "/";
      } else {
        const result = await signin.mutateAsync({ email, role });
        const userRole = (result?.user?.role as UserRole) ?? role;
        window.location.href = redirectMap[userRole] || "/";
      }
    } catch (err: unknown) {
      console.error(`${mode} failed`, err);
      const error = err as { data?: { message?: string }; message?: string };
      const msg = error?.data?.message || error?.message || `${mode === "signup" ? "Sign up" : "Sign in"} failed`;
      alert(msg);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop" 
          alt="Students studying"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-white/85 to-blue-50/90" />
      </div>
      <Card className="w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle>
            {mode === "signup" ? "Create an account" : "Welcome back"}
          </CardTitle>
          <p className="text-sm text-slate-500 mt-2">
            {mode === "signup"
              ? "Sign up to get started with InternTrack"
              : "Sign in to continue to your dashboard"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <Input
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                className="mt-1"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                {mode === "signup" ? "Role" : "I am a"}
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending
                  ? "Please wait..."
                  : mode === "signup"
                    ? "Create account"
                    : "Sign in"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
