import { Profile } from "../models/Profile.js";
import { chooseTemplate } from "../utils/templateSelector.js";

const cleanText = (value) => String(value || "").trim();
const toLineArray = (value) =>
  Array.isArray(value)
    ? value.map((item) => cleanText(item)).filter(Boolean)
    : String(value || "")
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

const cleanArrayOfObjects = (items = [], fields = []) =>
  (Array.isArray(items) ? items : []).map((item) =>
    fields.reduce((accumulator, field) => {
      accumulator[field] = cleanText(item?.[field]);
      return accumulator;
    }, {})
  );

export const saveProfile = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      personalInfo: {
        fullName: cleanText(req.body.personalInfo?.fullName),
        profilePhoto: req.body.personalInfo?.profilePhoto || "",
        phone: cleanText(req.body.personalInfo?.phone),
        email: cleanText(req.body.personalInfo?.email),
        location: cleanText(req.body.personalInfo?.location),
        linkedin: cleanText(req.body.personalInfo?.linkedin),
        gender: cleanText(req.body.personalInfo?.gender),
        nationality: cleanText(req.body.personalInfo?.nationality),
        dateOfBirth: cleanText(req.body.personalInfo?.dateOfBirth),
        portfolio: cleanText(req.body.personalInfo?.portfolio),
        languages: cleanText(req.body.personalInfo?.languages)
      },
      education: {
        university: cleanText(req.body.education?.university),
        degree: cleanText(req.body.education?.degree),
        fieldOfStudy: cleanText(req.body.education?.fieldOfStudy),
        graduationYear: cleanText(req.body.education?.graduationYear),
        cgpa: cleanText(req.body.education?.cgpa),
        startYear: cleanText(req.body.education?.startYear),
        endYear: cleanText(req.body.education?.endYear),
        studyMode: cleanText(req.body.education?.studyMode)
      },
      skills: {
        technicalSkills: cleanText(req.body.skills?.technicalSkills),
        softSkills: cleanText(req.body.skills?.softSkills),
        tools: cleanText(req.body.skills?.tools),
        languages: cleanText(req.body.skills?.languages),
        experienceLevel: cleanText(req.body.skills?.experienceLevel)
      },
      projects: cleanArrayOfObjects(req.body.projects, [
        "title",
        "description",
        "domain",
        "technologiesUsed",
        "duration"
      ]).filter((item) => item.title || item.description || item.technologiesUsed),
      internships: cleanArrayOfObjects(req.body.internships, [
        "company",
        "role",
        "duration",
        "technologiesUsed"
      ]).filter((item) => item.company || item.role),
      achievements: toLineArray(req.body.achievements),
      certifications: cleanArrayOfObjects(req.body.certifications, [
        "name",
        "issueMonth",
        "issueYear"
      ]).filter((item) => item.name),
      professionalSummary: cleanText(req.body.professionalSummary),
      preferredRole: cleanText(req.body.preferredRole),
      careerLevel: cleanText(req.body.careerLevel),
      template: cleanText(req.body.template)
    };

    payload.headline = payload.preferredRole;
    payload.template = payload.template || chooseTemplate(payload);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { ...payload, user: req.user._id },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save profile", error: error.message });
  }
};

export const generateSummary = async (req, res) => {
  try {
    const { preferredRole, careerLevel, skills, projects, internships, personalInfo } = req.body;
    const skillList = [
      cleanText(skills?.technicalSkills),
      cleanText(skills?.tools),
      cleanText(skills?.softSkills)
    ].filter(Boolean);
    const projectList = (Array.isArray(projects) ? projects : [])
      .map((project) => cleanText(project?.title))
      .filter(Boolean)
      .slice(0, 2);
    const internshipList = (Array.isArray(internships) ? internships : [])
      .map((internship) => cleanText(internship?.role || internship?.company))
      .filter(Boolean)
      .slice(0, 2);
    const name = personalInfo?.fullName || "I";
    const experienceText =
      careerLevel === "experienced"
        ? "have developed practical experience and role-ready capabilities"
        : "am building a strong foundation through academic work, projects, and continuous learning";

    const summary = `I am an aspiring ${preferredRole || "IT professional"} and ${experienceText}. My strengths include ${skillList.join(", ") || "communication, adaptability, problem solving, and teamwork"}. ${projectList.length ? `I have worked on ${projectList.join(" and ")}. ` : ""}${internshipList.length ? `I also gained exposure through ${internshipList.join(" and ")}. ` : ""}I am looking for an opportunity where I can contribute effectively, continue learning, and grow in a ${preferredRole || "target"} role.`;

    return res.json({ summary });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate summary",
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};
