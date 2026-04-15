import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectDatabase } from "./config/db.js";
import { ensureDefaultAdmin } from "./scripts/seedAdmin.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// Admin Routes
import adminDashboard from "./routes/admin/dashboard.js";
import adminUsers from "./routes/admin/users.js";
import adminCareers from "./routes/admin/careers.js";
import adminAssessments from "./routes/admin/assessments.js";
import adminJobs from "./routes/admin/jobs.js";
import adminCourses from "./routes/admin/courses.js";
import adminNotifications from "./routes/admin/notifications.js";
import adminAnalytics from "./routes/admin/analytics.js";
import adminSkills from "./routes/admin/skills.js";
import adminFeedback from "./routes/admin/feedback.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const allowedOrigins = new Set([
  clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({ name: "Career Insight API", status: "running", clientUrl });
});

// ── Existing Routes ──────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);

// ── Admin Routes ─────────────────────────────────────────────
app.use("/api/admin/dashboard", adminDashboard);
app.use("/api/admin/users", adminUsers);
app.use("/api/admin/careers", adminCareers);
app.use("/api/admin/assessments", adminAssessments);
app.use("/api/admin/jobs", adminJobs);
app.use("/api/admin/courses", adminCourses);
app.use("/api/admin/notifications", adminNotifications);
app.use("/api/admin/analytics", adminAnalytics);
app.use("/api/admin/skills", adminSkills);
app.use("/api/admin/feedback", adminFeedback);

connectDatabase()
  .then(async () => {
    await ensureDefaultAdmin();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
