import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { profileApi } from "../api";
import { useAuth } from "../context/AuthContext";

// ─── Data ─────────────────────────────────────────────────────────────────────
const sections = [
  { id: "personal", label: "Personal Info", icon: "👤" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "projects", label: "Projects", icon: "🛠️" },
  { id: "internships", label: "Internships", icon: "💼" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "certifications", label: "Certifications", icon: "📜" },
  { id: "summary", label: "AI Summary", icon: "✨" }
];

const IT_ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Mobile App Developer (Android)", "Mobile App Developer (iOS)",
  "React Native Developer", "Flutter Developer", "Web Developer",
  "UI/UX Designer", "Product Designer", "Graphic Designer",
  "DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer (AWS)",
  "Cloud Engineer (Azure)", "Cloud Engineer (GCP)", "Kubernetes Engineer",
  "Data Analyst", "Data Engineer", "Data Scientist", "Machine Learning Engineer",
  "AI Engineer", "NLP Engineer", "Computer Vision Engineer",
  "Business Intelligence Analyst", "Database Administrator",
  "Systems Administrator", "Network Engineer", "Cybersecurity Analyst",
  "Penetration Tester", "Information Security Engineer",
  "QA Engineer", "SDET", "Automation Test Engineer",
  "Embedded Systems Engineer", "Firmware Engineer", "IoT Developer",
  "Blockchain Developer", "Game Developer", "AR/VR Developer",
  "Salesforce Developer", "SAP Consultant", "IT Project Manager",
  "Scrum Master", "Product Manager", "Technical Writer", "IT Support Specialist",
  "Solution Architect", "Enterprise Architect"
];

const yearOptions = Array.from({ length: 41 }, (_, i) => String(2000 + i));
const joinLines = (v) => (Array.isArray(v) ? v.join("\n") : v || "");

const emptyForm = {
  personalInfo: {
    fullName: "", profilePhoto: "", phone: "", email: "", location: "",
    linkedin: "", gender: "", nationality: "", dateOfBirth: "",
    portfolio: "", languages: ""
  },
  education: {
    university: "", degree: "", fieldOfStudy: "", graduationYear: "",
    cgpa: "", startYear: "", endYear: "", studyMode: ""
  },
  skills: {
    technicalSkills: "", softSkills: "", tools: "", languages: "", experienceLevel: ""
  },
  projects: [{ title: "", description: "", domain: "", technologiesUsed: "", duration: "" }],
  internships: [{ company: "", role: "", duration: "", location: "", technologiesUsed: "" }],
  achievements: "",
  certifications: [{ name: "", issueMonth: "", issueYear: "" }],
  professionalSummary: "",
  preferredRole: "",
  careerLevel: "fresher",
  template: "modern"
};

// ─── Completion Ring (Modernized) ─────────────────────────────────────────────
const CompletionRing = ({ percentage }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage < 40 ? "#f87171" : percentage < 70 ? "#fbbf24" : "#38bdf8";
  return (
    <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto" }}>
      <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease", filter: `drop-shadow(0 0 5px ${color}44)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{percentage}%</span>
      </div>
    </div>
  );
};

// ─── Simple Straight Progress Bar ─────────────────────────────────────────────
const SimpleProgressBar = ({ activeIndex, total }) => {
  const percentage = ((activeIndex + 1) / total) * 100;
  return (
    <div style={{ position: "relative", height: "4px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", margin: "1.5rem 0", overflow: "hidden" }}>
      <motion.div
        style={{ height: "100%", background: "linear-gradient(90deg, #38bdf8, #818cf8)", borderRadius: "4px" }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};

// ─── Styled field components ──────────────────────────────────────────────────
const fieldWrap = { position: "relative", marginBottom: "1.5rem" };
const labelStyle = {
  display: "block", marginBottom: "0.5rem",
  fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.06em"
};
const inputStyle = {
  width: "100%", padding: "0.95rem 1.2rem", fontSize: "0.95rem",
  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px", color: "#fff", outline: "none",
  transition: "all 0.3s ease",
  fontFamily: "inherit", boxSizing: "border-box"
};
const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  background: "rgba(255,255,255,0.02)",
  color: "#fff",
  paddingRight: "2.5rem"
};
const focusIn = e => {
  e.target.style.borderColor = "rgba(56, 189, 248, 0.4)";
  e.target.style.background = "rgba(56, 189, 248, 0.03)";
};
const focusOut = e => {
  e.target.style.borderColor = "rgba(255,255,255,0.08)";
  e.target.style.background = "rgba(255,255,255,0.02)";
};

const Field = ({ label, type = "text", value, onChange, placeholder, required, list }) => (
  <div style={fieldWrap}>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={onChange}
      placeholder={placeholder || ""} required={required} list={list}
      style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
  </div>
);

const SelectField = ({ label, value, onChange, children }) => (
  <div style={fieldWrap}>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: "relative" }}>
      <select value={value} onChange={onChange}
        style={selectStyle} onFocus={focusIn} onBlur={focusOut}>
        {children}
      </select>
      <span style={{
        position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
        pointerEvents: "none", color: "#818cf8", fontSize: "0.8rem"
      }}>▾</span>
    </div>
  </div>
);

const TextareaField = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div style={fieldWrap}>
    <label style={labelStyle}>{label}</label>
    <textarea value={value} onChange={onChange} placeholder={placeholder || ""} rows={rows}
      style={{ ...inputStyle, resize: "vertical" }} onFocus={focusIn} onBlur={focusOut} />
  </div>
);

const PrimaryButton = ({ children, onClick, disabled, type = "button", style: s = {} }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    style={{
      background: disabled ? "rgba(56,189,248,0.2)" : "linear-gradient(135deg, #38bdf8, #818cf8)",
      color: "#fff", border: "none", borderRadius: "12px",
      padding: "0.9rem 2rem", fontSize: "1rem", fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: disabled ? "none" : "0 8px 25px rgba(56,189,248,0.15)", ...s
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(56,189,248,0.25)"; } }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = disabled ? "none" : "0 8px 25px rgba(56,189,248,0.15)"; }}>
    {children}
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sectionCompletion, setSectionCompletion] = useState({});
  const [completionStats, setCompletionStats] = useState({ percentage: 0, missing: [] });
  const activeIndex = sections.findIndex(s => s.id === activeSection);

  const calculateCompletion = (data) => {
    let score = 0, maxScore = 0;
    const missing = [];
    const check = (v, name, w = 1) => { maxScore += w; if (v && v.toString().trim()) score += w; else missing.push(name); };
    check(data.personalInfo.fullName, "Full Name");
    check(data.personalInfo.email, "Email");
    check(data.personalInfo.phone, "Phone");
    check(data.preferredRole, "Target Role");
    check(data.personalInfo.linkedin, "LinkedIn");
    if (data.careerLevel === "fresher") check(data.personalInfo.portfolio, "Portfolio");
    check(data.education.university, "University", 2);
    check(data.education.cgpa, "CGPA");
    check(data.skills.technicalSkills, "Technical Skills", 2);
    const hasPro = data.projects.some(p => p.title.trim());
    maxScore += 2; if (hasPro) score += 2; else missing.push("A Project");
    check(data.professionalSummary, "Professional Summary");
    return { percentage: Math.round((score / maxScore) * 100), missing: missing.slice(0, 5) };
  };

  const getSectionCompletion = (data) => ({
    personal: !!(data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone),
    education: !!(data.education.university && data.education.degree),
    skills: !!(data.skills.technicalSkills),
    projects: data.projects.some(p => p.title.trim()),
    internships: data.internships.some(i => i.company.trim()),
    achievements: !!(data.achievements && data.achievements.length > 0),
    certifications: data.certifications.some(c => c.name.trim()),
    summary: !!(data.professionalSummary && data.preferredRole)
  });

  useEffect(() => {
    setCompletionStats(calculateCompletion(formData));
    setSectionCompletion(getSectionCompletion(formData));
  }, [formData]);

  useEffect(() => {
    profileApi.get(token).then((profile) => {
      if (!profile) {
        setFormData(c => ({ ...c, personalInfo: { ...c.personalInfo, fullName: user?.name || "", email: user?.email || "" } }));
        return;
      }
      setFormData({
        personalInfo: {
          fullName: profile.personalInfo?.fullName || user?.name || "",
          profilePhoto: profile.personalInfo?.profilePhoto || "",
          phone: profile.personalInfo?.phone || "",
          email: profile.personalInfo?.email || user?.email || "",
          location: profile.personalInfo?.location || "",
          linkedin: profile.personalInfo?.linkedin || "",
          gender: profile.personalInfo?.gender || "",
          nationality: profile.personalInfo?.nationality || "",
          dateOfBirth: profile.personalInfo?.dateOfBirth || "",
          portfolio: profile.personalInfo?.portfolio || "",
          languages: profile.personalInfo?.languages || ""
        },
        education: {
          university: profile.education?.university || "",
          degree: profile.education?.degree || "",
          fieldOfStudy: profile.education?.fieldOfStudy || "",
          graduationYear: profile.education?.graduationYear || "",
          cgpa: profile.education?.cgpa || "",
          startYear: profile.education?.startYear || "",
          endYear: profile.education?.endYear || "",
          studyMode: profile.education?.studyMode || ""
        },
        skills: {
          technicalSkills: profile.skills?.technicalSkills || "",
          softSkills: profile.skills?.softSkills || "",
          tools: profile.skills?.tools || "",
          languages: profile.skills?.languages || "",
          experienceLevel: profile.skills?.experienceLevel || ""
        },
        projects: profile.projects?.length > 0 ? profile.projects : emptyForm.projects,
        internships: profile.internships?.length > 0 ? profile.internships : emptyForm.internships,
        achievements: joinLines(profile.achievements),
        certifications: profile.certifications?.length > 0 ? profile.certifications : emptyForm.certifications,
        professionalSummary: profile.professionalSummary || "",
        preferredRole: profile.preferredRole || "",
        careerLevel: profile.careerLevel || "fresher",
        template: profile.template || "modern"
      });
    }).catch(() => undefined);
  }, [token, user]);

  const upPI = (k, v) => setFormData(c => ({ ...c, personalInfo: { ...c.personalInfo, [k]: v } }));
  const upEdu = (k, v) => setFormData(c => ({ ...c, education: { ...c.education, [k]: v } }));
  const upSkill = (k, v) => setFormData(c => ({ ...c, skills: { ...c.skills, [k]: v } }));
  const upList = (sec, idx, k, v) => setFormData(c => ({ ...c, [sec]: c[sec].map((item, i) => i === idx ? { ...item, [k]: v } : item) }));
  const addItem = (sec, tpl) => setFormData(c => ({ ...c, [sec]: [...c[sec], tpl] }));
  const rmItem = (sec, idx) => setFormData(c => ({ ...c, [sec]: c[sec].filter((_, i) => i !== idx) }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Photo size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        upPI("profilePhoto", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSummary = async () => {
    setError(""); setMessage(""); setIsGenerating(true);
    try {
      const data = await profileApi.generateSummary(token, formData);
      setFormData(c => ({ ...c, professionalSummary: data.summary }));
      setMessage("✨ AI Summary generated!");
    } catch (err) { setError(err.message); }
    finally { setIsGenerating(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setMessage(""); setIsSaving(true);
    try {
      await profileApi.save(token, formData);
      navigate("/template-select");
    } catch (err) { setError(err.message); }
    finally { setIsSaving(false); }
  };

  const skillChips = ["Python", "React.js", "Node.js", "SQL", "Docker", "AWS"]
    .filter(s => !formData.skills.technicalSkills.includes(s)).slice(0, 4);

  // ── Section card wrapper ─────────────────────────────────────────────────────
  const Card = ({ children }) => (
    <div style={{
      background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.18)",
      borderRadius: "12px", padding: "1.5rem", marginBottom: "1.25rem"
    }}>{children}</div>
  );

  const CardHeader = ({ num, label, grad, onRemove, showRemove }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{
          background: grad || "linear-gradient(135deg,#4f46e5,#6366f1)", color: "#fff",
          width: "28px", height: "28px", borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "0.8rem"
        }}>{num}</span>
        <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "#e2e8f0" }}>{label}</span>
      </div>
      {showRemove && (
        <button type="button" onClick={onRemove}
          style={{
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5", borderRadius: "6px", padding: "0.2rem 0.6rem",
            fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit"
          }}>Remove</button>
      )}
    </div>
  );

  // ─── Section renderers ────────────────────────────────────────────────────────
  const renderSection = () => {
    switch (activeSection) {

      case "personal": return (
        <div>
          <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%",
              background: "rgba(255,255,255,0.05)", border: "2px dashed rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", position: "relative", flexShrink: 0
            }}>
              {formData.personalInfo.profilePhoto ? (
                <img src={formData.personalInfo.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "2rem", color: "#64748b" }}>👤</span>
              )}
            </div>
            <div>
              <label style={{
                background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)",
                color: "#38bdf8", padding: "0.6rem 1.25rem", borderRadius: "8px",
                fontSize: "0.85rem", cursor: "pointer", fontWeight: 600, display: "inline-block",
                marginBottom: "0.5rem"
              }}>
                Upload Profile Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              </label>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>Recommended: Square image, max 2MB.</p>
            </div>
          </div>
          <div className="profile-grid">
            <Field label="Full Name *" value={formData.personalInfo.fullName} required onChange={e => upPI("fullName", e.target.value)} />
          <Field label="Phone Number *" value={formData.personalInfo.phone} required onChange={e => upPI("phone", e.target.value)} />
          <Field label="Email Address *" type="email" value={formData.personalInfo.email} required onChange={e => upPI("email", e.target.value)} />
          <Field label="Location (City, Country) *" value={formData.personalInfo.location} required onChange={e => upPI("location", e.target.value)} />
          <Field label="LinkedIn Profile URL" value={formData.personalInfo.linkedin} onChange={e => upPI("linkedin", e.target.value)} />
          <Field label="Portfolio / GitHub URL" value={formData.personalInfo.portfolio} onChange={e => upPI("portfolio", e.target.value)} />

          <SelectField label="Gender" value={formData.personalInfo.gender} onChange={e => upPI("gender", e.target.value)}>
            <option value="">— Select gender —</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary / Gender Non-conforming">Non-binary / Gender Non-conforming</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Other">Other</option>
          </SelectField>

          <Field label="Nationality" value={formData.personalInfo.nationality} onChange={e => upPI("nationality", e.target.value)} />

          {/* Native calendar date picker */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Date of Birth</label>
            <input type="date" value={formData.personalInfo.dateOfBirth}
              onChange={e => upPI("dateOfBirth", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              style={{ ...inputStyle, colorScheme: "dark" }}
              onFocus={focusIn} onBlur={focusOut} />
          </div>

          <Field label="Languages Spoken" placeholder="English, Tamil, Hindi"
            value={formData.personalInfo.languages} onChange={e => upPI("languages", e.target.value)} />

          </div>
        </div>
      );

      case "education": return (
        <div className="profile-grid">
          <Field label="University / College" value={formData.education.university} onChange={e => upEdu("university", e.target.value)} />
          <Field label="Degree (e.g. B.Tech, MBA)" value={formData.education.degree} onChange={e => upEdu("degree", e.target.value)} />
          <Field label="Field of Study" value={formData.education.fieldOfStudy} onChange={e => upEdu("fieldOfStudy", e.target.value)} />
          <Field label="CGPA / Percentage" value={formData.education.cgpa} onChange={e => upEdu("cgpa", e.target.value)} />

          <SelectField label="Start Year" value={formData.education.startYear} onChange={e => upEdu("startYear", e.target.value)}>
            <option value="">— Select year —</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>

          <SelectField label="End / Expected Year" value={formData.education.endYear} onChange={e => upEdu("endYear", e.target.value)}>
            <option value="">— Select year —</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>

          <SelectField label="Graduation Year" value={formData.education.graduationYear} onChange={e => upEdu("graduationYear", e.target.value)}>
            <option value="">— Select year —</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>

          <SelectField label="Study Mode" value={formData.education.studyMode} onChange={e => upEdu("studyMode", e.target.value)}>
            <option value="">— Select mode —</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Distance Learning">Distance Learning</option>
            <option value="Online">Online</option>
            <option value="Blended Learning">Blended Learning</option>
            <option value="Sandwich / Co-op">Sandwich / Co-op</option>
            <option value="Exchange Program">Exchange Program</option>
          </SelectField>
        </div>
      );

      case "skills": return (
        <div>
          {skillChips.length > 0 && (
            <div style={{
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1.5rem",
              display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap"
            }}>
              <span style={{ fontSize: "0.8rem", color: "#a5b4fc", fontWeight: 600 }}>✨ AI Suggests:</span>
              {skillChips.map(chip => (
                <button key={chip} type="button"
                  onClick={() => upSkill("technicalSkills", formData.skills.technicalSkills ? formData.skills.technicalSkills + ", " + chip : chip)}
                  style={{
                    background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.4)",
                    color: "#c7d2fe", borderRadius: "20px", padding: "0.2rem 0.75rem",
                    fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit"
                  }}>+ {chip}</button>
              ))}
            </div>
          )}
          <div className="profile-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <TextareaField label="Technical Skills (comma-separated)" rows={3}
                placeholder="React.js, Node.js, Python, MongoDB..."
                value={formData.skills.technicalSkills} onChange={e => upSkill("technicalSkills", e.target.value)} />
            </div>
            <TextareaField label="Soft Skills" rows={3}
              placeholder="Leadership, Communication, Problem-solving..."
              value={formData.skills.softSkills} onChange={e => upSkill("softSkills", e.target.value)} />
            <TextareaField label="Tools & Technologies" rows={3}
              placeholder="Git, Docker, VS Code, Figma..."
              value={formData.skills.tools} onChange={e => upSkill("tools", e.target.value)} />
            <TextareaField label="Coding Languages" rows={2}
              placeholder="JavaScript, Python, Java..."
              value={formData.skills.languages} onChange={e => upSkill("languages", e.target.value)} />
            <SelectField label="Experience Level" value={formData.skills.experienceLevel} onChange={e => upSkill("experienceLevel", e.target.value)}>
              <option value="">— Select level —</option>
              <option value="Beginner">Beginner (No prior experience)</option>
              <option value="Basic Knowledge">Basic Knowledge (Self-taught / Coursework)</option>
              <option value="Learning">Learning (Actively developing skills)</option>
              <option value="Intermediate">Intermediate (Projects &amp; Internships)</option>
              <option value="Developing">Developing (Growing proficiency)</option>
              <option value="Proficient">Proficient (Confident &amp; productive)</option>
            </SelectField>
          </div>
        </div>
      );

      case "projects": return (
        <div>
          {formData.projects.map((project, idx) => (
            <Card key={idx}>
              <CardHeader num={idx + 1} label={project.title || `Project ${idx + 1}`}
                showRemove={formData.projects.length > 1} onRemove={() => rmItem("projects", idx)} />
              <div className="profile-grid">
                <Field label="Project Title" value={project.title} onChange={e => upList("projects", idx, "title", e.target.value)} />
                <Field label="Domain / Category" value={project.domain} onChange={e => upList("projects", idx, "domain", e.target.value)} />
                <Field label="Technologies Used" value={project.technologiesUsed} onChange={e => upList("projects", idx, "technologiesUsed", e.target.value)} />
                <Field label="Duration (e.g. 2 months)" value={project.duration} onChange={e => upList("projects", idx, "duration", e.target.value)} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <TextareaField label="Project Description" rows={3} value={project.description}
                    onChange={e => upList("projects", idx, "description", e.target.value)} />
                </div>
              </div>
            </Card>
          ))}
          <PrimaryButton style={{ width: "100%" }}
            onClick={() => addItem("projects", { title: "", description: "", domain: "", technologiesUsed: "", duration: "" })}>
            + Add Another Project
          </PrimaryButton>
        </div>
      );

      case "internships": return (
        <div>
          {formData.internships.map((intern, idx) => (
            <Card key={idx}>
              <CardHeader num={idx + 1} label={intern.company || `Internship ${idx + 1}`}
                grad="linear-gradient(135deg,#0284c7,#0ea5e9)"
                showRemove={formData.internships.length > 1} onRemove={() => rmItem("internships", idx)} />
              <div className="profile-grid">
                <Field label="Company Name" value={intern.company} onChange={e => upList("internships", idx, "company", e.target.value)} />
                <Field label="Role / Position" value={intern.role} onChange={e => upList("internships", idx, "role", e.target.value)} />
                <Field label="Duration (e.g. Jun 2023 – Aug 2023)" value={intern.duration} onChange={e => upList("internships", idx, "duration", e.target.value)} />
                <Field label="Location (City, Country)" placeholder="e.g. Chennai, India" value={intern.location || ""} onChange={e => upList("internships", idx, "location", e.target.value)} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Technologies Used" value={intern.technologiesUsed} onChange={e => upList("internships", idx, "technologiesUsed", e.target.value)} />
                </div>
              </div>
            </Card>
          ))}
          <PrimaryButton style={{ width: "100%" }}
            onClick={() => addItem("internships", { company: "", role: "", duration: "", location: "", technologiesUsed: "" })}>
            + Add Another Internship
          </PrimaryButton>
        </div>
      );

      case "achievements": return (
        <div>
          <div style={{
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.22)",
            borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1.25rem",
            fontSize: "0.85rem", color: "#fbbf24"
          }}>🏆 List one achievement per line — awards, competitions, rankings, hackathons.</div>
          <TextareaField label="Achievements (one per line)" rows={8}
            placeholder={"• Winner of National Coding Championship 2023\n• IEEE Paper Published\n• Top 100 on LeetCode"}
            value={formData.achievements}
            onChange={e => setFormData(c => ({ ...c, achievements: e.target.value }))} />
        </div>
      );

      case "certifications": return (
        <div>
          {formData.certifications.map((cert, idx) => (
            <Card key={idx}>
              <CardHeader num={idx + 1} label={cert.name || `Certification ${idx + 1}`}
                grad="linear-gradient(135deg,#059669,#10b981)"
                showRemove={formData.certifications.length > 1} onRemove={() => rmItem("certifications", idx)} />
              <div className="profile-grid">
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Certificate Name" value={cert.name} onChange={e => upList("certifications", idx, "name", e.target.value)} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Issue Date (Month & Year)</label>
                  <input type="month" value={cert.issueMonth}
                    onChange={e => upList("certifications", idx, "issueMonth", e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <SelectField label="Issue Year" value={cert.issueYear} onChange={e => upList("certifications", idx, "issueYear", e.target.value)}>
                  <option value="">— Select year —</option>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </SelectField>
              </div>
            </Card>
          ))}
          <PrimaryButton style={{ width: "100%" }}
            onClick={() => addItem("certifications", { name: "", issueMonth: "", issueYear: "" })}>
            + Add Another Certification
          </PrimaryButton>
        </div>
      );

      case "summary": return (
        <div>
          <div style={{
            background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px",
            padding: "1.25rem 1.5rem", marginBottom: "1.5rem"
          }}>
            <p style={{ margin: "0 0 0.4rem", fontSize: "0.9rem", color: "#c7d2fe", fontWeight: 600 }}>✨ AI-Powered Professional Summary</p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6 }}>
              Enter your target role, then click "Generate with AI" to create an ATS-optimized summary from your profile.
            </p>
          </div>
          <div style={{ ...fieldWrap }}>
            <label style={labelStyle}>Target Role *</label>
            <input value={formData.preferredRole} list="role-list-summary" required
              placeholder="e.g. Full Stack Developer"
              onChange={e => setFormData(c => ({ ...c, preferredRole: e.target.value }))}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            <datalist id="role-list-summary">{IT_ROLES.map(r => <option key={r} value={r} />)}</datalist>
          </div>
          <PrimaryButton onClick={handleGenerateSummary} disabled={isGenerating} style={{ marginBottom: "1.25rem", width: "100%" }}>
            {isGenerating ? "⏳ Generating..." : "✨ Generate with AI"}
          </PrimaryButton>
          {message && <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1rem", color: "#34d399", fontSize: "0.85rem" }}>{message}</div>}
          <TextareaField label="Professional Summary" rows={7}
            placeholder="AI-generated summary appears here. You can also type manually."
            value={formData.professionalSummary}
            onChange={e => setFormData(c => ({ ...c, professionalSummary: e.target.value }))} />
        </div>
      );

      default: return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      background: "#0f172a", 
      fontFamily: "'Inter','Outfit',system-ui,sans-serif", 
      color: "#e2e8f0",
      margin: "-2rem", // Counteract page-container padding for full-bleed sidebar
      position: "relative"
    }}>

      {/* ── SIDEBAR (Sticky & Full Height) ── */}
      <aside style={{
        width: "280px", flexShrink: 0,
        background: "#050505",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column",
        padding: "2.5rem 1.75rem",
        position: "sticky", top: 0, height: "100vh", zIndex: 100,
        overflow: "hidden",
        boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
        boxSizing: "border-box"
      }}>
        {/* Brand - Modern & Compact */}
        <div style={{ marginBottom: "2.5rem", textAlign: "left", paddingLeft: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#38bdf8,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", boxShadow: "0 4px 12px rgba(56,189,248,0.3)" }}>✦</div>
            <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#fff", letterSpacing: "-0.02em" }}>Career Insight</span>
          </div>
        </div>

        {/* Compact Completion Score */}
        <div style={{ marginBottom: "2.5rem", padding: "0 0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Profile Strength</p>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: completionStats.percentage < 40 ? "#f87171" : completionStats.percentage < 70 ? "#fbbf24" : "#38bdf8" }}>{completionStats.percentage}%</span>
          </div>
          <div style={{ position: "relative", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" }}>
             <motion.div
               style={{ height: "100%", background: completionStats.percentage < 40 ? "#f87171" : completionStats.percentage < 70 ? "#fbbf24" : "linear-gradient(90deg, #38bdf8, #818cf8)", borderRadius: "10px" }}
               initial={{ width: 0 }}
               animate={{ width: `${completionStats.percentage}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
             />
          </div>
        </div>

        {/* Workflow steps - Spacious & Clean */}
        <nav style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }} className="sidebar-scroll">
          <p style={{ fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 1.25rem 0.5rem", fontWeight: 800, opacity: 0.8 }}>Workflow Journey</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {sections.map(section => {
              const isActive = activeSection === section.id;
              const isDone = sectionCompletion[section.id];
              return (
                <div 
                  key={section.id} 
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    padding: "0.85rem 1.25rem",
                    borderRadius: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: isActive ? "rgba(56,189,248,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(56,189,248,0.2)" : "1px solid transparent",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ 
                      fontSize: "1.2rem", 
                      color: isActive ? "#38bdf8" : isDone ? "#10b981" : "#475569",
                      display: "flex",
                      alignItems: "center",
                      opacity: isActive || isDone ? 1 : 0.7
                    }}>{section.icon}</span>
                    <span style={{ 
                      fontSize: "0.88rem", 
                      fontWeight: isActive ? 700 : 500, 
                      color: isActive ? "#fff" : isDone ? "#e2e8f0" : "#94a3b8"
                    }}>{section.label}</span>
                  </div>
                  {isDone && (
                    <div style={{ 
                      width: "18px", 
                      height: "18px", 
                      borderRadius: "50%", 
                      background: "#10b981", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      boxShadow: "0 0 8px rgba(16,185,129,0.3)"
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: "3rem 4rem", background: "#0c0c12", minHeight: "100vh" }}>
        {/* Section header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <div style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", borderRadius: "12px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
              {sections.find(s => s.id === activeSection)?.icon}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.01em" }}>
                {sections.find(s => s.id === activeSection)?.label}
              </h1>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>Step {activeIndex + 1} of {sections.length}</p>
            </div>
          </div>

          <SimpleProgressBar activeIndex={activeIndex} total={sections.length} />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "0.75rem 1.25rem", marginBottom: "1.5rem", color: "#fca5a5", fontSize: "0.88rem" }}>
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form id="profile-form" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div key={activeSection}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(148,163,184,0.1)" }}>
            <button type="button"
              onClick={() => activeIndex > 0 && setActiveSection(sections[activeIndex - 1].id)}
              disabled={activeIndex === 0}
              style={{ background: "transparent", border: "1px solid rgba(148,163,184,0.25)", color: activeIndex === 0 ? "#3f4c5c" : "#94a3b8", borderRadius: "10px", padding: "0.65rem 1.25rem", fontSize: "0.88rem", cursor: activeIndex === 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              ← Previous
            </button>
            <span style={{ fontSize: "0.8rem", color: "#475569" }}>{activeIndex + 1} / {sections.length}</span>
            {activeIndex < sections.length - 1
              ? <PrimaryButton onClick={() => setActiveSection(sections[activeIndex + 1].id)}>Next →</PrimaryButton>
              : <PrimaryButton type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save & Choose Template →"}</PrimaryButton>}
          </div>
        </form>
      </main>

      {/* Global select option fix */}
      <style>{`
        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 3rem; }
        @media (max-width: 1000px) { .profile-grid { grid-template-columns: 1fr; } }
        select option { background: #111; color: #fff; padding: 12px; font-size: 0.95rem; }
        textarea { font-size: 0.95rem !important; line-height: 1.6 !important; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.15); }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="month"]::-webkit-calendar-picker-indicator {
          filter: invert(1); cursor: pointer; transform: scale(1.2);
        }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default ProfilePage;
