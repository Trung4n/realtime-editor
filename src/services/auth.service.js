import { User } from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

export const authService = {
  async register({ email, username, password }) {
    const exist = await User.findOne({ email });
    if (exist) {
      throw new AppError("Email already exists", 401);
    }
    const user = new User({ email, username, password });
    await user.save();
    return user;
  },
  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({
      sub: user._id,
      email: user.email,
    });
    return { user, token };
  },
};
