import type { Application } from "express";

import express from "express";

import { healthRouter } from "./routes/health/health.route.ts";

const CreateApp = () => {
  const app: Application = express();
  app.use("/", healthRouter);
  return app;
};

export { CreateApp };
