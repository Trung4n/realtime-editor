import mongoose from "mongoose";
import { env } from "./index.js";

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI, {
    autoIndex: true,
  });
  console.log("MongoDB connected");
};
