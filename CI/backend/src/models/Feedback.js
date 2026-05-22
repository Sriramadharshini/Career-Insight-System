import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, trim: true },
    userEmail: { type: String, trim: true, lowercase: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    status: { type: String, enum: ["Pending", "Resolved", "Archived"], default: "Pending" }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
