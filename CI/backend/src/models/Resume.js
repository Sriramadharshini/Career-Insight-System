import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    originalName: { type: String, required: true },
    filePath: { type: String }, // Optional for profile-based analysis
    isFromProfile: { type: Boolean, default: false },
    extractedText: { type: String, required: true },
    atsScore: { type: Number, required: true },
    feedback: { type: [String], default: [] },
    matchedKeywords: { type: [String], default: [] },
    extractedSkills: { type: [String], default: [] },
    missingGaps: { type: [String], default: [] },
    recommendedRoles: { type: [String], default: [] },
    interviewQuestions: { type: [String], default: [] },
    sectionScores: {
      type: Map,
      of: Number,
      default: {}
    },
    timelineGaps: { type: [String], default: [] },
    skillReadinessIndex: { type: Number, default: 0 },
    gapAnalysis: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    learningPathways: { type: [String], default: [] },
    careerTrack: { type: String, default: "fullstack" },
    nextLevelSkills: { type: [String], default: [] },
    suggestedResources: { type: mongoose.Schema.Types.Mixed, default: {} },
    roleSpecificInsights: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
