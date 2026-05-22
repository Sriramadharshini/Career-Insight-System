import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { profileApi, resumeApi } from "../api";
import { NavbarActions } from "../components/common/NavbarPortals";
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
          fontSize: "0.85rem", fontWeight: 500
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
  const headingStyle = { fontSize: "16px", margin: "0 0 0.5rem", fontWeight: "bold", color: "#000000", lineHeight: 1.1 };
  const subTextStyle = { fontSize: "14px", color: "#333333", margin: "0 0 1rem" };
  const bodyStyle = { fontSize: "14px", color: "#111111", lineHeight: 1.6, margin: "0.25rem 0" };
  const h3Style = { margin: "0 0 0.5rem", fontSize: "18px", textTransform: "uppercase", color: "#000000", borderBottom: "2px solid #000", paddingBottom: "0.4rem", fontWeight: "bold" };
  const secStyle = { marginBottom: "1.5rem" };

  return (
    <div className="resume-a4" style={{ fontFamily: "'Times New Roman', Times, serif", color: "#111", background: "#ffffff", textAlign: "left" }}>
      {/* Header */}
      <div style={{ borderBottom: "3px solid #000", padding: "2.5rem 2.5rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {p.profilePhoto && (
            <div style={{ width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", border: "3px solid #000" }}>
              <img src={p.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ margin: "0", fontSize: "32px", fontWeight: "bold" }}>{p.fullName || "YOUR NAME"}</h1>
            {profile.preferredRole && <p style={{ fontSize: "18px", color: "#333", margin: "0.3rem 0 0", fontWeight: "bold" }}>{profile.preferredRole}</p>}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "14px", color: "#333", lineHeight: 1.6 }}>
          {p.email && <div style={{ marginBottom: "2px" }}>{p.email}</div>}
          {p.phone && <div style={{ marginBottom: "2px" }}>{p.phone}</div>}
          {p.location && <div style={{ marginBottom: "2px" }}>{p.location}</div>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <div style={secStyle}>
            <h3 style={h3Style}>SKILLS</h3>
            {s.technicalSkills && <><p style={{ margin: "0 0 0.3rem", fontSize: "14px", color: "#000", fontWeight: "bold" }}>Technical</p><TagList items={s.technicalSkills} color="#000000" /></>}
            {s.softSkills && <><p style={{ margin: "0.75rem 0 0.3rem", fontSize: "14px", color: "#000", fontWeight: "bold" }}>Soft Skills</p><TagList items={s.softSkills} color="#000000" /></>}
            {s.tools && <><p style={{ margin: "0.75rem 0 0.3rem", fontSize: "14px", color: "#000", fontWeight: "bold" }}>Tools</p><TagList items={s.tools} color="#000000" /></>}
          </div>
          <div style={secStyle}>
            <h3 style={h3Style}>EDUCATION</h3>
            {e.university && <><p style={{ margin: 0, fontWeight: "bold", fontSize: "14px", color: "#000" }}>{e.university}</p>
            <p style={{ margin: "0.15rem 0", fontSize: "14px", color: "#333" }}>{e.degree}{e.fieldOfStudy && ` – ${e.fieldOfStudy}`}</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>{[e.startYear, e.endYear || e.graduationYear].filter(Boolean).join(" – ")}{e.cgpa && ` | CGPA: ${e.cgpa}`}</p></>}
          </div>
          {(profile.certifications || []).filter(c => c.name).length > 0 && (
            <div style={secStyle}>
              <h3 style={h3Style}>CERTIFICATIONS</h3>
              {(profile.certifications || []).filter(c => c.name).map((c, i) => (
                <div key={i} style={{ marginBottom: "0.5rem" }}>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px", color: "#000" }}>{c.name}</p>
                  {(c.issueMonth || c.issueYear) && <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>{c.issueMonth} {c.issueYear}</p>}
                </div>
              ))}
            </div>
          )}
          {p.languages && (
            <div style={secStyle}>
              <h3 style={h3Style}>LANGUAGES</h3>
              <TagList items={p.languages} color="#000" />
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ padding: "1.5rem" }}>
          {profile.professionalSummary && (
            <div style={secStyle}>
              <h3 style={h3Style}>PROFESSIONAL SUMMARY</h3>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: "#111", textAlign: "justify" }}>{profile.professionalSummary}</p>
            </div>
          )}
          {(profile.internships || []).filter(x => x.company).length > 0 && (
            <div style={secStyle}>
              <h3 style={h3Style}>EXPERIENCE</h3>
              {(profile.internships || []).filter(x => x.company).map((item, i) => (
                <div key={i} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "16px", color: "#000" }}>{item.role}</strong>
                    <span style={{ fontSize: "13px", color: "#555" }}>{item.duration}</span>
                  </div>
                  <p style={{ margin: "0.1rem 0", fontSize: "14px", color: "#222", fontWeight: "bold" }}>{item.company}{item.location && <span style={{ fontWeight: "normal", color: "#555", marginLeft: "0.4rem" }}>· {item.location}</span>}</p>
                  {item.technologiesUsed && <p style={{ margin: "0.25rem 0 0", fontSize: "13px", color: "#444" }}>Tech: {item.technologiesUsed}</p>}
                </div>
              ))}
            </div>
          )}
          {(profile.projects || []).filter(x => x.title).length > 0 && (
            <div style={secStyle}>
              <h3 style={h3Style}>PROJECTS</h3>
              {(profile.projects || []).filter(x => x.title).map((item, i) => (
                <div key={i} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "16px", color: "#000" }}>{item.title}</strong>
                    <span style={{ fontSize: "13px", color: "#555" }}>{item.duration}</span>
                  </div>
                  {item.domain && <p style={{ margin: "0.1rem 0", fontSize: "13px", color: "#222", fontWeight: "bold" }}>{item.domain}</p>}
                  {item.description && <p style={{ margin: "0.25rem 0 0", fontSize: "14px", color: "#111", lineHeight: 1.5, textAlign: "justify" }}>{item.description}</p>}
                </div>
              ))}
            </div>
          )}
          {profile.achievements && (
            <div style={secStyle}>
              <h3 style={h3Style}>ACHIEVEMENTS</h3>
              {(typeof profile.achievements === "string" ? profile.achievements : profile.achievements.join("\n"))
                .split("\n").filter(Boolean).map((a, i) => (
                  <p key={i} style={{ margin: "0.3rem 0", fontSize: "14px", color: "#111" }}>• {a.replace(/^[•\-]\s*/, "")}</p>
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
  const h3Style = { margin: "0 0 0.5rem", fontSize: "18px", textTransform: "uppercase", color: accent, fontWeight: "bold", paddingBottom: "0.4rem", borderBottom: "2px solid #ccc" };

  return (
    <div className="resume-a4" style={{ fontFamily: "'Times New Roman', Times, serif", color: "#000", background: "#ffffff", minHeight: "297mm", position: "relative", textAlign: "left" }}>
      <div style={{ padding: "3rem 3rem 1.5rem", borderBottom: "2px solid #e2e8f0", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {p.profilePhoto && (
            <div style={{ width: "90px", height: "90px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${accent}30` }}>
              <img src={p.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ margin: "0 0 0.2rem", fontSize: "32px", fontWeight: "bold", color: "#000", textTransform: "uppercase" }}>{p.fullName || "YOUR NAME"}</h1>
            {profile.preferredRole && (
              <p style={{ margin: "0.5rem 0", fontSize: "18px", color: accent, fontWeight: "bold" }}>
                {profile.preferredRole}
              </p>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "14px", color: "#333", lineHeight: "1.6" }}>
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
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.8, color: "#111", textAlign: "justify" }}>{profile.professionalSummary}</p>
              </div>
            )}
            {(profile.internships || []).filter(x => x.company).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>EXPERIENCE</h3>
                {(profile.internships || []).filter(x => x.company).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <strong style={{ fontSize: "16px", color: "#000", fontWeight: "bold" }}>{item.role}</strong>
                      <span style={{ fontSize: "13px", color: "#555" }}>{item.duration}</span>
                    </div>
                    <p style={{ margin: "0.2rem 0", fontSize: "14px", color: accent, fontWeight: "bold" }}>{item.company} {item.location && `· ${item.location}`}</p>
                    {item.technologiesUsed && <p style={{ margin: "0.3rem 0 0", fontSize: "13px", color: "#444" }}>Tech: {item.technologiesUsed}</p>}
                  </div>
                ))}
              </div>
            )}
            {(profile.projects || []).filter(x => x.title).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>PROJECTS</h3>
                {profile.projects.filter(x => x.title).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.2rem" }}>
                    <strong style={{ fontSize: "16px", color: "#000", fontWeight: "bold", display: "block" }}>{item.title}</strong>
                    <p style={{ margin: "0.25rem 0", fontSize: "14px", color: "#111", lineHeight: 1.5, textAlign: "justify" }}>{item.description}</p>
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
                <div style={{ fontSize: "14px", color: "#333" }}>
                  <strong style={{ color: "#000", fontSize: "16px", fontWeight: "bold" }}>{e.degree}</strong><br />
                  <span style={{ color: accent, fontWeight: "bold" }}>{e.university}</span><br />
                  <span style={{ fontSize: "13px", color: "#555" }}>{[e.startYear, e.endYear || e.graduationYear].filter(Boolean).join(" – ")}</span>
                </div>
              )}
            </div>
            {(profile.certifications || []).filter(c => c.name).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>CERTIFICATIONS</h3>
                {profile.certifications.filter(c => c.name).map((c, i) => (
                    <div key={i} style={{ marginBottom: "0.75rem" }}>
                      <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px", color: "#000" }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>{c.issueMonth} {c.issueYear}</p>
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
  const textDark = "#111111"; // Dark text for white background

  return (
    <div className="resume-a4" style={{ fontFamily: "'Times New Roman', Times, serif", color: textDark, background: "#ffffff", minHeight: "297mm", display: "flex", borderLeft: `8px solid ${accent}`, textAlign: "left" }}>
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
          <h3 style={{ fontSize: "18px", color: accent, fontWeight: "bold", textTransform: "uppercase", borderBottom: "2px solid #ccc", paddingBottom: "0.4rem", marginBottom: "1rem" }}>CONTACT</h3>
          {p.location && <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#111" }}>{p.location}</p>}
          {p.phone && <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#111" }}>{p.phone}</p>}
          {p.email && <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#111" }}>{p.email}</p>}
        </div>
        <div style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "18px", color: accent, fontWeight: "bold", textTransform: "uppercase", borderBottom: "2px solid #ccc", paddingBottom: "0.4rem", marginBottom: "1rem" }}>SKILLS</h3>
          {s.technicalSkills && <TagList items={s.technicalSkills} color={accent} />}
        </div>
        <div>
          <h3 style={{ fontSize: "18px", color: accent, fontWeight: "bold", textTransform: "uppercase", borderBottom: "2px solid #ccc", paddingBottom: "0.4rem", marginBottom: "1rem" }}>EDUCATION</h3>
          {e.university && (
            <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.5 }}>
              <strong style={{ color: "#000", fontSize: "16px", fontWeight: "bold" }}>{e.degree}</strong><br />
              {e.university}<br />
              <span style={{ fontSize: "13px", color: "#555" }}>{e.graduationYear || e.endYear}</span>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "3rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold", color: "#000" }}>{p.fullName || "YOUR NAME"}</h1>
          <p style={{ margin: "0.5rem 0", fontSize: "18px", color: accent, fontWeight: "bold" }}>{profile.preferredRole}</p>
        </div>
        {profile.professionalSummary && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "18px", color: "#000", fontWeight: "bold", borderBottom: `2px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem", textTransform: "uppercase" }}>ABOUT ME</h3>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.8, color: "#111" }}>{profile.professionalSummary}</p>
          </div>
        )}
        {(profile.internships || []).filter(x => x.company).length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "18px", color: "#000", fontWeight: "bold", borderBottom: `2px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem", textTransform: "uppercase" }}>EXPERIENCE</h3>
            {profile.internships.filter(x => x.company).map((item, i) => (
              <div key={i} style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "16px", color: "#000" }}>{item.role} @ {item.company}</strong>
                  <span style={{ fontSize: "13px", color: accent, fontWeight: "bold" }}>{item.duration}</span>
                </div>
                {item.technologiesUsed && <p style={{ fontSize: "13px", color: "#444", margin: "0.3rem 0" }}>{item.technologiesUsed}</p>}
              </div>
            ))}
          </div>
        )}
        {(profile.projects || []).filter(x => x.title).length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "18px", color: "#000", fontWeight: "bold", borderBottom: `2px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem", textTransform: "uppercase" }}>PROJECTS</h3>
            {profile.projects.filter(x => x.title).map((item, i) => (
              <div key={i} style={{ marginBottom: "1.2rem" }}>
                <strong style={{ fontSize: "16px", color: "#000", display: "block", fontWeight: "bold" }}>{item.title}</strong>
                <p style={{ margin: "0.25rem 0", fontSize: "14px", color: "#111", lineHeight: 1.6, textAlign: "justify" }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}
        {profile.achievements && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "18px", color: "#000", fontWeight: "bold", borderBottom: `2px solid ${accent}`, display: "inline-block", paddingBottom: "0.2rem", marginBottom: "1.2rem", textTransform: "uppercase" }}>ACHIEVEMENTS</h3>
            {(typeof profile.achievements === "string" ? profile.achievements : profile.achievements.join("\n"))
              .split("\n").filter(Boolean).map((a, i) => (
                <p key={i} style={{ margin: "0.4rem 0", fontSize: "14px", color: "#111" }}>• {a.replace(/^[•\-]\s*/, "")}</p>
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
  const h3Style = { margin: "1.5rem 0 0.5rem", fontSize: "18px", textTransform: "uppercase", color: accent, fontWeight: "bold", borderBottom: `2px solid #ccc`, paddingBottom: "0.3rem" };

  return (
    <div className="resume-a4" style={{ fontFamily: "'Times New Roman', Times, serif", color: "#111", background: "#ffffff", minHeight: "297mm", borderTop: `10px solid ${accent}`, textAlign: "left" }}>
      <div style={{ padding: "3rem 3rem 2rem", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
        {p.profilePhoto && (
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 1.5rem", border: `2px solid ${accent}` }}>
              <img src={p.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
        )}
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "32px", fontWeight: "bold", color: "#000" }}>{p.fullName || "YOUR NAME"}</h1>
        <p style={{ fontSize: "18px", color: accent, fontWeight: "bold", marginBottom: "1rem" }}>{profile.preferredRole}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", color: "#333", fontSize: "14px" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: "1rem 3.5rem 3rem" }}>
        {profile.professionalSummary && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={h3Style}>PROFESSIONAL SUMMARY</h3>
            <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#111", margin: 0, textAlign: "justify" }}>{profile.professionalSummary}</p>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "3rem" }}>
          <div>
            {(profile.internships || []).filter(x => x.company).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>EXPERIENCE</h3>
                {profile.internships.filter(x => x.company).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong style={{ fontSize: "16px", color: "#000", fontWeight: "bold" }}>{item.role} @ {item.company}</strong>
                      <span style={{ fontSize: "13px", color: "#555" }}>{item.duration}</span>
                    </div>
                    {item.technologiesUsed && <p style={{ fontSize: "13px", color: "#444", marginTop: "0.25rem" }}>{item.technologiesUsed}</p>}
                  </div>
                ))}
              </div>
            )}
            {(profile.projects || []).filter(x => x.title).length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={h3Style}>PROJECTS</h3>
                {profile.projects.filter(x => x.title).map((item, i) => (
                  <div key={i} style={{ marginBottom: "1.25rem" }}>
                    <strong style={{ color: "#000", fontWeight: "bold", fontSize: "16px" }}>{item.title}</strong>
                    <p style={{ fontSize: "14px", color: "#111", margin: "0.25rem 0", lineHeight: 1.6, textAlign: "justify" }}>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 style={h3Style}>SKILLS</h3>
            {s.technicalSkills && <TagList items={s.technicalSkills} color={accent} />}
            <h3 style={h3Style}>EDUCATION</h3>
            {e.university && (
              <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.5 }}>
                <strong style={{ color: "#000", fontWeight: "bold", fontSize: "16px" }}>{e.degree}</strong>
                <p style={{ margin: "0.25rem 0", color: "#111" }}>{e.university}</p>
                <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>{e.graduationYear || e.endYear}</p>
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
      await resumeApi.analyzeProfile(token, profile);
      // Navigate to the Career Hub after creating a resume
      localStorage.setItem("activeFlow", "build");
      navigate("/career-hub", { state: { isFromProfile: true } }); 
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
        {/* Action bar PORTALS */}
        <NavbarActions>
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
            {analyzing ? "Analyzing..." : "✨ Explore Career Path"}
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
        </NavbarActions>

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
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@300;400;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
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
