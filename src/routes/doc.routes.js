import { Router } from "express";
import { createDoc, listDocs, getDoc } from "../controllers/doc.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const router = Router();

router.use(requireAuth);
router.get("/", listDocs);
router.post("/", createDoc);
router.get("/:id", getDoc);
