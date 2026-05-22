import { Router } from "express";
import { adminOnly } from "../../middleware/adminMiddleware.js";
import { SystemSetting } from "../../models/SystemSetting.js";

const router = Router();

// Helper to get or create settings
const getSettingsDoc = async () => {
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = await SystemSetting.create({});
  }
  return settings;
};

// GET /api/admin/settings
router.get("/", adminOnly, async (req, res) => {
  try {
    const settings = await getSettingsDoc();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch system settings", error: err.message });
  }
});

// PUT /api/admin/settings
router.put("/", adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    let settings = await getSettingsDoc();
    
    // Only allow updating boolean flags and predefined fields
    const allowedKeys = [
      'maintenanceMode', 'aiEnabled', 'feedbackEnabled', 
      'notificationsEnabled', 'analyticsTracking', 'darkMode',
      'allowRegistration', 'communityAccess', 'resumeUploads', 'profileVerification',
      'highConfidenceOnly', 'enhancedSensitivity', 'strictAiLimits', 
      'deepAnalysisEnabled', 'smartRecommendations', 'responseMonitoring'
    ];
    
    allowedKeys.forEach(key => {
      if (updates[key] !== undefined) {
        settings[key] = updates[key];
      }
    });

    // You can also simulate a backup trigger by updating `lastBackup`
    if (updates.triggerBackup) {
      settings.lastBackup = new Date();
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to update system settings", error: err.message });
  }
});

export default router;
