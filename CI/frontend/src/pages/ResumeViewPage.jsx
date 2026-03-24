import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { profileApi, resumeApi } from "../api";
import { useAuth } from "../context/AuthContext";

// ── Shared helper: tag list ───────────────────────────────────────────────────
const TagList = ({ items, color }) => {
  const tags = typeof items === "string"
    ? items.split(/,|\n/).map(s => s.trim()).filter(Boolean)
    : (items || []);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
      {tags.map((tag, i) => (
        <span key={i} style={{
          background: `${color}18`, border: `1px solid ${color}40`,
          color: color, borderRadius: "20px", padding: "0.2rem 0.65rem",
          fontSize: "0.75rem", fontWeight: 500
        }}>{tag}</span>
      ))}
    </div>
  );
};

// ── MODERN TEMPLATE ───────────────────────────────────────────────────────────
const ModernTemplate = ({ profile }) => {
  const p = profile.personalInfo || {};
  const e = profile.education || {};
  const s = profile.skills || {};
  const secStyle = { marginBottom: "1.5rem" };
  const h3Style = { margin: "0 0 0.75rem", fontSize: "0.80rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#000000", borderBottom: "2px solid #e5e7eb", paddingBottom: "0.4rem", fontWeight: 700 };

  return (
    <div className="resume-a4" style={{ fontFamily: "'Inter', Arial, sans-serif", color: "#1e293b", background: "#ffffff" }}>
      {/* Header */}
      <div style={{ background: "#000000", color: "#ffffff", padding: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {p.profilePhoto && (
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" }}>
              <img src={p.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ margin: "0 0 0.25rem", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px" }}>{p.fullName?.toUpperCase() || "YOUR NAME"}</h1>
            <p style={{ margin: 0, fontSize: "1rem", color: "#e2e8f0", fontWeight: 500 }}>{profile.preferredRole}</p>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.6" }}>
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <div style={secStyle}>
            <h3 style={h3Style}>SKILLS</h3>
            {s.technicalSkills && <><p style={{ margin: "0 0 0.3rem", fontSize: "0.73rem", color: "#4b5563", fontWeight: 600 }}>Technical</p><TagList items={s.technicalSkills} color="#000000" /></>}
            {s.softSkills && <><p style={{ margin: "0.75rem 0 0.3rem", fontSize: "0.73rem", color: "#4b5563", fontWeight: 600 }}>Soft Skills</p><TagList items={s.softSkills} color="#000000" /></>}
            {s.tools && <><p style={{ margin: "0.75rem 0 0.3rem", fontSize: "0.73rem", color: "#4b5563", fontWeight: 600 }}>Tools</p><TagList items={s.tools} color="#000000" /></>}
          </div>
          <div style={secStyle}>
            <h3 style={h3Style}>EDUCATION</h3>
            {e.university && <><p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: "#1e293b" }}>{e.university}</p>
            <p style={{ margin: "0.15rem 0", fontSize: "0.8rem", color: "#475569" }}>{e.degree}{e.fieldOfStudy && ` – ${e.fieldOfStudy}`}</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>{[e.startYear, e.endYear || e.graduationYear].filter(Boolean).join(" – ")}{e.cgpa && ` | CGPA: ${e.cgpa}`}</p></>}
          </div>
          {(profile.certifications || []).filter(c => c.name).length > 0 && (
            <div style={secStyle}>
              <h3 style={h3Style}>CERTIFICATIONS</h3>
              {(profile.certifications || []).filter(c => c.name).map((c, i) => (
                <div key={i} style={{ marginBottom: "0.5rem" }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem", color: "#1e293b" }}>{c.name}</p>
                  {(c.issueMonth || c.issueYear) && <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>{c.issueMonth} {c.issueYear}</p>}
                </div>
              ))}
            </div>
          )}
          {profile.personalInfo?.languages && (
            <div style={secStyle}>
              <h3 style={h3Style}>LANGUAGES</h3>
              <TagList items={profile.personalInfo.languages} color="#1e293b" />
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ padding: "1.5rem" }}>
          {profile.professionalSummary && (
            <div style={secStyle}>
              <h3 style={h3Style}>PROFESSIONAL SUMMARY</h3>
              <p style={{ margin: 0, fontSize: "0.87rem", lineHeight: 1.7, color: "#334155" }}>{profile.professionalSummary}</p>
            </div>
          )}
          {(profile.internships || []).filter(x => x.company).length > 0 && (
            <div style={secStyle}>
              <h3 style={h3Style}>EXPERIENCE</h3>
              {(profile.internships || []).filter(x => x.company).map((item, i) => (
                <div key={i} style={{ marginBottom: "1rem", paddingLeft: "0.75rem", borderLeft: "2px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "0.9rem", color: "#1e293b" }}>{item.role}</strong>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{item.duration}</span>
                  </div>
                  <p style={{ margin: "0.1rem 0", fontSize: "0.82rem", color: "#000000", fontWeight: 600 }}>{item.company}{item.location && <span style={{ fontWeight: 400, color: "#64748b", marginLeft: "0.4rem" }}>· {item.location}</span>}</p>
                  {item.technologiesUsed && <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "#64748b" }}>Tech: {item.technologiesUsed}</p>}
                </div>
              ))}
            </div>
          )}
          {(profile.projects || []).filter(x => x.title).length > 0 && (
            <div style={secStyle}>
              <h3 style={h3Style}>PROJECTS</h3>
              {(profile.projects || []).filter(x => x.title).map((item, i) => (
                <div key={i} style={{ marginBottom: "1rem", paddingLeft: "0.75rem", borderLeft: "2px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "0.9rem", color: "#1e293b" }}>{item.title}</strong>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{item.duration}</span>
                  </div>
                  {item.domain && <p style={{ margin: "0.1rem 0", fontSize: "0.78rem", color: "#111827", fontWeight: 600 }}>{item.domain}</p>}
                  {item.description && <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#475569", lineHeight: 1.5 }}>{item.description}</p>}
                  {item.technologiesUsed && <TagList items={item.technologiesUsed} color="#000000" />}
                </div>
              ))}
            </div>
          )}
          {profile.achievements && (
            <div style={secStyle}>
              <h3 style={h3Style}>ACHIEVEMENTS</h3>
              {(typeof profile.achievements === "string" ? profile.achievements : profile.achievements.join("\n"))
                .split("\n").filter(Boolean).map((a, i) => (
                  <p key={i} style={{ margin: "0.3rem 0", fontSize: "0.85rem", color: "#334155" }}>• {a.replace(/^[•\-]\s*/, "")}</p>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── PROFESSIONAL TEMPLATE ─────────────────────────────────────────────────────
const ProfessionalTemplate = ({ profile }) => {
  const p = profile.personalInfo || {};
  const e = profile.education || {};
  const s = profile.skills || {};
  const accent = "#000000"; // Professional Black
  const h3Style = { margin: "0 0 0.75rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: accent, fontWeight: 800, paddingBottom: "0.4rem", borderBottom: `2px solid #e5e7eb` };

  return (
    <div className="resume-a4" style={{ fontFamily: "'Inter', Arial, sans-serif", color: "#333", background: "#ffffff", minHeight: "297mm", position: "relative" }}>
      <div style={{ padding: "3rem 3rem 1.5rem", borderBottom: "2px solid #e2e8f0", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {p.profilePhoto && (
            <div style={{ width: "90px", height: "90px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${accent}30` }}>
              <img src={p.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ margin: "0 0 0.2rem", fontSize: "2.5rem", fontWeight: 800, color: "#1e293b", textTransform: "uppercase", letterSpacing: "-0.5px" }}>{p.fullName?.toUpperCase() || "YOUR NAME"}</h1>
            <p style={{ margin: "0.5rem 0", fontSize: "1.05rem", color: accent, fontWeight: 600 }}>
              {profile.preferredRole}
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#475569", lineHeight: "1.6" }}>
          {p.phone && <div>{p.phone}</div>}
          {p.email && <div>{p.email}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div style={{ color: accent }}>{p.linkedin}</div>}
        </div>
      </div>
      <div style={{ padding: "0 3rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "3rem" }}>
          <div>
            {profile.professionalSummary && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>SUMMARY</h3>
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.8, color: "#475569" }}>{profile.professionalSummary}</p>
              </div>
            )}
            {(profile.internships || []).filter(x => x.company).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>EXPERIENCE</h3>
                {(profile.internships || []).filter(x => x.company).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>{item.role}</strong>
                      <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>{item.duration}</span>
                    </div>
                    <p style={{ margin: "0.2rem 0", fontSize: "0.85rem", color: accent, fontWeight: 600 }}>{item.company} {item.location && `· ${item.location}`}</p>
                    {item.technologiesUsed && <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#475569" }}>Tech: {item.technologiesUsed}</p>}
                  </div>
                ))}
              </div>
            )}
            {(profile.projects || []).filter(x => x.title).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>PROJECTS</h3>
                {profile.projects.filter(x => x.title).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.2rem" }}>
                    <strong style={{ fontSize: "0.95rem", color: "#1e293b", display: "block" }}>{item.title}</strong>
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "#475569" }}>{item.description}</p>
                    {item.technologiesUsed && <TagList items={item.technologiesUsed} color={accent} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={h3Style}>SKILLS</h3>
              {s.technicalSkills && <TagList items={s.technicalSkills} color={accent} />}
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={h3Style}>EDUCATION</h3>
              {e.university && (
                <div style={{ fontSize: "0.85rem", color: "#475569" }}>
                  <strong style={{ color: "#1e293b", fontSize: "0.9rem" }}>{e.degree}</strong><br />
                  <span style={{ color: accent, fontWeight: 500 }}>{e.university}</span><br />
                  {[e.startYear, e.endYear || e.graduationYear].filter(Boolean).join(" – ")}
                </div>
              )}
            </div>
            {(profile.certifications || []).filter(c => c.name).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>CERTIFICATIONS</h3>
                {profile.certifications.filter(c => c.name).map((c, i) => (
                    <div key={i} style={{ marginBottom: "0.75rem" }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: "#1e293b" }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>{c.issueMonth} {c.issueYear}</p>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── CREATIVE TEMPLATE ─────────────────────────────────────────────────────────
const CreativeTemplate = ({ profile }) => {
  const p = profile.personalInfo || {};
  const e = profile.education || {};
  const s = profile.skills || {};
  const accent = "#000000"; // Black Accent
  const textDark = "#1e293b"; // Dark text for white background

  return (
    <div className="resume-a4" style={{ fontFamily: "'Inter', Arial, sans-serif", color: textDark, background: "#ffffff", minHeight: "297mm", display: "flex", borderLeft: `12px solid ${accent}` }}>
      {/* Sidebar - Creative Style */}
      <div style={{ width: "32%", background: "#f8fafc", padding: "2.5rem 2rem", borderRight: "1px solid #e2e8f0" }}>
        {p.profilePhoto ? (
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", border: `4px solid ${accent}`, marginBottom: "2rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
             <img src={p.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ) : (
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem", boxShadow: `0 10px 20px ${accent}30` }}>
            {p.fullName?.[0]?.toUpperCase() || "Y"}
          </div>
        )}
        <div style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "0.85rem", color: accent, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1rem" }}>CONTACT</h3>
          <p style={{ margin: "0.5rem 0", fontSize: "0.85rem", color: "#475569" }}>{p.location}</p>
          <p style={{ margin: "0.5rem 0", fontSize: "0.85rem", color: "#475569" }}>{p.phone}</p>
          <p style={{ margin: "0.5rem 0", fontSize: "0.85rem", color: "#475569" }}>{p.email}</p>
        </div>
        <div style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "0.85rem", color: accent, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1rem" }}>SKILLS</h3>
          {s.technicalSkills && <TagList items={s.technicalSkills} color={accent} />}
        </div>
        <div>
          <h3 style={{ fontSize: "0.85rem", color: accent, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1rem" }}>EDUCATION</h3>
          {e.university && (
            <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5 }}>
              <strong style={{ color: "#1e293b", fontSize: "0.9rem" }}>{e.degree}</strong><br />
              {e.university}<br />
              {e.graduationYear || e.endYear}
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "3rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ margin: 0, fontSize: "3.2rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.1 }}>{p.fullName?.toUpperCase() || "YOUR NAME"}</h1>
          <p style={{ margin: "0.5rem 0", fontSize: "1.2rem", color: accent, fontWeight: 700, letterSpacing: "1px" }}>{profile.preferredRole}</p>
        </div>
        {profile.professionalSummary && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 800, borderBottom: `3px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem" }}>ABOUT ME</h3>
            <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.8, color: "#475569" }}>{profile.professionalSummary}</p>
          </div>
        )}
        {(profile.internships || []).filter(x => x.company).length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 800, borderBottom: `3px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem" }}>EXPERIENCE</h3>
            {profile.internships.filter(x => x.company).map((item, i) => (
              <div key={i} style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>{item.role} @ {item.company}</strong>
                  <span style={{ fontSize: "0.8rem", color: accent, fontWeight: 700 }}>{item.duration}</span>
                </div>
                {item.technologiesUsed && <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.3rem 0" }}>{item.technologiesUsed}</p>}
              </div>
            ))}
          </div>
        )}
        {(profile.projects || []).filter(x => x.title).length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 800, borderBottom: `3px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem" }}>PROJECTS</h3>
            {profile.projects.filter(x => x.title).map((item, i) => (
              <div key={i} style={{ marginBottom: "1.2rem" }}>
                <strong style={{ fontSize: "1.05rem", color: "#0f172a", display: "block" }}>{item.title}</strong>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}
        {profile.achievements && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 800, borderBottom: `3px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem" }}>ACHIEVEMENTS</h3>
            {(typeof profile.achievements === "string" ? profile.achievements : profile.achievements.join("\n"))
              .split("\n").filter(Boolean).map((a, i) => (
                <p key={i} style={{ margin: "0.4rem 0", fontSize: "0.9rem", color: "#475569" }}>• {a.replace(/^[•\-]\s*/, "")}</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── SIMPLE TEMPLATE ───────────────────────────────────────────────────────────
const SimpleTemplate = ({ profile }) => {
  const p = profile.personalInfo || {};
  const e = profile.education || {};
  const s = profile.skills || {};
  const accent = "#000000"; // Minimal Black
  const h3Style = { margin: "1.5rem 0 0.75rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1.5px", color: accent, fontWeight: 800, borderBottom: `2px solid #e5e7eb`, paddingBottom: "0.3rem" };

  return (
    <div className="resume-a4" style={{ fontFamily: "'Inter', Arial, sans-serif", color: "#334155", background: "#ffffff", minHeight: "297mm", borderTop: `10px solid ${accent}` }}>
      <div style={{ padding: "3rem 3rem 2rem", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
        {p.profilePhoto && (
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 1.5rem", border: `2px solid ${accent}` }}>
              <img src={p.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
        )}
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "2.4rem", fontWeight: 800, color: "#0f172a", letterSpacing: "1px" }}>{p.fullName?.toUpperCase() || "YOUR NAME"}</h1>
        <p style={{ fontSize: "1.1rem", color: accent, fontWeight: 600, marginBottom: "1rem" }}>{profile.preferredRole}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", color: "#64748b", fontSize: "0.85rem" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: "1rem 3.5rem 3rem" }}>
        {profile.professionalSummary && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={h3Style}>Professional Summary</h3>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#475569" }}>{profile.professionalSummary}</p>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "3rem" }}>
          <div>
            {(profile.internships || []).filter(x => x.company).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>Experience</h3>
                {profile.internships.filter(x => x.company).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{item.role} @ {item.company}</strong>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.duration}</span>
                    </div>
                    {item.technologiesUsed && <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" }}>{item.technologiesUsed}</p>}
                  </div>
                ))}
              </div>
            )}
            {(profile.projects || []).filter(x => x.title).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>Projects</h3>
                {profile.projects.filter(x => x.title).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.25rem" }}>
                    <strong style={{ color: "#0f172a" }}>{item.title}</strong>
                    <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0.25rem 0" }}>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 style={h3Style}>Skills</h3>
            {s.technicalSkills && <TagList items={s.technicalSkills} color={accent} />}
            <h3 style={h3Style}>Education</h3>
            {e.university && (
              <div style={{ fontSize: "0.9rem", color: "#475569" }}>
                <strong style={{ color: "#0f172a" }}>{e.degree}</strong>
                <p style={{ margin: "0.25rem 0" }}>{e.university}</p>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{e.graduationYear || e.endYear}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Executive and Tech templates removed to keep original four

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
const ResumeViewPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    profileApi.get(token)
      .then(p => { setProfile(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handlePrint = () => window.print();

  const handleAnalyze = async () => {
    if (!profile) return;
    setAnalyzing(true);
    try {
      const resp = await resumeApi.analyzeProfile(token, profile);
      // Navigate to insights dashboard securely without requiring an upload prompt
      navigate("/resume-upload", { state: { predefinedAnalysis: resp, fromProfileBuilder: true } }); 
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const renderTemplate = () => {
    if (!profile) return null;
    switch (profile.template) {
      case "professional": return <ProfessionalTemplate profile={profile} />;
      case "creative": return <CreativeTemplate profile={profile} />;
      case "simple": return <SimpleTemplate profile={profile} />;
      default: return <ModernTemplate profile={profile} />;
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "50px", height: "50px", border: "3px solid rgba(99,102,241,0.2)",
          borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite",
          margin: "0 auto 1rem"
        }} />
        <p style={{ color: "#64748b", fontFamily: "Inter, sans-serif" }}>Building your resume...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", flexDirection: "column", gap: "1rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ fontSize: "3rem" }}>📄</div>
      <h2 style={{ color: "#f1f5f9", margin: 0 }}>No Profile Found</h2>
      <p style={{ color: "#64748b", margin: 0 }}>Complete your profile first to generate a resume.</p>
      <button onClick={() => navigate("/profile")}
        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.75rem 1.5rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        Build Profile →
      </button>
    </div>
  );

  const templateLabels = { 
    modern: "Modern", 
    professional: "Professional", 
    creative: "Creative", 
    simple: "Simple"
  };

    const bgColors = {
      modern: "#f8fafc",
      professional: "#0f172a",
      creative: "#fdf4ff",
      simple: "#f3f4f6"
    };

    return (
      <div data-resume-page="true" style={{
        minHeight: "100vh", background: "#0f172a",
        paddingBottom: "5rem", transition: "background 0.4s ease",
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        {/* Action bar */}
        <div className="resume-action-bar no-print" style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(25px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0.85rem 2rem", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "10px",
            width: "36px", height: "36px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1rem", color: "#fff",
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)"
          }}>✦</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>Resume Preview</h2>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a2b8" }}>
              Template: <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{templateLabels[profile.template] || "Modern"}</span>
              {profile.personalInfo?.fullName && ` · ${profile.personalInfo.fullName}`}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={() => navigate("/profile")}
            style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0", borderRadius: "8px", padding: "0.5rem 1rem",
              fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
            ✏ Edit Profile
          </button>
          <button onClick={() => navigate("/template-select")}
            style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0", borderRadius: "8px", padding: "0.5rem 1rem",
              fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
            🎨 Change Template
          </button>
          <motion.button onClick={handleAnalyze} disabled={analyzing}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{
              background: analyzing ? "rgba(16,185,129,0.5)" : "linear-gradient(135deg,#10b981,#059669)", color: "#fff",
              border: "none", borderRadius: "8px", padding: "0.55rem 1.25rem",
              fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              boxShadow: analyzing ? "none" : "0 4px 15px rgba(16,185,129,0.3)", display: "flex",
              alignItems: "center", gap: "0.4rem"
            }}>
            {analyzing ? "Analyzing..." : "✨ Get Career Insights"}
          </motion.button>
          <motion.button onClick={handlePrint}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{
              background: "rgba(255,255,255,0.05)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.55rem 1.25rem",
              fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: "0.4rem"
            }}>
            ⬇ Download PDF
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(10,14,33,0.9)", display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem"
            }}>
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
              <div style={{ position: "absolute", inset: 0, border: "4px solid rgba(99,102,241,0.2)", borderRadius: "50%" }} />
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ position: "absolute", inset: 0, border: "4px solid transparent", borderTopColor: "#6366f1", borderRadius: "50%" }} 
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#fff", margin: "0 0 0.5rem" }}>AI Brain at Work...</h3>
              <p style={{ color: "#64748b", margin: 0 }}>Analyzing your professional profile for ATS compatibility</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A4 Center Container */}
      <div className="resume-container-print" style={{ 
        display: "flex", justifyContent: "center", padding: "4rem 1rem",
        overflowX: "auto"
      }}>
        <div style={{ 
          width: "210mm", minHeight: "297mm", 
          background: "#fff", boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
          position: "relative", borderRadius: "2px"
        }} ref={printRef}>
          {renderTemplate()}
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; padding: 0 !important; }
          header, .no-print, .resume-action-bar, .app-shell > header, [class*="topbar"] { display: none !important; }
          .resume-container-print { padding: 0 !important; display: block !important; margin: 0 !important; margin-left: 0 !important; }
          .resume-a4 { width: 210mm !important; min-height: 297mm !important; border: none !important; box-shadow: none !important; margin: 0 !important; }
          @page { size: A4 portrait; margin: 0; }
        }
        .resume-a4 { width: 100%; min-height: 297mm; box-sizing: border-box; }
        .resume-container-print::-webkit-scrollbar { height: 8px; }
        .resume-container-print::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ResumeViewPage;
