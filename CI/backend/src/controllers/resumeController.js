import { Resume } from "../models/Resume.js";
import { analyzeResume } from "../utils/atsScorer.js";
import { extractResumeText } from "../utils/extractResumeText.js";
import fs from "fs";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const targetRole = req.body.targetRole;
    const extractedText = await extractResumeText(req.file.path);
    const analysis = analyzeResume(extractedText, targetRole);

    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      filePath: req.file.path,
      extractedText,
      ...analysis
    });

    return res.status(201).json(resume);
  } catch (error) {
    console.error("Upload error:", error);
    fs.appendFileSync("ai_debug.log", `\n[${new Date().toISOString()}] AI Error: ${error.message}\nStack: ${error.stack}\n`);
    return res.status(500).json({
      message: "Resume upload or analysis failed.",
      error: error.message
    });
  }
};

export const getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(resume);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch resume", error: error.message });
  }
};

export const analyzeCurrentProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) return res.status(400).json({ message: "Profile data is required" });

    // Construct a text representation for the ATS scorer
    const p = profile.personalInfo || {};
    const edu = profile.education || {};
    const skills = profile.skills || {};
    
    let text = `
      ${p.fullName || "User"} | ${p.email || ""} | ${p.location || ""}
      PROFESSIONAL SUMMARY: ${profile.professionalSummary || "Not provided"}
      
      EXPERIENCE:
      ${(profile.internships || []).filter(i => i.company || i.role).map(i => `${i.role || "Role"} at ${i.company || "Company"}. ${i.duration || ""}. ${i.technologiesUsed || ""}`).join("\n") || "No internships/experience listed."}
      
      PROJECTS:
      ${(profile.projects || []).filter(p => p.title).map(p => `${p.title}. ${p.description || ""}. Tech: ${p.technologiesUsed || ""}`).join("\n") || "No projects listed."}
      
      SKILLS:
      Technical: ${typeof skills.technicalSkills === "string" ? skills.technicalSkills : (skills.technicalSkills || []).join(", ")}
      Soft: ${typeof skills.softSkills === "string" ? skills.softSkills : (skills.softSkills || []).join(", ")}
      Tools: ${typeof skills.tools === "string" ? skills.tools : (skills.tools || []).join(", ")}
      
      EDUCATION:
      ${edu.university || "University"}. ${edu.degree || "Degree"} in ${edu.fieldOfStudy || "Field"}. Grad: ${edu.graduationYear || edu.endYear || "N/A"}. CGPA: ${edu.cgpa || "N/A"}
      
      ACHIEVEMENTS:
      ${typeof profile.achievements === "string" ? profile.achievements : (profile.achievements || []).join(", ")}
    `;

    const analysis = analyzeResume(text, profile.preferredRole);

    // Save this as a "Resume" record for the user so suggestions work
    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id, isFromProfile: true },
      {
        user: req.user._id,
        originalName: "Generated from Profile",
        extractedText: text,
        filePath: "profile-generated", 
        isFromProfile: true,
        ...analysis
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(resume);
  } catch (error) {
    console.error("Profile analysis error:", error);
    return res.status(500).json({ message: "Analysis failed", error: error.message });
  }
};
