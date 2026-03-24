import { Router } from "express";
import {
  generateSummary,
  getProfile,
  saveProfile
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getProfile);
router.post("/generate-summary", protect, generateSummary);
router.post("/", protect, saveProfile);

export default router;
