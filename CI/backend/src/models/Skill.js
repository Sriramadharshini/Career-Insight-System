import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "DevOps", "Design", "Soft Skill", "Other"],
      default: "Other"
    },
    demandLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    avgSalaryImpact: { type: String, trim: true },
    relatedCareers: [{ type: String, trim: true }],
    trending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Skill = mongoose.model("Skill", skillSchema);
