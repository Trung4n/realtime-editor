import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validate.middleware.js";
import {
  registerLimiter,
  loginLimiter,
} from "../middlewares/limiter.middleware.js";

export const router = Router();

router.post("/register", registerLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
