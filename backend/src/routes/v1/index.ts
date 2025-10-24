import submissionsRouter from "./submissions.router.js";

export function setupRoutes(app: any) {
  app.use("/api/v1/submissions", submissionsRouter);
}
