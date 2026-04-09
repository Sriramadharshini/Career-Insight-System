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
      enum: ["course", "job", "assessment", "user", "system"],
      required: true
    }
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
