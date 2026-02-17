const { callLLM } = require('../middleware/llm');
const userprofile = require('../Models/userprofile');
const Profile = require('../Models/userprofile');

class SkillGapAnalyzer {

  async analyze(email) {

    // STEP 1 — Fetch profile
    const profile = await Profile.findOne({ created_by: email });

    if (!userprofile) {
      throw new Error("Profile not found");
    }

    if (!profile.skills || !profile.education) {
      throw new Error("Professional data incomplete");
    }

    // Only send required fields
    const structuredData = {
      skills: profile.skills,
      education: profile.education,
      internships: profile.internships,
      projects: profile.projects,
      experience: profile.experience,
      certifications: profile.certifications,
      career_level: profile.career_level
    };

    // STEP 2 — Prompt
    const prompt = `
You are a senior career intelligence AI.

Analyze the user's professional profile and return STRICT JSON.

User Data:
${JSON.stringify(structuredData, null, 2)}

Instructions:
• Identify:
  - Current skill maturity level
  - Career-level alignment issues

• Categorize roles into:
  - Easy Roles (2 roles)
  - Medium Roles (2 roles)
  - Hard Roles (2 roles)

• For Medium + Hard:
  - Identify skill gaps
  - Tool gaps
  - Experience gaps
  - Suggest industry-recognized certifications

Return ONLY valid JSON in this format:

{
  "skill_gap_analysis": {...},
  "role_categories": {...},
  "roles_for_storage": [...]
}
`;

    const { parsed } = await callLLM({ prompt });

    if (!parsed) {
      throw new Error("AI response parsing failed");
    }

    return parsed;
  }
}

module.exports = SkillGapAnalyzer;
