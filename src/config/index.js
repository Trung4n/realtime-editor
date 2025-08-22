import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  AUTO_SAVE_INTERVAL: process.env.AUTO_SAVE_INTERVAL,
  CLEANUP_DELAY: process.env.CLEANUP_DELAY,
  FRONTEND_DIST_PATH: process.env.FRONTEND_DIST_PATH,
};
