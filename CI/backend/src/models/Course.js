import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ["Udemy", "Coursera", "YouTube", "Free", "Other"],
      default: "Other"
    },
    url: { type: String, trim: true },
    price: { type: String, trim: true, default: "Free" },
    duration: { type: String, trim: true },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    relatedCareer: { type: String, trim: true },
    description: { type: String },
    thumbnailUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
