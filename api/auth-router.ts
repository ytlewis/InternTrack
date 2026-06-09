import * as cookie from "cookie";
import { z } from "zod";
import { nanoid } from "nanoid";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { TRPCError } from "@trpc/server";
import { createUser, findUserByEmail } from "./queries/users";
import { signSessionToken } from "./kimi/session";
import { env } from "./lib/env";

// In-memory fallback store keyed by unionId, used when the database is unreachable
// so that local development works without MySQL running.
type StoredUser = {
  unionId: string;
  name: string | null;
  email: string | null;
  role: string;
  id?: number; // Add id for profile lookups
};

type StoredEmployerProfile = {
  id: number;
  userId: number;
  companyName: string;
  companyAddress: string | null;
  contactPerson: string | null;
  phone: string | null;
  industry: string | null;
};

const memoryStore: Map<string, StoredUser> = (() => {
  const g = globalThis as unknown as { __authMemoryStore?: Map<string, StoredUser> };
  if (!g.__authMemoryStore) g.__authMemoryStore = new Map();
  return g.__authMemoryStore;
})();

const employerProfileStore: Map<number, StoredEmployerProfile> = (() => {
  const g = globalThis as unknown as { __employerProfileStore?: Map<number, StoredEmployerProfile> };
  if (!g.__employerProfileStore) g.__employerProfileStore = new Map();
  return g.__employerProfileStore;
})();

let nextUserId = 1;
let nextEmployerProfileId = 1;

function findInMemoryByEmail(email: string): StoredUser | undefined {
  const lower = email.toLowerCase();
  for (const u of memoryStore.values()) {
    if (u.email && u.email.toLowerCase() === lower) return u;
  }
  return undefined;
}

function findInMemoryByUnionId(unionId: string): StoredUser | undefined {
  return memoryStore.get(unionId);
}

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
  signup: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        role: z.enum(["student", "supervisor", "employer"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const unionId = `local:${nanoid()}`;
        const userRole = input.role ?? "student";
        const userId = nextUserId++;

        let user: StoredUser = {
          unionId,
          name: input.name,
          email: input.email,
          role: userRole,
          id: userId,
        };

        // Try the database first; if it fails, fall back to the in-memory store
        try {
          await createUser({
            unionId,
            name: input.name,
            email: input.email,
            role: userRole,
          });
        } catch (dbErr) {
          console.warn("[auth.signup] createUser failed, using in-memory store:", dbErr);
        }

        // Always cache in memory so subsequent sign-in/me lookups work even without DB
        memoryStore.set(unionId, user);

        // Auto-create employer profile if role is employer
        if (userRole === "employer") {
          const employerProfile: StoredEmployerProfile = {
            id: nextEmployerProfileId++,
            userId: userId,
            companyName: input.name || "My Company",
            companyAddress: null,
            contactPerson: input.name,
            phone: null,
            industry: null,
          };
          employerProfileStore.set(userId, employerProfile);
        }

        const token = await signSessionToken({ unionId, clientId: env.appId });

        const opts = getSessionCookieOptions(ctx.req.headers);
        ctx.resHeaders.append(
          "set-cookie",
          cookie.serialize(Session.cookieName, token, {
            httpOnly: opts.httpOnly,
            path: opts.path,
            sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
            secure: opts.secure,
            maxAge: Session.maxAgeMs / 1000,
          }),
        );

        return { success: true, user };
      } catch (err: unknown) {
        const error = err as { message?: string };
        console.error("[auth.signup] failed:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message ?? "Signup failed" });
      }
    }),
  signin: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["student", "supervisor", "employer"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Try DB first
        let existing: StoredUser | null = null;
        try {
          const fromDb = (await findUserByEmail(input.email)) as unknown as StoredUser | null | undefined;
          if (fromDb) existing = fromDb as StoredUser;
        } catch (dbErr) {
          console.warn("[auth.signin] DB lookup failed, falling back to memory:", dbErr);
        }

        // Fall back to in-memory store (covers dev without MySQL running)
        if (!existing) {
          const fromMem = findInMemoryByEmail(input.email);
          if (fromMem) existing = fromMem;
        }

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No account found with that email. Please sign up first.",
          });
        }

        // Verify role matches if provided
        if (input.role && existing.role !== input.role) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `This email is registered as ${existing.role}, not ${input.role}. Please select the correct role.`,
          });
        }

        const token = await signSessionToken({ unionId: existing.unionId, clientId: env.appId });

        const opts = getSessionCookieOptions(ctx.req.headers);
        ctx.resHeaders.append(
          "set-cookie",
          cookie.serialize(Session.cookieName, token, {
            httpOnly: opts.httpOnly,
            path: opts.path,
            sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
            secure: opts.secure,
            maxAge: Session.maxAgeMs / 1000,
          }),
        );

        return {
          success: true,
          user: existing,
        };
      } catch (err: unknown) {
        if (err instanceof TRPCError) throw err;
        const error = err as { message?: string };
        console.error("[auth.signin] failed:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message ?? "Sign in failed" });
      }
    }),
});

export { findInMemoryByUnionId, employerProfileStore };
