import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const router = Router();

router.use(requireAuth);
router.get("/me", getUserProfile);
