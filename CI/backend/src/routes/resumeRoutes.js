import { Router } from "express";
import { 
  getLatestResume, 
  uploadResume, 
  analyzeCurrentProfile, 
  evaluateInterview, 
  evaluateVideoInterview, 
  getJobRecommendations 
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

const checkResumeUploads = async (req, res, next) => {
  try {
    const { SystemSetting } = await import("../models/SystemSetting.js");
    const settings = await SystemSetting.findOne().lean();
    if (settings && settings.resumeUploads === false) {
      return res.status(403).json({ message: "Resume uploads are currently disabled by the administrator." });
    }
    next();
  } catch (err) {
    next(err);
  }
};

router.get("/", protect, getLatestResume);
router.post("/upload", protect, checkResumeUploads, upload.single("resume"), uploadResume);
router.post("/analyze-profile", protect, analyzeCurrentProfile);
router.post("/evaluate-interview", protect, evaluateInterview);
router.post("/evaluate-video-interview", protect, evaluateVideoInterview);
router.get("/job-recommendations", protect, getJobRecommendations);
router.post("/log-career-view", protect, async (req, res) => {
  try {
    const { Activity } = await import("../models/Activity.js");
    await Activity.create({
      user: req.user._id,
      action: "Viewed",
      target: "Career Suggestions",
      type: "career"
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to log career view:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
