import { Router } from "express";
import { getLatestResume, uploadResume, analyzeCurrentProfile, evaluateInterview } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", protect, getLatestResume);
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.post("/analyze-profile", protect, analyzeCurrentProfile);
router.post("/evaluate-interview", protect, evaluateInterview);

export default router;
