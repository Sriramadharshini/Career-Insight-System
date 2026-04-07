import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

let genAI = null;

// ── Helper to clean JSON response from AI (strips markdown backticks) ──
const cleanJsonResponse = (text) => {
  if (!text) return "";
  // Remove markdown code blocks like ```json ... ``` or ``` ... ```
  return text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, "$1").trim();
};

const FALLBACK_JOBS = [
  {
    title: "Junior Frontend Developer",
    type: "Full-time",
    salary: "$60k - $85k",
    exp: "0-2 yrs",
    location: "Remote",
    skills: ["React", "JavaScript", "CSS"],
    match: 85,
    hot: true
  },
  {
    title: "Associate Software Engineer",
    type: "Full-time",
    salary: "$70k - $90k",
    exp: "0-1 yrs",
    location: "Hybrid (Bangalore)",
    skills: ["Java", "Spring Boot", "SQL"],
    match: 80,
    hot: false
  },
  {
    title: "Junior Web Developer",
    type: "Full-time",
    salary: "$55k - $75k",
    exp: "0-2 yrs",
    location: "Remote",
    skills: ["HTML", "CSS", "JavaScript", "Vue.js"],
    match: 88,
    hot: true
  },
  {
    title: "Systems Engineer Trainee",
    type: "Full-time",
    salary: "$40k - $55k",
    exp: "0 yrs (Fresher)",
    location: "On-site (Chennai)",
    skills: ["Python", "Networking", "Linux"],
    match: 75,
    hot: false
  },
  {
    title: "AI/ML Intern",
    type: "Internship",
    salary: "$30k - $45k",
    exp: "0-1 yrs",
    location: "Remote",
    skills: ["Python", "TensorFlow", "Data Analysis"],
    match: 92,
    hot: true
  }
];


export const analyzeResumeWithAI = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const prompt = `
    You are an expert AI software architect and career analytics expert.
    Analyze the following resume text and provide a highly detailed, strict JSON response. 
    Do NOT wrap the response in markdown code blocks (\`\`\`json ... \`\`\`), output raw JSON only.
    
    Extract and structure the response strictly using this JSON schema:
    {
      "atsScore": Number (0-100),
      "feedback": Array of strings (What needs improvement),
      "matchedKeywords": Array of strings (e.g., "React", "Node.js", "Agile"),
      "extractedSkills": Array of strings (All hard and soft skills found),
      "missingGaps": Array of strings (Missing critical skills for typical roles inferred from the resume),
      "recommendedRoles": Array of strings (e.g., "Frontend Developer", "Data Analyst"),
      "interviewQuestions": Array of strings (List 3-5 technical or behavioral questions based on their experience),
      "sectionScores": {
        "education": Number (0-20),
        "experience": Number (0-40),
        "skills": Number (0-20),
        "formatting": Number (0-20)
      },
      "timelineGaps": Array of strings (Any notable gaps in education or employment history, e.g. "Gap: Dec 2021 to Mar 2022"),
      "skillReadinessIndex": Number (0-100) (How well the candidate fits current industry standard job requirements based on their skills),
      "gapAnalysis": Array of strings (Detailed explanation of what skills or knowledge are missing for their targeted roles),
      "certifications": Array of strings (List of certifications found, or empty array),
      "learningPathways": Array of strings (Recommended courses, topics, or certifications to fill the gaps)
    }

    Resume Text:
    """
    ${resumeText}
    """
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const outputText = result.response.text();
    
    try {
      const cleaned = cleanJsonResponse(outputText);
      const parsedData = JSON.parse(cleaned || "{}");
      return parsedData;
    } catch (parseError) {
      console.warn("AI Analysis JSON Parse Error, returning null");
      fs.appendFileSync("ai_debug.log", `\n[${new Date().toISOString()}] JSON PARSE ERROR (Analysis)\nRaw AI Output:\n${outputText}\n`);
      return null;
    }

  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze resume with AI.");
  }
};

export const evaluateInterviewAnswersWithAI = async (answers, role) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const prompt = `
    You are an expert technical interviewer evaluating a candidate for a "${role}" role.
    Analyze the following list of interview questions and the candidate's answers.
    Provide a highly detailed, strict JSON response.
    Do NOT wrap the response in markdown code blocks (\`\`\`json ... \`\`\`), output raw JSON only.
    
    Extract and structure the response strictly using this JSON schema:
    [
      {
        "isCorrect": Boolean,
        "feedback": String,
        "expectedAnswer": String,
        "score": Number 
      }
    ]
    Note: 'score' must be a Number between 0 and 10. 'expectedAnswer' MUST be a highly relevant, comprehensive, and role-specific correct answer to the exact question asked, formatted professionally. It should not be generic; it must directly and accurately answer the prompt as an expert would.
    Ensure the array length exactly matches the number of questions provided.
    
    Questions and Candidate Answers:
    ${JSON.stringify(answers.map((a, i) => ({ q: a.question, a: a.answer })), null, 2)}
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const outputText = result.response.text();
    
    try {
      const cleaned = cleanJsonResponse(outputText);
      const parsedData = JSON.parse(cleaned || "[]");
      return parsedData;
    } catch (parseError) {
      console.warn("AI Interview JSON Parse Error, using empty fallback");
      fs.appendFileSync("ai_debug_interview.log", `\n[${new Date().toISOString()}] JSON PARSE ERROR (Interview)\nRaw AI Output:\n${outputText}\n`);
      return [];
    }

  } catch (error) {
    console.error("AI Interview Analysis Error:", error);
    throw new Error("Failed to analyze interview answers with AI.");
  }
};

export const generateCareerSuggestionsWithAI = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const prompt = `
    You are an expert career counselor and AI career coach with deep knowledge of the tech industry.
    Analyze the following resume text and generate highly personalized career growth suggestions.
    Do NOT wrap the response in markdown code blocks (\`\`\`json ... \`\`\`), output raw JSON only.

    Based on the skills, experience, education, and projects in the resume, provide a structured JSON response:
    {
      "recommendedRoles": ["Role 1", "Role 2", "Role 3"],
      "careerTrack": "One of: frontend | backend | fullstack | data | ai | cloud | mobile | design | security | qa",
      "roleSpecificInsights": [
        {
          "role": "Exact role title (e.g. Frontend Developer)",
          "trackKey": "One of: frontend | backend | fullstack | data | ai | cloud | mobile | design | security | qa",
          "summary": "2-3 sentence rationale for why this role fits the candidate perfectly, based on their resume.",
          "nextLevelSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
          "suggestedResources": {
            "websites": [
              { "name": "Website Name", "url": "https://exact-url.com", "focus": "What this resource teaches" },
              { "name": "Website Name 2", "url": "https://exact-url2.com", "focus": "What this resource teaches" },
              { "name": "Website Name 3", "url": "https://exact-url3.com", "focus": "What this resource teaches" },
              { "name": "Website Name 4", "url": "https://exact-url4.com", "focus": "What this resource teaches" },
              { "name": "Website Name 5", "url": "https://exact-url5.com", "focus": "What this resource teaches" }
            ],
            "youtube": [
              "Specific YouTube search query 1 for this role",
              "Specific YouTube search query 2 for this role",
              "Specific YouTube search query 3 for this role",
              "Specific YouTube search query 4 for this role",
              "Specific YouTube search query 5 for this role"
            ]
          }
        }
      ]
    }

    CRITICAL RULES — FOLLOW EXACTLY:
    1. ONLY recommend roles based on skills, technologies, and experience that are EXPLICITLY written in the resume. Do NOT infer or assume hidden skills.
    2. Rank the top 3 roles by strength of evidence (number of matching keywords and relevance of projects/experience).
    3. Only suggest "Full Stack Developer" if the resume has STRONG evidence of BOTH frontend (React/Angular/Vue/HTML/CSS) AND backend (Node/Express/Python/Java/APIs) skills — at least 3 keywords each side.
    4. nextLevelSkills must ONLY include skills the candidate does NOT already have (not mentioned in their resume).
    5. Website URLs must be real, well-known, and directly relevant to the role (e.g. reactjs.org, docs.python.org, cloud.google.com).
    6. YouTube queries must be specific (e.g. "React performance optimization tutorial 2025" not just "learn react").
    7. The trackKey must exactly match one of the allowed values.
    8. Provide exactly 3 roleSpecificInsights entries.

    Resume Text:
    """
    ${resumeText}
    """
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const outputText = result.response.text();

    try {
      const cleaned = cleanJsonResponse(outputText);
      const parsedData = JSON.parse(cleaned || "{}");
      return parsedData;
    } catch (parseError) {
      console.warn("AI Career JSON Parse Error, using null fallback");
      fs.appendFileSync("ai_debug.log", `\n[${new Date().toISOString()}] JSON PARSE ERROR (Career)\nRaw AI Output:\n${outputText}\n`);
      return null;
    }

  } catch (error) {
    console.error("AI Career Suggestions Error:", error);
    throw new Error("Failed to generate AI career suggestions.");
  }
};

// ── Video Interview Evaluation (no AI needed — smart heuristic based on timing) ──
export const evaluateVideoInterview = (questionTimings, role) => {
  const TIME_IDEAL_MIN = 10;
  const TIME_IDEAL_MAX = 28;

  const bodyLanguageTips = [
    "Maintain consistent eye contact with the camera lens throughout your answer.",
    "Keep your shoulders relaxed and slightly back — avoid slouching.",
    "Smile briefly before answering — it projects confidence and approachability.",
    "Avoid looking down or away during pauses — it signals uncertainty.",
    "Nod occasionally while listening to show active engagement.",
    "Speak at a moderate pace — not too fast or too slow.",
    "Use hand gestures sparingly and naturally to emphasise key points.",
    "Keep your background neutral and well-lit for a professional look.",
    "Take a breath before answering — it prevents rushed delivery.",
    "End your answer with a clear closing statement, not a trailing voice."
  ];

  const perQuestionFeedback = questionTimings.map((item, idx) => {
    const t = item.timeTaken || 0;
    let timeFeedback, timeRating, suggestion;

    if (t < 5) {
      timeFeedback = "Answer was extremely brief — likely skipped or unanswered.";
      timeRating = "too_short";
      suggestion = "Practice speaking your answer aloud. Even a 2-sentence structured response shows engagement and competence.";
    } else if (t < TIME_IDEAL_MIN) {
      timeFeedback = "Answer was shorter than ideal. A bit more depth would improve your score.";
      timeRating = "slightly_short";
      suggestion = "Use the STAR method: Situation, Task, Action, Result. This naturally extends your answers to 15–25 seconds.";
    } else if (t <= TIME_IDEAL_MAX) {
      timeFeedback = "Excellent pacing! You used the time window effectively.";
      timeRating = "ideal";
      suggestion = "Great timing. In a real interview, a brief pause before answering shows thoughtfulness and composure.";
    } else {
      timeFeedback = "Answer ran over time — may have been unfocused or too detailed.";
      timeRating = "too_long";
      suggestion = "Practise concise answers using the '30-second rule': lead with your main point, then briefly support it.";
    }

    return {
      question: item.question,
      timeTaken: t,
      timeRating,
      timeFeedback,
      suggestion,
      bodyLanguageTip: bodyLanguageTips[idx % bodyLanguageTips.length]
    };
  });

  const idealCount = perQuestionFeedback.filter(f => f.timeRating === "ideal").length;
  const goodCount = perQuestionFeedback.filter(f => f.timeRating === "slightly_short").length;
  const total = perQuestionFeedback.length;
  const performanceScore = Math.round(((idealCount * 10 + goodCount * 6) / (total * 10)) * 100);

  let overallFeedback;
  if (performanceScore >= 80) overallFeedback = "Outstanding performance! Your pacing and delivery were excellent across most questions.";
  else if (performanceScore >= 60) overallFeedback = "Good effort! A few answers were slightly off-pace. With daily practice you will be interview-ready.";
  else if (performanceScore >= 40) overallFeedback = "Fair performance. Focus on structured answer techniques like STAR to improve pacing and depth.";
  else overallFeedback = "This session needs improvement. Practice speaking your answers aloud daily for the next 1–2 weeks.";

  return {
    role,
    performanceScore: Math.min(performanceScore, 100),
    overallFeedback,
    totalQuestions: total,
    idealAnswers: idealCount,
    perQuestionFeedback,
    generalBodyLanguageTips: [
      "Look directly at the camera lens — not the screen — during your answer.",
      "Sit upright with good posture throughout the entire interview.",
      "Use a well-lit, neutral background for a professional impression.",
      "Speak at a measured pace — pause briefly before answering each question.",
      "Avoid excessive filler words (um, uh, like) — practise mindful, deliberate speech."
    ]
  };
};
// ── AI job recommendations specifically tailored to experience level ──
export const generateJobRecommendationsWithAI = async (resumeText, targetRole = "") => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const prompt = `
    You are an expert technical recruiter and AI talent matcher.
    Analyze the following resume text and generate exactly 8 highly personalized job recommendations.
    Do NOT wrap the response in markdown code blocks (\`\`\`json ... \`\`\`), output raw JSON only.

    CRITICAL REQUIREMENTS:
    1. EXPERIENCE MATCHING: Strictly match roles based on the user's experience level in the resume. 
       - If they are a Fresher/Junior: Suggest roles requiring 0-2 years (e.g., "Junior Developer", "Associate Engineer").
       - If they are Mid-Level: Suggest roles requiring 3-5 years (e.g., "Software Engineer II", "Senior Developer").
       - If they are Experienced/Senior: Suggest roles requiring 6+ years (e.g., "Lead Architect", "Staff Engineer", "VP of Tech").
    2. CONTENT MATCHING: Roles must align with their listed technologies, projects, and career path.
    3. FORMAT: Return a JSON array of objects with exactly this structure:
       {
         "title": "Exact Role Title",
         "type": "Full-time" or "Contract",
         "salary": "$Range (e.g. $80k - $110k)",
         "exp": "Experience range (e.g. 0-2 yrs or 5+ yrs)",
         "location": "Remote" or "Hybrid (City, Country)",
         "skills": ["Skill1", "Skill2", "Skill3"],
         "match": Number (70-98),
         "hot": Boolean (True if it matches their skills > 85%)
       }

    Resume Text:
    """
    ${resumeText}
    """

    User's Tagged Target Role: ${targetRole || "Based on profile findings"}
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const outputText = result.response.text();

    try {
      const cleaned = cleanJsonResponse(outputText);
      // Ensure we have a parseable string
      if (!cleaned || cleaned === "") return FALLBACK_JOBS;

      const parsedData = JSON.parse(cleaned);
      let jobs = [];
      
      // Robust extraction from various common AI response formats
      if (Array.isArray(parsedData)) {
        jobs = parsedData;
      } else if (parsedData && parsedData.recommendations && Array.isArray(parsedData.recommendations)) {
        jobs = parsedData.recommendations;
      } else if (parsedData && parsedData.jobs && Array.isArray(parsedData.jobs)) {
        jobs = parsedData.jobs;
      }

      return jobs.length > 0 ? jobs : FALLBACK_JOBS;
    } catch (parseError) {
      console.warn("AI Job Recs JSON Parse Error, using fallback");
      fs.appendFileSync("ai_debug.log", `\n[${new Date().toISOString()}] JOB RECS JSON PARSE ERROR\nRaw AI Output:\n${outputText}\n`);
      return FALLBACK_JOBS;
    }

  } catch (error) {
    console.error("AI Job Recommendations Error:", error);
    // If AI fails completely (404, quota, etc), return fallback jobs so the user isn't blocked
    return FALLBACK_JOBS;
  }
};
