import express from "express";

import { HealthCheck } from "./controller.ts";

const RegisterHealthRoutes = () => {
  const router = express.Router();
  router.get("/", HealthCheck);
  return router;
};

export { RegisterHealthRoutes };
