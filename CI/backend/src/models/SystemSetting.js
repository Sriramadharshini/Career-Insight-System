import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    aiEnabled: { type: Boolean, default: true },
    feedbackEnabled: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
    analyticsTracking: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
    
    // User Management
    allowRegistration: { type: Boolean, default: true },
    communityAccess: { type: Boolean, default: true },
    resumeUploads: { type: Boolean, default: true },
    profileVerification: { type: Boolean, default: false },
    
    // AI Configuration
    highConfidenceOnly: { type: Boolean, default: false },
    enhancedSensitivity: { type: Boolean, default: true },
    strictAiLimits: { type: Boolean, default: false },
    deepAnalysisEnabled: { type: Boolean, default: true },
    smartRecommendations: { type: Boolean, default: true },
    responseMonitoring: { type: Boolean, default: true },

    platformVersion: { type: String, default: "v2.5.0" },
    lastBackup: { type: Date, default: Date.now },
    sslActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);
