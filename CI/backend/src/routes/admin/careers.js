import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { Career } from "../../models/Career.js";
import { Profile } from "../../models/Profile.js";

const router = Router();

// GET /api/admin/career-paths
router.get("/", adminOnly, async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json({ careers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch careers", error: err.message });
  }
});

// POST /api/admin/career-paths
router.post("/", adminOnly, async (req, res) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ message: "Career path created", career });
  } catch (err) {
    res.status(500).json({ message: "Failed to create career path", error: err.message });
  }
});

// PUT /api/admin/career-paths/:id
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json({ message: "Career path updated", career });
  } catch (err) {
    res.status(500).json({ message: "Failed to update career path", error: err.message });
  }
});

// DELETE /api/admin/career-paths/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json({ message: "Career path deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete career path", error: err.message });
  }
});

// GET /api/admin/career-paths/:id/users
router.get("/:id/users", adminOnly, async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    const users = await Profile.find({ preferredRole: career.name }).populate("user", "name email");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enrolled users", error: err.message });
  }
});

export default router;
