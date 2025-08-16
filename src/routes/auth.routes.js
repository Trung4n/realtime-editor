import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validate.middleware.js";

export const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
