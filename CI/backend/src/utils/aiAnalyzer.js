import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

let genAI = null;

// ── Helper to clean JSON response from AI (strips markdown backticks) ──
const cleanJsonResponse = (text) => {
  if (!text) return "";
  // Remove markdown code blocks like ```json ... ``` or ``` ... ```
  return text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, "$1").trim();
};

export const normalizeDomainName = (name) => {
  if (!name || typeof name !== 'string') return name;
  const n = name.trim().toLowerCase();
  
  // Broad Domains
  if (['full stack', 'full-stack', 'fullstack', 'full stack developer'].includes(n)) return 'Full Stack Development';
  if (['front end', 'front-end', 'frontend', 'frontend developer', 'ui developer'].includes(n)) return 'Frontend Development';
  if (['back end', 'back-end', 'backend', 'backend developer'].includes(n)) return 'Backend Development';
  
  // Specific Core Concepts (often incorrectly outputted as standalone random skills)
  if (n === 'api' || n === 'rest api' || n === 'restful api') return 'API Design & Integration';
  if (n === 'microservices' || n === 'micro-services') return 'Microservices Architecture';
  if (n === 'performance' || n === 'performance optimization') return 'Performance & Scalability';
  if (n === 'testing' || n === 'qa' || n === 'unit testing') return 'Testing & Quality Assurance';
  
  // Specific Tools
  if (['react', 'reactjs', 'react.js'].includes(n)) return 'React.js';
  if (['node', 'nodejs', 'node.js'].includes(n)) return 'Node.js';
  if (['vue', 'vuejs', 'vue.js'].includes(n)) return 'Vue.js';
  
  // Default to Title Case
  return name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
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

const generateDynamicFallbackJobs = (targetRolesString) => {
  if (!targetRolesString) return FALLBACK_JOBS;
  const roles = targetRolesString.split(",").map(r => r.trim()).filter(Boolean);
  if (roles.length === 0) return FALLBACK_JOBS;

  const dynamicJobs = [];
  roles.forEach((role, idx) => {
    // Exact role match
    dynamicJobs.push({
      title: `${role}`,
      type: "Full-time",
      salary: "$70k - $100k",
      exp: "2-4 yrs",
      location: idx % 2 === 0 ? "Remote" : "Hybrid",
      skills: [role.split(" ")[0], "Architecture", "Agile"],
      match: Math.floor(88 + (Math.random() * 10)),
      hot: idx === 0
    });
    
    // Junior variant
    if (idx < 2) {
      dynamicJobs.push({
        title: `Junior ${role}`,
        type: "Full-time",
        salary: "$50k - $75k",
        exp: "0-2 yrs",
        location: "Remote",
        skills: ["Core Concepts", "Debugging", "Teamwork"],
        match: Math.floor(82 + (Math.random() * 10)),
        hot: false
      });
    }
  });

  return dynamicJobs.slice(0, 8);
};


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

export const generateCareerSuggestionsWithAI = async (resumeText, isFromProfile = false) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const contextInstruction = isFromProfile
    ? `ANALYSIS CONTEXT: [Build Resume Flow]
    The user entered structured profile details inside the platform (including specific Skills, Education, Projects, Internships, Preferred Role, and Career Level).
    Do NOT limit your suggestions to just their manually entered 'Preferred Role'. Intelligently analyze their complete profile—skills, project scopes, experience, and technologies—to predict and recommend a broader set of suitable career domains. For example, if they list React, Node, and MongoDB, don't just suggest 'MERN Stack Developer'; also suggest broader domains like 'Frontend Engineering', 'Full Stack Development', or 'Web Application Architecture'.`
    : `ANALYSIS CONTEXT: [Upload Resume Flow]
    The user uploaded an existing resume document which was parsed to unstructured text.
    Perform deep keyword extraction and holistic profile analysis. Do NOT just regurgitate exact job titles found in the text. Predict and recommend a diverse mix of direct role matches and related, alternative career domains that maximize their current market value based on their underlying technical skills and experience.`;

  const prompt = `
    You are an expert career counselor, technical recruiter, and AI career coach with deep knowledge of the tech industry.
    ${contextInstruction}
    
    Analyze the following resume/profile text and generate highly personalized career growth suggestions.
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
          },
          "interviewQuestions": [
            "Tailored mock interview technical or situational question 1 specifically for this role based on their profile",
            "Tailored mock interview technical or situational question 2 specifically for this role based on their profile",
            "Tailored mock interview technical or situational question 3 specifically for this role based on their profile",
            "... (generate exactly 25 unique, highly specific questions here)"
          ]
        }
      ]
    }

    CRITICAL RULES — FOLLOW EXACTLY:
    1. INTELLIGENT DOMAIN EXPANSION: Do NOT restrict recommendations only to the user's explicitly stated preferred role or exact keywords. Analyze their entire profile to suggest broader, alternative, and related career domains. Provide a diverse mix of direct matches and related high-potential career paths (e.g., expand a specific stack into broader engineering domains).
    2. Rank the top 3 roles by predictive fit, ensuring a mix of specialized roles and broader domain-level tracks.
    3. Ensure the recommendations feel intelligent, adaptive, and career-oriented, uncovering hidden potential matches based on their skill overlap.
    4. TERMINOLOGY STANDARDIZATION: Use strict, professional industry standards for all naming. For example, ALWAYS output "Full Stack Development" (never "Full stack" or "Full-stack"). Output "React.js" (never "react").
    5. nextLevelSkills: Provide exactly 8 UNIQUE, HIGH-LEVEL skills/technologies per role that the candidate does NOT already have. Do not output vague standalone terms like "API", output "API Design & Integration".
    6. NO DUPLICATES: Ensure every skill in the list is unique and properly capitalized.
    7. LOGICAL ORDER: Arrange nextLevelSkills in a proper learning sequence, from foundational/beginner topics to advanced/specialized ones.
    8. RESOURCES MUST MATCH SKILLS: The learning resources (websites and youtube) MUST EXACTLY match the skills recommended in 'nextLevelSkills'.
    9. Website URLs must be real, well-known, and directly relevant to the specific nextLevelSkills.
    10. YouTube queries must be highly specific to the exact nextLevelSkills recommended.
    11. The trackKey must exactly match one of the allowed values.
    11. Provide exactly 3 roleSpecificInsights entries.
    12. Generate exactly 25 highly tailored, role-specific technical/situational mock interview questions inside "interviewQuestions" for EACH role. Do not use generic pools; use the skills and context of their profile to make the questions highly personalized and diverse.

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
      
      // Programmatically override the AI's suggested resources to guarantee 100% synchronization
      if (parsedData.roleSpecificInsights && Array.isArray(parsedData.roleSpecificInsights)) {
        parsedData.roleSpecificInsights.forEach(insight => {
          if (insight.role) insight.role = normalizeDomainName(insight.role);

          if (insight.nextLevelSkills && Array.isArray(insight.nextLevelSkills)) {
            // Case-insensitive deduplication and normalization to prevent duplicate resources
            const uniqueSkills = [];
            const seen = new Set();
            insight.nextLevelSkills.forEach(s => {
              if (typeof s === 'string') {
                const normalized = normalizeDomainName(s);
                const lower = normalized.toLowerCase();
                if (!seen.has(lower)) {
                  seen.add(lower);
                  uniqueSkills.push(normalized);
                }
              }
            });
            insight.nextLevelSkills = uniqueSkills;

            const skillsToLearn = insight.nextLevelSkills.slice(0, 5);
            insight.suggestedResources = {
              websites: skillsToLearn.map(skill => ({
                name: `${skill} Official Docs & Guides`,
                url: `https://www.google.com/search?q=${encodeURIComponent(skill + " official documentation tutorial")}`,
                focus: `Master core concepts of ${skill}`
              })),
              youtube: skillsToLearn.map(skill => 
                `${skill} Full Course Tutorial For Beginners`
              )
            };
          }
        });
      }
      
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
export const generateJobRecommendationsWithAI = async (resumeText, targetRole = "", isFromProfile = false) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const contextInstruction = isFromProfile
    ? `ANALYSIS CONTEXT: [Build Resume Flow - Structured Profile Data]
    The user entered structured profile details inside the platform (including specific Skills, Education, Projects, Internships, Preferred Role, and Career Level).
    Focus on matching exactly 8 highly personalized, relevant jobs that perfectly fit their preferred role and the technologies they explicitly built their profile with (e.g. if they have React.js, Node.js, MongoDB, match them with MERN stack roles, web developer, frontend/backend roles).`
    : `ANALYSIS CONTEXT: [Upload Resume Flow - Unstructured Document Text]
    The user uploaded an existing resume document which was parsed to unstructured text.
    Extract the user's practical experience level, certifications, timeline, and domain of expertise. Match them with exactly 8 jobs that align with their parsed document keywords and existing industry experience (e.g. if they have Python, Machine Learning, match with AI/ML Engineer, Data Scientist, ML-related roles).`;

  const prompt = `
    You are an expert technical recruiter and AI talent matcher.
    ${contextInstruction}
    
    Analyze the following resume/profile text and generate exactly 8 highly personalized job recommendations.
    Do NOT wrap the response in markdown code blocks (\`\`\`json ... \`\`\`), output raw JSON only.

    CRITICAL REQUIREMENTS:
    1. EXPERIENCE MATCHING: Strictly match roles based on the user's experience level in the resume. 
       - If they are a Fresher/Junior: Suggest roles requiring 0-2 years (e.g., "Junior Developer", "Associate Engineer").
       - If they are Mid-Level: Suggest roles requiring 3-5 years (e.g., "Software Engineer II", "Senior Developer").
       - If they are Experienced/Senior: Suggest roles requiring 6+ years (e.g., "Lead Architect", "Staff Engineer", "VP of Tech").
    2. CONTENT MATCHING: Roles must align with their listed technologies, projects, and career path.
    3. ROLE SYNCHRONIZATION: The jobs you recommend MUST strictly fall under the 'User's Recommended Career Roles' provided below. For example, if the recommended roles are "Frontend Developer, MERN Stack Developer", you must generate jobs like "React.js Developer", "Frontend Engineer", "MERN Stack Developer". Do not generate jobs outside of these domains.
    4. FORMAT: Return a JSON array of objects with exactly this structure:
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

    Resume/Profile Text:
    """
    ${resumeText}
    """

    User's Recommended Career Roles: ${targetRole || "Based on profile findings"}
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

      return jobs.length > 0 ? jobs : generateDynamicFallbackJobs(targetRole);
    } catch (parseError) {
      console.warn("AI Job Recs JSON Parse Error, using fallback");
      fs.appendFileSync("ai_debug.log", `\n[${new Date().toISOString()}] JOB RECS JSON PARSE ERROR\nRaw AI Output:\n${outputText}\n`);
      return generateDynamicFallbackJobs(targetRole);
    }

  } catch (error) {
    console.error("AI Job Recommendations Error:", error);
    // If AI fails completely (404, quota, etc), return fallback jobs so the user isn't blocked
    return generateDynamicFallbackJobs(targetRole);
  }
};
