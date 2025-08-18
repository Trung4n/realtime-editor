import { userService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.user.sub);
  res.json(user);
});

// ...
