import { Router } from "express";
import { SystemSetting } from "../models/SystemSetting.js";

const router = Router();

// GET /api/settings/public
router.get("/public", async (req, res) => {
  try {
    let settings = await SystemSetting.findOne().lean();
    
    if (!settings) {
      settings = await SystemSetting.create({});
    }

    // Return only non-sensitive configuration needed by the frontend
    res.json({
      maintenanceMode: settings.maintenanceMode,
      allowRegistration: settings.allowRegistration,
      communityAccess: settings.communityAccess,
      resumeUploads: settings.resumeUploads,
      feedbackEnabled: settings.feedbackEnabled,
      profileVerification: settings.profileVerification,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch public settings", error: err.message });
  }
});

export default router;
