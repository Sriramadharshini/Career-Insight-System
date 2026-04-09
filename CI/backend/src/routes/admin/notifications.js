import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { Notification } from "../../models/Notification.js";

const router = Router();

// GET /api/admin/notifications?filter=
router.get("/", adminOnly, async (req, res) => {
  try {
    const { filter = "all" } = req.query;
    const query = {};
    if (filter === "unread") query.read = false;
    // other filters can be added here
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
});

// PUT /api/admin/notifications/:id/read
router.put("/:id/read", adminOnly, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification", error: err.message });
  }
});

// PUT /api/admin/notifications/read-all
router.put("/read-all", adminOnly, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications", error: err.message });
  }
});

// DELETE /api/admin/notifications/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification", error: err.message });
  }
});

export default router;
