import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  const result = await authService.register({ email, name, password });
  res.json({
    message: "User registered successfully",
    user: result.user,
    token: result.token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "Strict", // Prevent CSRF attacks
  });

  res.json({
    message: "User logged in successfully",
    user: result.user,
    token: result.token,
  });
});
