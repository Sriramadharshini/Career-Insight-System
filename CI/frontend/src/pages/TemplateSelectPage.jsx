import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { profileApi } from "../api";
import { useAuth } from "../context/AuthContext";

// ── Mini resume scale previews (transform: scale trick) ──────────────────────

const CreativePreview = () => (
  <div style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left", display: "flex", fontFamily: "'Times New Roman', Times, serif" }}>
    <div style={{ width: "35%", background: "#111827", padding: "4rem", display: "flex", flexDirection: "column", gap: "2rem", color: "#fff" }}>
      <div style={{ width: "200px", height: "200px", borderRadius: "50%", border: "4px solid #fff", margin: "0 auto" }} />
      <div style={{ fontSize: "24px", lineHeight: "1.6", color: "#cbd5e1" }}>
        <strong style={{ fontSize: "28px", color: "#fff" }}>CONTACT</strong><br /><br />
        123 Main St<br />Anytown, USA<br />555-555-5555<br /><br />
        <strong style={{ fontSize: "28px", color: "#fff" }}>SKILLS</strong><br /><br />
        • React.js<br />• Node.js<br />• Python<br />• MongoDB<br />• Leadership
      </div>
    </div>
    <div style={{ width: "65%", padding: "6rem 4rem", color: "#000", textAlign: "left" }}>
      <h4 style={{ margin: 0, fontSize: "56px", color: "#000", textTransform: "uppercase" }}>Your Name</h4>
      <p style={{ margin: "8px 0 40px 0", fontSize: "28px", color: "#475569" }}>Software Engineer</p>
      <div style={{ fontSize: "24px", color: "#334155", lineHeight: "1.6", marginBottom: "40px", textAlign: "justify" }}>
        Passionate developer with expertise in building scalable web applications. Proven track record of delivering high-quality solutions that drive business growth.
      </div>
      <strong style={{ fontSize: "28px", color: "#000", display: "block", borderBottom: "4px solid #000", paddingBottom: "10px", marginBottom: "20px" }}>EXPERIENCE</strong>
      <div style={{ fontSize: "24px", color: "#334155", lineHeight: "1.6" }}>
        <strong>Senior Developer</strong> | TechCorp<br />
        <em>2020 – Present</em><br />• Led development of e-commerce platform<br />• Improved performance by 40%
      </div>
    </div>
  </div>
);

const SimplePreview = () => (
  <div style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left", display: "flex", flexDirection: "column", color: "#000", padding: "6rem", background: "#fff", fontFamily: "'Times New Roman', Times, serif" }}>
    <div style={{ height: "32px", background: "#000", width: "100%", position: "absolute", top: 0, left: 0 }} />
    <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "30px" }}>
      <h4 style={{ margin: 0, fontSize: "64px", color: "#000", fontWeight: "bold", letterSpacing: "4px" }}>YOUR NAME</h4>
      <p style={{ margin: "16px 0 0 0", fontSize: "22px", color: "#64748b" }}>City, State | (555) 000-0000 | email@example.com</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
      <div>
        <strong style={{ fontSize: "28px", color: "#000", display: "block", marginBottom: "12px", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Objective</strong>
        <div style={{ fontSize: "24px", color: "#334155", lineHeight: "1.6", marginBottom: "30px", textAlign: "justify" }}>
          Results-driven software developer seeking to contribute technical expertise to an innovative team focused on creating impactful digital solutions.
        </div>
      </div>
      <div>
        <strong style={{ fontSize: "28px", color: "#000", display: "block", marginBottom: "12px", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Skills</strong>
        <div style={{ fontSize: "24px", color: "#334155", display: "flex", gap: "2rem" }}>
          <div>• JavaScript<br />• Python<br />• SQL</div>
          <div>• Problem Solving<br />• Teamwork</div>
        </div>
      </div>
    </div>
  </div>
);

const ModernPreview = () => (
  <div style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left", display: "flex", flexDirection: "column", color: "#000", fontFamily: "'Times New Roman', Times, serif", background: "#fff" }}>
    <div style={{ width: "100%", padding: "6rem 4rem", background: "#000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h4 style={{ margin: 0, fontSize: "56px", color: "#fff", fontWeight: "300", lineHeight: "1.2" }}>YOUR NAME<br /><span style={{ fontSize: "28px", color: "#cbd5e1" }}>Full Stack Developer</span></h4>
      <div style={{ textAlign: "right", fontSize: "22px", color: "#f8fafc", lineHeight: "1.6" }}>
        portfolio.com<br />(555) 123-4567<br />Your City, State
      </div>
    </div>
    <div style={{ display: "flex", flexGrow: 1 }}>
      <div style={{ width: "30%", borderRight: "4px solid #e2e8f0", padding: "4rem", background: "#f8fafc" }}>
        <strong style={{ fontSize: "22px", color: "#000", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", display: "block" }}>EDUCATION</strong>
        <div style={{ fontSize: "20px", color: "#334155", marginTop: "16px", lineHeight: "1.6" }}>
          <strong>B.Tech CS</strong><br />University Name<br />2020 – 2024
        </div>
        <strong style={{ fontSize: "22px", color: "#000", textTransform: "uppercase", display: "block", marginTop: "40px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>SKILLS</strong>
        <div style={{ fontSize: "20px", color: "#334155", marginTop: "16px", lineHeight: "1.8" }}>• React<br />• Node.js<br />• MongoDB<br />• Docker</div>
      </div>
      <div style={{ width: "70%", padding: "4rem" }}>
        <strong style={{ fontSize: "26px", color: "#000", display: "block", marginBottom: "16px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>PROFESSIONAL SUMMARY</strong>
        <div style={{ fontSize: "22px", color: "#334155", lineHeight: "1.7", marginBottom: "40px", textAlign: "justify" }}>
          Innovative developer with a strong foundation in modern web technologies. Dedicated to writing clean code and creating exceptional user experiences.
        </div>
        <strong style={{ fontSize: "26px", color: "#000", display: "block", marginBottom: "16px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>EXPERIENCE</strong>
        <div style={{ fontSize: "22px", color: "#334155", lineHeight: "1.6" }}>
          <strong>Software Developer</strong> | TechCorp Inc.<br />
          <em>2022 – Present</em><br />
          • Built scalable REST APIs serving 100K+ users<br />
          • Reduced load time by 60% through optimization
        </div>
      </div>
    </div>
  </div>
);

const ProfessionalPreview = () => (
  <div style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left", display: "flex", flexDirection: "column", color: "#e2e8f0", padding: "6rem", background: "#ffffff", fontFamily: "'Times New Roman', Times, serif" }}>
    <div style={{ textAlign: "left", marginBottom: "40px", paddingBottom: "30px", borderBottom: "2px solid #e2e8f0" }}>
      <h4 style={{ margin: 0, fontSize: "64px", color: "#000", fontWeight: "bold" }}>YOUR NAME</h4>
      <p style={{ margin: "16px 0 0 0", fontSize: "24px", color: "#000" }}>Data Scientist | New York, NY | (555) 000-0000 | name@email.com</p>
    </div>
    <div style={{ display: "flex", gap: "4rem" }}>
      <div style={{ width: "60%" }}>
        <strong style={{ fontSize: "26px", color: "#000", display: "block", marginBottom: "20px", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Summary</strong>
        <div style={{ fontSize: "22px", color: "#334155", lineHeight: "1.7", marginBottom: "40px", textAlign: "justify" }}>
          Results-driven professional with 5+ years of experience. Expert in data analysis, machine learning, and driving actionable insights from complex datasets.
        </div>
        <strong style={{ fontSize: "26px", color: "#000", display: "block", marginBottom: "20px", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Experience</strong>
        <div style={{ fontSize: "22px", color: "#334155", lineHeight: "1.6" }}>
          <strong style={{ color: "#000" }}>Lead Data Scientist</strong> | Analytics Corp<br />
          <em>2021 – Present</em><br />
          • Developed ML models improving revenue 35%<br />• Led team of 6 data analysts
        </div>
      </div>
      <div style={{ width: "40%" }}>
        <strong style={{ fontSize: "26px", color: "#000", display: "block", marginBottom: "20px", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Skills</strong>
        <div style={{ fontSize: "22px", color: "#334155", lineHeight: "1.8" }}>
          • Python & R<br />• Machine Learning<br />• SQL & NoSQL<br />• Data Visualization
        </div>
        <strong style={{ fontSize: "26px", color: "#000", display: "block", marginTop: "40px", marginBottom: "20px", textTransform: "uppercase", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Education</strong>
        <div style={{ fontSize: "22px", color: "#334155", lineHeight: "1.6" }}>
          <strong style={{ color: "#000" }}>M.S. Data Science</strong><br />Columbia University<br />2019 – 2021
        </div>
      </div>
    </div>
  </div>
);

const ExecutivePreview = () => (
  <div style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left", padding: "6rem", background: "#fff", color: "#1e293b", fontFamily: "serif" }}>
    <div style={{ borderBottom: "4px solid #1e293b", paddingBottom: "30px", marginBottom: "40px" }}>
      <h4 style={{ margin: 0, fontSize: "64px", fontWeight: "900", letterSpacing: "2px" }}>YOUR NAME</h4>
      <p style={{ margin: "10px 0 0", fontSize: "24px", color: "#64748b", textTransform: "uppercase" }}>Senior Executive | Strategy & Operations</p>
    </div>
    <div style={{ fontSize: "22px", lineHeight: "1.8" }}>
      <strong style={{ fontSize: "26px", borderBottom: "1px solid #e2e8f0", display: "block", marginBottom: "20px" }}>PROFESSIONAL PROFILE</strong>
      <p style={{ marginBottom: "40px" }}>Visionary leader with 15+ years of experience in driving global business transformation and operational excellence.</p>
      <strong style={{ fontSize: "26px", borderBottom: "1px solid #e2e8f0", display: "block", marginBottom: "20px" }}>CORE COMPETENCIES</strong>
      <p>• Strategic Planning • P&L Management • Organizational Leadership</p>
    </div>
  </div>
);

const TechPreview = () => (
  <div style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left", padding: "6rem", background: "#000", color: "#10b981", fontFamily: "monospace" }}>
    <div style={{ border: "2px solid #10b981", padding: "40px", marginBottom: "40px" }}>
      <h4 style={{ margin: 0, fontSize: "64px", fontWeight: "bold" }}>&gt; YOUR_NAME</h4>
      <p style={{ margin: "10px 0 0", fontSize: "24px" }}>[ Software Architect / Cloud Specialist ]</p>
    </div>
    <div style={{ fontSize: "22px", lineHeight: "1.6" }}>
      <div style={{ marginBottom: "30px" }}>
        <span style={{ color: "#fff" }}>const</span> <span style={{ color: "#38bdf8" }}>skills</span> = [
        <div style={{ paddingLeft: "40px" }}>'Kubernetes', 'AWS', 'Go', 'Distributed Systems'</div>
        ];
      </div>
      <div style={{ marginBottom: "30px" }}>
        <span style={{ color: "#fff" }}>function</span> <span style={{ color: "#fbbf24" }}>getExperience</span>() &#123;
        <div style={{ paddingLeft: "40px" }}>
          return '10+ years of high-performance computing';
        </div>
        &#125;
      </div>
    </div>
  </div>
);

const templates = [
  {
    id: "creative",
    name: "Creative",
    desc: "Bold sidebar with high contrast, minimal look",
    accentColor: "#333333",
    preview: <CreativePreview />,
  },
  {
    id: "simple",
    name: "Simple",
    desc: "Clean and minimal — the ATS-optimized safe choice",
    accentColor: "#555555",
    preview: <SimplePreview />,
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Professional two-column layout for tech professionals",
    accentColor: "#000000",
    preview: <ModernPreview />,
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Elegant structured theme — clear and impactful",
    accentColor: "#111827",
    preview: <ProfessionalPreview />,
  },
];

const TemplateSelectPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("modern");
  const [isBuilding, setIsBuilding] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileApi.get(token).then(p => {
      if (p) { setProfile(p); setSelected(p.template || "modern"); }
    }).catch(() => {});
  }, [token]);

  const handleBuild = async () => {
    setIsBuilding(true);
    try {
      if (profile) {
        await profileApi.save(token, { ...profile, template: selected });
      }
      navigate("/resume-view");
    } catch {
      navigate("/resume-view");
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", color: "#e2e8f0",
      fontFamily: "'Inter', 'Outfit', system-ui, sans-serif",
      paddingBottom: "5rem"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center", padding: "3.5rem 2rem 2.5rem",
        borderBottom: "1px solid rgba(148,163,184,0.1)"
      }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span style={{
            display: "inline-block", background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: "20px",
            padding: "0.3rem 1rem", fontSize: "0.78rem", color: "#a5b4fc",
            fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            marginBottom: "1rem"
          }}>Step 2 of 3 — Choose Your Template</span>
          <h1 style={{ margin: "0 0 0.75rem", fontSize: "2.4rem", fontWeight: 800, color: "#f8fafc" }}>
            Pick Your Professional Template
          </h1>
          <p style={{ margin: 0, fontSize: "1.05rem", color: "#64748b", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
            Select a design that represents your style. Your profile data will be automatically populated into the chosen template.
          </p>
        </motion.div>
      </div>

      {/* Template grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2rem", maxWidth: "1280px", margin: "3rem auto", padding: "0 2rem"
      }}>
        {templates.map((tmpl, i) => {
          const isSelected = selected === tmpl.id;
          return (
            <motion.div key={tmpl.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => setSelected(tmpl.id)}
              style={{
                cursor: "pointer", display: "flex", flexDirection: "column",
                gap: "1rem", position: "relative"
              }}>

              {/* Template card preview */}
              <div style={{
                position: "relative", aspectRatio: "1/1.4",
                borderRadius: "16px", overflow: "hidden",
                border: isSelected ? `3px solid ${tmpl.accentColor}` : "3px solid transparent",
                boxShadow: isSelected
                  ? `0 0 0 2px rgba(0,0,0,0.5), 0 20px 50px ${tmpl.accentColor}50`
                  : "0 10px 30px rgba(0,0,0,0.4)",
                transition: "all 0.3s ease",
                transform: isSelected ? "scale(1.03)" : "scale(1)"
              }}>
                {tmpl.preview}

                {/* Selected badge */}
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                      position: "absolute", top: "12px", right: "12px",
                      background: tmpl.accentColor, color: "#000",
                      borderRadius: "50%", width: "32px", height: "32px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem", fontWeight: 700,
                      boxShadow: `0 2px 10px ${tmpl.accentColor}80`
                    }}>✓</motion.div>
                )}

                {/* Hover overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: isSelected ? "transparent" : "rgba(15,23,42,0.0)",
                  transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {!isSelected && (
                    <div style={{
                      background: "rgba(15,23,42,0.7)", borderRadius: "8px",
                      padding: "0.5rem 1rem", color: "#fff", fontSize: "0.85rem",
                      fontWeight: 600, opacity: 0, transition: "opacity 0.2s",
                      backdropFilter: "blur(4px)"
                    }} className="template-select-hover">Select</div>
                  )}
                </div>
              </div>

              {/* Template info */}
              <div style={{ padding: "0 0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: tmpl.accentColor
                  }} />
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: "#f1f5f9" }}>{tmpl.name}</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5 }}>
                  {tmpl.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Build CTA */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(15,23,42,0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(99,102,241,0.2)",
        padding: "1.25rem 2rem", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        maxWidth: "100%", boxSizing: "border-box"
      }}>
        <div>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Selected Template</p>
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#c7d2fe" }}>
            {templates.find(t => t.id === selected)?.name}
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => navigate("/profile")}
            style={{
              background: "transparent", border: "1px solid rgba(148,163,184,0.3)",
              color: "#94a3b8", borderRadius: "10px", padding: "0.65rem 1.25rem",
              fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit"
            }}>← Edit Profile</button>
          <motion.button
            onClick={handleBuild} disabled={isBuilding}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{
              background: isBuilding ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6 60%,#a855f7)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "0.75rem 2rem", fontSize: "0.95rem", fontWeight: 700,
              cursor: isBuilding ? "not-allowed" : "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)"
            }}>
            {isBuilding ? "Building..." : "Build My Resume →"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectPage;
