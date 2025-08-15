import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import createError from "http-errors";
import { env } from "./config/index.js";
import { router as authRoutes } from "./routes/auth.routes.js";
// import { router as docRoutes } from "./routes/doc.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
  app.use(limiter);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  //   app.use("/api/docs", docRoutes);

  app.use((_req, _res, next) => next(createError(404, "Not Found")));

  app.use(errorHandler);

  return app;
};
