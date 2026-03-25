import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

export const analyzeResumeWithAI = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  // Initialize lazily to ensure environment variables are loaded First
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
    
    // Attempt to parse JSON. 
    try {
      const parsedData = JSON.parse(outputText);
      return parsedData;
    } catch (parseError) {
      import("fs").then(fs => fs.appendFileSync("ai_debug.log", `\nJSON PARSE ERROR\nRaw AI Output:\n${outputText}\n`));
      throw new Error("AI returned invalid JSON block.");
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
      const parsedData = JSON.parse(outputText);
      return parsedData;
    } catch (parseError) {
      import("fs").then(fs => fs.appendFileSync("ai_debug_interview.log", `\nJSON PARSE ERROR\nRaw AI Output:\n${outputText}\n`));
      throw new Error("AI returned invalid JSON block.");
    }
  } catch (error) {
    console.error("AI Interview Analysis Error:", error);
    throw new Error("Failed to analyze interview answers with AI.");
  }
};
