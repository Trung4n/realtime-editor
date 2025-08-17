import express from "express";
import cors from "cors";
// import helmet from "helmet";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// import rateLimit from "express-rate-limit";
import createError from "http-errors";
import { env } from "./config/index.js";
import { router as authRoutes } from "./routes/auth.routes.js";
import { router as docRoutes } from "./routes/doc.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createApp = () => {
  const app = express();

  // app.use(helmet()); // Off for test
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  // const globalLimiter = rateLimit({
  //   windowMs: 60 * 1000,
  //   max: 100,
  //   message: "Too many requests, please try again later.",
  // });
  // app.use(globalLimiter);

  app.get("/login", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/register", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/register.html"));
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/docs", docRoutes);

  app.use((_req, _res, next) => next(createError(404, "Not Found")));

  app.use(errorHandler);

  return app;
};
