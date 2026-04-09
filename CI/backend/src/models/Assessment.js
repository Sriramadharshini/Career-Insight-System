import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  weightage: { type: Number, default: 0 }
});

const assessmentSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    category: {
      type: String,
      enum: ["Technical Skills", "Soft Skills", "Interest Areas", "Work Style"],
      required: true
    },
    options: [optionSchema],
    relatedCareers: [{ type: String }]
  },
  { timestamps: true }
);

export const Assessment = mongoose.model("Assessment", assessmentSchema);
