import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { User } from "../../models/User.js";
import { Assessment } from "../../models/Assessment.js";
import { Job } from "../../models/Job.js";
import { Course } from "../../models/Course.js";
import { Feedback } from "../../models/Feedback.js";
import { Career } from "../../models/Career.js";
import { Activity } from "../../models/Activity.js";
import { Profile } from "../../models/Profile.js";
import { Skill } from "../../models/Skill.js";

const router = Router();

// GET /api/admin/dashboard/stats
router.get("/stats", adminOnly, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id").lean();
    const adminIds = admins.map(a => a._id);

    const activeUsersUnique = await Activity.distinct("user", {
      action: "logged in",
      user: { $nin: adminIds }
    });

    let activeUsersCount = activeUsersUnique.length;
    if (activeUsersCount === 0) {
      activeUsersCount = await User.countDocuments({ role: "user", status: "Active" });
    }
    if (activeUsersCount === 0) {
      activeUsersCount = await User.countDocuments({ role: "user" });
    }

    const [jobs, courses, feedbacks, aiActivities, assessmentActivities, profiles] = await Promise.all([
      Job.countDocuments(),
      Course.countDocuments(),
      Feedback.find().select("rating").lean(),
      Activity.countDocuments({ type: "ai" }),
      Activity.countDocuments({ type: { $in: ["assessment", "interview"] } }),
      Profile.find().select("preferredRole skills.technicalSkills").lean()
    ]);

    // Calculate avg feedback
    const totalFeedback = feedbacks.length;
    const avgFeedback = totalFeedback > 0 
      ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFeedback).toFixed(1)
      : 0;

    // Aggregate Most Selected Career Paths
    const roleCounts = {};
    const skillCounts = {};

    profiles.forEach(p => {
      if (p.preferredRole) {
        roleCounts[p.preferredRole] = (roleCounts[p.preferredRole] || 0) + 1;
      }
      if (p.skills && p.skills.technicalSkills) {
        const skillsArray = p.skills.technicalSkills.split(',').map(s => s.trim()).filter(s => s);
        skillsArray.forEach(s => {
          skillCounts[s] = (skillCounts[s] || 0) + 1;
        });
      }
    });

    const topCareerPaths = Object.entries(roleCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get AI requests today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const aiRequestsToday = await Activity.countDocuments({
      type: { $in: ["ai", "assessment"] },
      createdAt: { $gte: startOfToday }
    });

    res.json({ 
      users: activeUsersCount, 
      aiRequestsToday,
      mockInterviews: assessmentActivities,
      feedbackCount: totalFeedback,
      topCareerPaths,
      topSkills
    });
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
    const admins = await User.find({ role: "admin" }).select("_id").lean();
    const adminIds = admins.map(a => a._id);

    // Fetch more items to allow for deduplication, and explicitly filter out internal AI steps
    const rawActivity = await Activity.find({ 
      user: { $nin: adminIds },
      type: { $ne: "ai" }
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "name")
      .lean();

    const deduplicated = [];
    let lastUserStr = "";
    let lastAction = "";
    let lastTarget = "";

    for (const act of rawActivity) {
      if (!act.user) continue;

      const currentUserStr = act.user._id.toString();
      const currentAction = act.action;
      const currentTarget = act.target;

      // Skip consecutive identical activities by the same user
      const isDuplicate = 
        currentUserStr === lastUserStr && 
        currentAction === lastAction && 
        currentTarget === lastTarget;

      if (!isDuplicate) {
        deduplicated.push(act);
        lastUserStr = currentUserStr;
        lastAction = currentAction;
        lastTarget = currentTarget;
      }

      // We only need 10 for the UI
      if (deduplicated.length >= 10) break;
    }

    res.json({ activity: deduplicated });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity", error: err.message });
  }
});

// GET /api/admin/dashboard/logged-in-users
router.get("/logged-in-users", adminOnly, async (req, res) => {
  try {
    const activeUsers = await User.find({ role: "user", isOnline: true })
      .sort({ lastActiveAt: -1 })
      .limit(5)
      .select("name email status lastActiveAt")
      .lean();

    const loggedInUsers = activeUsers.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      status: u.status,
      loginTime: u.lastActiveAt
    }));

    // Fallback if no login activities exist yet (e.g. fresh DB)
    if (loggedInUsers.length === 0) {
      const normalUsers = await User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email status createdAt")
        .lean();
      
      normalUsers.forEach(u => {
        loggedInUsers.push({
          _id: u._id,
          name: u.name,
          email: u.email,
          status: u.status,
          loginTime: u.createdAt
        });
      });
    }

    res.json({ users: loggedInUsers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logged-in users", error: err.message });
  }
});

export default router;
