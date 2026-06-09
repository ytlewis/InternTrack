import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
};

export function useAuth(options?: UseAuthOptions) {
  const _opts = options ?? {};
  void _opts;
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      window.location.href = "/";
    },
  });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";
  const isSupervisor = user?.role === "supervisor";
  const isEmployer = user?.role === "employer";

  const roleDisplay = useMemo(() => {
    if (!user) return "";
    const map: Record<string, string> = {
      student: "Student",
      supervisor: "Academic Supervisor",
      employer: "Employer",
      admin: "Administrator",
    };
    return map[user.role] || user.role;
  }, [user]);

  return useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading: isLoading || logoutMutation.isPending,
      isAdmin,
      isStudent,
      isSupervisor,
      isEmployer,
      roleDisplay,
      error,
      logout,
      refresh: refetch,
    }),
    [user, isLoading, logoutMutation.isPending, isAdmin, isStudent, isSupervisor, isEmployer, roleDisplay, error, logout, refetch]
  );
}
