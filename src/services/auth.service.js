import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import { env } from "../config/index.js";
import { login } from "../../../auth-project/src/services/auth.service.js";
import { signToken } from "../utils/jwt.js";

export const authService = {
  async register({ email, name, password }) {
    const exist = await User.findOne({ email });
    if (exist) throw new Error("Email already in use");
    const user = new User({ email, name, password });
    await user.save();
    return user;
  },
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user || (await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }
    const token = signToken({
      _id: user._id,
      email: user.email,
    });
    return { user, token };
  },
};
