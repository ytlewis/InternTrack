import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/providers/trpc";

type UserRole = "student" | "supervisor" | "employer";

const redirectMap: Record<UserRole, string> = {
  student: "/student/internships",
  supervisor: "/supervisor/students",
  employer: "/employer/opportunities",
};

interface SignInDialogProps {
  children: React.ReactNode;
}

export function SignInDialog({ children }: SignInDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const signin = trpc.auth.signin.useMutation();

  const isPending = signin.status === "pending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await signin.mutateAsync({ email, role });
      const userRole = (result?.user?.role as UserRole) ?? role;
      window.location.href = redirectMap[userRole] || "/";
    } catch (err: unknown) {
      console.error("Sign in failed", err);
      const error = err as { data?: { message?: string }; message?: string };
      const msg = error?.data?.message || error?.message || "Sign in failed";
      alert(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Enter your email and select your role to sign in to your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">I am a</Label>
            <select
              id="role"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
