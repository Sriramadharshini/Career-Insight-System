import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Feedback } from "../models/Feedback.js";
import { SystemSetting } from "../models/SystemSetting.js";
import { Activity } from "../models/Activity.js";

const router = express.Router();

// GET /api/feedback/status — Get feedback system status
router.get("/status", async (req, res) => {
  try {
    const settings = await SystemSetting.findOne();
    const enabled = settings ? settings.feedbackEnabled : true;
    res.json({ enabled });
  } catch (err) {
    res.status(500).json({ message: "Failed to get feedback status", error: err.message });
  }
});

// POST /api/feedback — Submit feedback (authenticated users)
router.post("/", protect, async (req, res) => {
  try {
    const settings = await SystemSetting.findOne();
    if (settings && !settings.feedbackEnabled) {
      return res.status(403).json({ message: "Feedback submissions are currently disabled by the administrator." });
    }

    const { message, rating } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      message: message.trim(),
      rating: rating || 3,
      status: "Pending"
    });

    await Activity.create({
      user: req.user._id,
      action: "Submitted",
      target: "Feedback",
      type: "feedback"
    }).catch(e => console.error("Activity logging failed:", e));

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback", error: err.message });
  }
});

export default router;
