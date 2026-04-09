import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { Skill } from "../../models/Skill.js";

const router = Router();

// GET /api/admin/skills
router.get("/", adminOnly, async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch skills", error: err.message });
  }
});

// POST /api/admin/skills
router.post("/", adminOnly, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ message: "Skill added", skill });
  } catch (err) {
    res.status(500).json({ message: "Failed to add skill", error: err.message });
  }
});

// PUT /api/admin/skills/:id
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill updated", skill });
  } catch (err) {
    res.status(500).json({ message: "Failed to update skill", error: err.message });
  }
});

// DELETE /api/admin/skills/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete skill", error: err.message });
  }
});

// GET /api/admin/skills/trending
router.get("/trending", adminOnly, async (req, res) => {
  try {
    const trending = await Skill.find({ trending: true }).limit(5);
    res.json({ trending });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trending skills", error: err.message });
  }
});

export default router;
