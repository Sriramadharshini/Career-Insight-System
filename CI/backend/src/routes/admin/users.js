import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { User } from "../../models/User.js";
import { Activity } from "../../models/Activity.js";

const router = Router();

// GET /api/admin/users
router.get("/", adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "", role = "" } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (status) query.status = status;
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-password");

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// GET /api/admin/users/:id
router.get("/:id", adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

// POST /api/admin/users
router.post("/", adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Note: Password hashing should be handled in model pre-save if not already
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
});

// PUT /api/admin/users/:id
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

// PUT /api/admin/users/:id/status
router.put("/:id/status", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User status updated to ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

// PUT /api/admin/users/:id/role
router.put("/:id/role", adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role", error: err.message });
  }
});

// GET /api/admin/users/:id/activity
router.get("/:id/activity", adminOnly, async (req, res) => {
  try {
    const activity = await Activity.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json({ activity });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user activity", error: err.message });
  }
});

// POST /api/admin/users/export
router.post("/export", adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    // In a real app, this would generate a CSV and send it. 
    // Here we'll just return the data for the frontend to handle as requested (Export CSV button).
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to export users", error: err.message });
  }
});

export default router;
