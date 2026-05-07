import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Feedback } from "../models/Feedback.js";

const router = express.Router();

// POST /api/feedback — Submit feedback (authenticated users)
router.post("/", protect, async (req, res) => {
  try {
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

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback", error: err.message });
  }
});

export default router;
