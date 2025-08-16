import { env } from "../config/index.js";
export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  if (env.NODE_ENV !== "production") {
    // console.error(err);
  }
  res.status(status).json({ message });
};
