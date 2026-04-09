import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { Job } from "../../models/Job.js";

const router = Router();

// GET /api/admin/jobs
router.get("/", adminOnly, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// POST /api/admin/jobs
router.post("/", adminOnly, async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ message: "Job posted", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
});

// PUT /api/admin/jobs/:id
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
});

// DELETE /api/admin/jobs/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
});

// GET /api/admin/jobs/:id/applicants
router.get("/:id/applicants", adminOnly, async (req, res) => {
  try {
    // Placeholder for applicants logic
    res.json({ applicants: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
});

// PUT /api/admin/jobs/:id/applicants/:userId
router.put("/:id/applicants/:userId", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    res.json({ message: `Applicant status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update applicant status", error: err.message });
  }
});

export default router;
