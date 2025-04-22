import type { Application } from "express";

import express from "express";

import { RegisterHealthRoutes } from "./routes/health/route.ts";

const CreateApp = () => {
  const app: Application = express();
  app.use(RegisterHealthRoutes());
  return app;
};

export { CreateApp };
