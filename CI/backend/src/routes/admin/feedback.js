import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { Feedback } from "../../models/Feedback.js";

const router = Router();

// GET /api/admin/feedback?type=&status=
router.get("/", adminOnly, async (req, res) => {
  try {
    const { type = "", status = "" } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback", error: err.message });
  }
});

// PUT /api/admin/feedback/:id/status
router.put("/:id/status", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: `Status updated to ${status}`, feedback });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

// DELETE /api/admin/feedback/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete feedback", error: err.message });
  }
});

// POST /api/admin/feedback/:id/reply
router.post("/:id/reply", adminOnly, async (req, res) => {
  try {
    const { message } = req.body;
    // In a real app, this would send an email or notification to the user
    res.json({ message: "Reply sent to user" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reply", error: err.message });
  }
});

// GET /api/admin/feedback/stats
router.get("/stats", adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().select("rating").lean();
    const avg = feedbacks.length
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;
    res.json({ averageRating: Number(avg), totalFeedback: feedbacks.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
});

export default router;
