import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { Assessment } from "../../models/Assessment.js";

const router = Router();

// GET /api/admin/assessments
router.get("/", adminOnly, async (req, res) => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 });
    res.json({ assessments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assessments", error: err.message });
  }
});

// POST /api/admin/assessments
router.post("/", adminOnly, async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json({ message: "Assessment created", assessment });
  } catch (err) {
    res.status(500).json({ message: "Failed to create assessment", error: err.message });
  }
});

// PUT /api/admin/assessments/:id
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });
    res.json({ message: "Assessment updated", assessment });
  } catch (err) {
    res.status(500).json({ message: "Failed to update assessment", error: err.message });
  }
});

// DELETE /api/admin/assessments/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });
    res.json({ message: "Assessment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete assessment", error: err.message });
  }
});

// GET /api/admin/assessments/:id/submissions
router.get("/:id/submissions", adminOnly, async (req, res) => {
  try {
    // Return empty for now as placeholder for submissions logic
    res.json({ submissions: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submissions", error: err.message });
  }
});

// PUT /api/admin/assessments/:id/status
router.put("/:id/status", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `Assessment status updated to ${status}`, assessment });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

export default router;
