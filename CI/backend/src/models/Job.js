import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    salaryRange: { type: String, trim: true },
    experience: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Remote"],
      default: "Full-time"
    },
    deadline: { type: Date },
    description: { type: String },
    applicationLink: { type: String, trim: true },
    status: { type: String, enum: ["Active", "Expired"], default: "Active" }
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
