import mongoose from "mongoose";
import { env } from "./index.js";

export const connectDB = async (uri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri || env.MONGO_URI, {
    autoIndex: true,
  });
  console.log("MongoDB connected");
};
