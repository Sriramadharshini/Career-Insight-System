import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    salaryRange: { type: String, trim: true },
    requiredSkills: [{ type: String, trim: true }],
    description: { type: String },
    growthRate: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    jobRoles: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const Career = mongoose.model("Career", careerSchema);
