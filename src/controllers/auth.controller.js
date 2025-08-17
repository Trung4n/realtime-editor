import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";
import { env } from "../config/index.js";

export const register = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const user = await authService.register({ email, username, password });
  res.status(201).json({
    message: "User registered successfully",
    user: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production", // Set to true in production
    sameSite: "Strict", // Prevent CSRF attacks
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: result.user,
    token: result.token,
  });
});
