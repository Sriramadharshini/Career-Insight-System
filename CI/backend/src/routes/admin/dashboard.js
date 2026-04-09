import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { User } from "../../models/User.js";
import { Assessment } from "../../models/Assessment.js";
import { Job } from "../../models/Job.js";
import { Course } from "../../models/Course.js";
import { Feedback } from "../../models/Feedback.js";
import { Career } from "../../models/Career.js";
import { Activity } from "../../models/Activity.js";

const router = Router();

// GET /api/admin/dashboard/stats
router.get("/stats", adminOnly, async (req, res) => {
  try {
    const [users, assessments, jobs, courses, feedback, careers] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Assessment.countDocuments(),
      Job.countDocuments(),
      Course.countDocuments(),
      Feedback.countDocuments(),
      Career.countDocuments()
    ]);
    res.json({ users, assessments, jobs, courses, feedback, careers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
});

// GET /api/admin/dashboard/recent-users
router.get("/recent-users", adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email status createdAt");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recent users", error: err.message });
  }
});

// GET /api/admin/dashboard/user-growth?range=weekly|monthly
router.get("/user-growth", adminOnly, async (req, res) => {
  try {
    const { range = "weekly" } = req.query;
    const days = range === "monthly" ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const users = await User.find({
      role: "user",
      createdAt: { $gte: startDate }
    }).select("createdAt");

    // Group by date
    const grouped = {};
    users.forEach((u) => {
      const day = u.createdAt.toISOString().split("T")[0];
      grouped[day] = (grouped[day] || 0) + 1;
    });

    const labels = [];
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      labels.push(key);
      data.push(grouped[key] || 0);
    }

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch growth data", error: err.message });
  }
});

// GET /api/admin/dashboard/recent-activity
router.get("/recent-activity", adminOnly, async (req, res) => {
  try {
    const activity = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name");
    res.json({ activity });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity", error: err.message });
  }
});

export default router;
