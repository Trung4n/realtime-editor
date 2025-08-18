import { User } from "../models/User.model.js";
import { AppError } from "../utils/appError.js";
export const userService = {
  async getById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },
  // ...
};
