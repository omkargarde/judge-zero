import type { Application } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { urlencoded } from "express";

import { Env } from "../env.ts";
import { authRouter } from "./routes/auth/auth.route.ts";
import { healthRouter } from "./routes/health/health.route.ts";

const app: Application = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: Env.CORS_ORIGIN,
  })
);

app.use("/", healthRouter);
app.use("/v1/api/auth", authRouter);

export { app };
