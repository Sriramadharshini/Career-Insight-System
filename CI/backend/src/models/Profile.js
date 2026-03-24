import mongoose from "mongoose";

const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    profilePhoto: { type: String, default: "" },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    location: { type: String, required: true, trim: true },
    linkedin: { type: String, default: "", trim: true },
    gender: { type: String, default: "", trim: true },
    nationality: { type: String, default: "", trim: true },
    dateOfBirth: { type: String, default: "", trim: true },
    portfolio: { type: String, default: "", trim: true },
    languages: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    university: { type: String, default: "", trim: true },
    degree: { type: String, default: "", trim: true },
    fieldOfStudy: { type: String, default: "", trim: true },
    graduationYear: { type: String, default: "", trim: true },
    cgpa: { type: String, default: "", trim: true },
    startYear: { type: String, default: "", trim: true },
    endYear: { type: String, default: "", trim: true },
    studyMode: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const skillsSchema = new mongoose.Schema(
  {
    technicalSkills: { type: String, default: "", trim: true },
    softSkills: { type: String, default: "", trim: true },
    tools: { type: String, default: "", trim: true },
    languages: { type: String, default: "", trim: true },
    experienceLevel: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    domain: { type: String, default: "", trim: true },
    technologiesUsed: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const internshipSchema = new mongoose.Schema(
  {
    company: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true },
    technologiesUsed: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    issueMonth: { type: String, default: "", trim: true },
    issueYear: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    personalInfo: {
      type: personalInfoSchema,
      required: true
    },
    education: {
      type: educationSchema,
      default: () => ({})
    },
    skills: {
      type: skillsSchema,
      default: () => ({})
    },
    projects: { type: [projectSchema], default: [] },
    internships: { type: [internshipSchema], default: [] },
    achievements: { type: [String], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    professionalSummary: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    careerLevel: {
      type: String,
      enum: ["fresher", "experienced"],
      required: true
    },
    preferredRole: { type: String, required: true, trim: true },
    template: {
      type: String,
      enum: ["modern", "professional", "compact"],
      default: "modern"
    }
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
