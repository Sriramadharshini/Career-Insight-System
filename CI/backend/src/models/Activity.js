import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String, // e.g., "enrolled in", "applied for", "submitted", "registered"
      required: true
    },
    target: {
      type: String, // e.g., "React Course", "Frontend Developer Job"
      required: true
    },
    type: {
      type: String,
      enum: ["course", "job", "assessment", "user", "system", "ai", "resume", "interview", "career", "feedback", "community"],
      required: true
    }
  },
  { timestamps: true }
);
activitySchema.pre("save", async function(next) {
  try {
    const { SystemSetting } = await import("./SystemSetting.js");
    const settings = await SystemSetting.findOne().lean();
    if (settings && settings.analyticsTracking === false) {
      // Aborting save gracefully
      throw new Error("Analytics Tracking is currently disabled");
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const Activity = mongoose.model("Activity", activitySchema);
