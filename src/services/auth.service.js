import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import { env } from "../config/index.js";
import { login } from "../../../auth-project/src/services/auth.service.js";
import { signToken } from "../utils/jwt.js";
import createError from "http-errors";

export const authService = {
  async register({ email, username, password }) {
    const exist = await User.findOne({ email });
    if (exist) {
      throw createError(401, "Email already exists");
    }
    const user = new User({ email, username, password });
    await user.save();
    return user;
  },
  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw createError(401, "Invalid credentials");
    }
    const token = signToken({
      _id: user._id,
      email: user.email,
    });
    return { user, token };
  },
};
