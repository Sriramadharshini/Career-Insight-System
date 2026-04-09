import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    target: { type: String, enum: ["All Users", "Specific User"], default: "All Users" },
    targetEmail: { type: String, trim: true, lowercase: true },
    type: {
      type: String,
      enum: ["Info", "Warning", "Success", "Announcement"],
      default: "Info"
    },
    status: { type: String, enum: ["sent", "scheduled"], default: "sent" }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
