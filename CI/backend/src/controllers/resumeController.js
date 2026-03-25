import { Resume } from "../models/Resume.js";
import { analyzeResume } from "../utils/atsScorer.js";
import { extractResumeText } from "../utils/extractResumeText.js";
import { analyzeResumeWithAI, evaluateInterviewAnswersWithAI } from '../utils/aiAnalyzer.js';
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

export const evaluateInterview = async (req, res) => {
  try {
    const { role, qna } = req.body;
    if (!qna || !Array.isArray(qna)) {
      return res.status(400).json({ success: false, message: "Invalid answers payload." });
    }

    try {
      if (process.env.GEMINI_API_KEY) {
        const aiResults = await evaluateInterviewAnswersWithAI(qna, role || "Professional");
        
        if (Array.isArray(aiResults) && aiResults.length === qna.length) {
          let totalScore = 0;
          const evaluatedAnswers = qna.map((item, idx) => {
            const aiRes = aiResults[idx];
            totalScore += aiRes.score || 0;
            return {
              question: item.question,
              userAnswer: item.answer,
              timeTaken: item.time || 0,
              isCorrect: aiRes.isCorrect || false,
              score: aiRes.score || 0,
              feedback: aiRes.feedback || "Good effort.",
              expectedAnswer: aiRes.expectedAnswer || "No specific model answer generated."
            };
          });

          let maxPossibleScore = qna.length * 10;
          let percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
          let overallFeedback = percentage >= 80 ? "Excellent performance! You demonstrated strong knowledge." 
                             : percentage >= 60 ? "Good job, but there's room for improvement in technical depth." 
                             : "You need to practice more and focus on core technical concepts.";

          return res.json({
            success: true,
            results: {
              totalScore: Math.min(percentage, 100),
              totalQuestions: qna.length,
              evaluatedAnswers,
              overallFeedback
            }
          });
        }
      }
    } catch (aiError) {
      console.error("AI Evaluation failed, falling back to heuristic:", aiError);
    }

    let totalScore = 0;
    
    // Heuristic Fallback
    const evaluatedAnswers = qna.map(item => {
      const q = (item.question || "").toLowerCase();
      const a = (item.answer || "").toLowerCase();
      const time = item.time || 0;
      
      let isCorrect = false;
      let feedback = "Needs improvement in technical explanation. Your answer needs more depth and specific details.";
      let score = 0;
      let expectedAnswer = "A comprehensive answer should explicitly cover the core architecture, provide a real-world use case, and outline best practices regarding security, scalability, and performance.";

      if (q.includes("react")) expectedAnswer = "To optimize React performance, you should utilize useMemo and useCallback to prevent unnecessary re-renders, implement React.lazy for code splitting, avoid inline functions in render, and use a dedicated state management library efficiently.";
      if (q.includes("sql")) expectedAnswer = "A strong database answer involves discussing proper indexing, normalized vs denormalized schemas where appropriate, and using efficient JOINs while avoiding N+1 query patterns.";
      if (q.includes("api")) expectedAnswer = "A secure REST API implies using HTTPS, implementing JWT or OAuth for authentication, rate limiting to prevent abuse, input validation, and proper CORS configurations.";

      if (a.length > 20) {
        if (q.includes("react") && (a.includes("state") || a.includes("props") || a.includes("hook") || a.includes("component"))) {
          isCorrect = true; score = 10; feedback = "Good understanding of the topic. Excellent demonstration of React fundamentals.";
        } else if (q.includes("sql") && (a.includes("select") || a.includes("join") || a.includes("table") || a.includes("database"))) {
          isCorrect = true; score = 10; feedback = "Good understanding of the topic. Clear explanation of database concepts.";
        } else if (a.length > 50) {
          isCorrect = true; score = 8; feedback = "Good understanding of the topic. Detailed response, though you could mention more specific technical keywords.";
        } else {
          score = 4; feedback = "Needs improvement in technical explanation. Try to expand on your answer with practical examples.";
        }
      } else if (a.length > 0) {
        score = 2; feedback = "Needs improvement in technical explanation. Your answer is too brief to correctly assess your knowledge.";
      } else {
        score = 0; feedback = "Needs improvement in technical explanation. No answer provided.";
      }
      
      totalScore += score;
      
      return {
        question: item.question,
        userAnswer: item.answer,
        timeTaken: time,
        isCorrect,
        score,
        feedback,
        expectedAnswer
      };
    });
    
    const accuracy = Math.round((totalScore / (qna.length * 10)) * 100) || 0;
    const avgTime = Math.round(qna.reduce((acc, curr) => acc + curr.timeTaken, 0) / (qna.length || 1));
    
    let confidenceLevel = "Beginner";
    if (accuracy > 75) confidenceLevel = "Advanced";
    else if (accuracy > 40) confidenceLevel = "Intermediate";
    
    return res.status(200).json({
      role,
      totalScore: accuracy,
      confidenceLevel,
      avgTime,
      evaluatedAnswers,
      strongAreas: accuracy > 50 ? ["Technical Knowledge", "Communication Skills"] : ["Basic Concepts"],
      improvementAreas: accuracy < 80 ? ["Deep-dive Technical Explanations", "Providing System Examples"] : ["Advanced Architecture Patterns"]
    });
    
  } catch (error) {
    console.error("Interview Evaluation Error:", error);
    return res.status(500).json({ message: "Failed to evaluate interview", error: error.message });
  }
};
