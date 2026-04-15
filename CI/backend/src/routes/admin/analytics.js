import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { User } from "../../models/User.js";
import { Career } from "../../models/Career.js";
import { Course } from "../../models/Course.js";
import { Activity } from "../../models/Activity.js";
import { Job } from "../../models/Job.js";
import { Feedback } from "../../models/Feedback.js";


const router = Router();

// GET /api/admin/analytics/overview?period=
router.get("/overview", adminOnly, async (req, res) => {
  try {
    // page views, unique users, avg session time, bounce rate (placeholders)
    res.json({
      pageViews: 12500,
      uniqueUsers: 3400,
      avgSessionTime: "4:25",
      bounceRate: "32%"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch overview analytics", error: err.message });
  }
});

// GET /api/admin/analytics/user-activity?period=
router.get("/user-activity", adminOnly, async (req, res) => {
  try {
    const { period = "7" } = req.query;
    const days = parseInt(period);
    // Group DAU by day
    res.json({
      labels: Array.from({ length: days }, (_, i) => `Day ${i + 1}`),
      data: Array.from({ length: days }, () => Math.floor(Math.random() * 500) + 100)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity analytics", error: err.message });
  }
});

// GET /api/admin/analytics/enrollment-trend?period=
router.get("/enrollment-trend", adminOnly, async (req, res) => {
  try {
    res.json({
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      data: [45, 52, 63, 75, 90]
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enrollment trend", error: err.message });
  }
});

// GET /api/admin/analytics/role-distribution
router.get("/role-distribution", adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("role").lean();
    const dist = {};
    users.forEach(u => dist[u.role] = (dist[u.role] || 0) + 1);
    res.json({
      labels: Object.keys(dist),
      data: Object.values(dist)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch role distribution", error: err.message });
  }
});

// GET /api/admin/analytics/top-career-paths
router.get("/top-career-paths", adminOnly, async (req, res) => {
  try {
    res.json([
      { name: "Frontend Developer", count: 120 },
      { name: "UI/UX Designer", count: 95 },
      { name: "Data Scientist", count: 80 }
    ]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top career paths", error: err.message });
  }
});

// GET /api/admin/analytics/top-courses
router.get("/top-courses", adminOnly, async (req, res) => {
  try {
    res.json([
      { name: "React for Beginners", revenue: 4500 },
      { name: "Advanced Python", revenue: 3200 },
      { name: "Intro to ML", revenue: 2800 }
    ]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top courses", error: err.message });
  }
});

// GET /api/admin/analytics/careers
router.get("/careers", adminOnly, async (req, res) => {
  try {
    const occupations = await Career.find().select("industry").lean();
    const dist = {};
    occupations.forEach(c => {
      const field = c.industry || "Other";
      dist[field] = (dist[field] || 0) + 1;
    });
    res.json({
      labels: Object.keys(dist),
      data: Object.values(dist)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch career analytics", error: err.message });
  }
});

// GET /api/admin/analytics/jobs
router.get("/jobs", adminOnly, async (req, res) => {
  try {
    const jobs = await Job.find().select("jobType").lean();
    const dist = {};
    jobs.forEach(j => {
      const type = j.jobType || "Other";
      dist[type] = (dist[type] || 0) + 1;
    });
    res.json({
      labels: Object.keys(dist),
      data: Object.values(dist)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job analytics", error: err.message });
  }
});

// GET /api/admin/analytics/courses
router.get("/courses", adminOnly, async (req, res) => {
  try {
    const courseCount = await Course.countDocuments();
    // Placeholder enrollment trend
    res.json({
      total: courseCount,
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      data: [12, 18, 25, 30, 42]
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch course analytics", error: err.message });
  }
});

// GET /api/admin/analytics/feedback
router.get("/feedback", adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().select("rating").lean();
    const total = feedbacks.length;
    const average = total > 0 
      ? (feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / total).toFixed(1)
      : 0;
    
    const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    feedbacks.forEach(f => {
      if (f.rating >= 1 && f.rating <= 5) {
        distribution[f.rating] = (distribution[f.rating] || 0) + 1;
      }
    });

    res.json({
      total,
      average: Number(average),
      distribution
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback analytics", error: err.message });
  }
});

export default router;

