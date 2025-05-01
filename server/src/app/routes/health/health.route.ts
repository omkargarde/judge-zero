import express from "express";

import { HealthCheck } from "./health.controller.ts";

const RegisterHealthRoutes = () => {
  const router = express.Router();
  router.get("/", HealthCheck);
  return router;
};

export { RegisterHealthRoutes };
