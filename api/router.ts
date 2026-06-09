import { authRouter } from "./auth-router";
import { opportunityRouter } from "./opportunityRouter";
import { applicationRouter } from "./applicationRouter";
import { placementRouter } from "./placementRouter";
import { reportRouter } from "./reportRouter";
import { evaluationRouter } from "./evaluationRouter";
import { notificationRouter } from "./notificationRouter";
import { adminRouter } from "./adminRouter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  opportunity: opportunityRouter,
  application: applicationRouter,
  placement: placementRouter,
  report: reportRouter,
  evaluation: evaluationRouter,
  notification: notificationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
