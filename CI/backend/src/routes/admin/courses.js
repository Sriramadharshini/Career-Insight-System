import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { Course } from "../../models/Course.js";

const router = Router();

// GET /api/admin/courses
router.get("/", adminOnly, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses", error: err.message });
  }
});

// POST /api/admin/courses
router.post("/", adminOnly, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    res.status(500).json({ message: "Failed to create course", error: err.message });
  }
});

// PUT /api/admin/courses/:id
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated", course });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course", error: err.message });
  }
});

// DELETE /api/admin/courses/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course", error: err.message });
  }
});

// GET /api/admin/courses/:id/students
router.get("/:id/students", adminOnly, async (req, res) => {
  try {
    // Placeholder for students enrolled in this course
    res.json({ students: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

export default router;
