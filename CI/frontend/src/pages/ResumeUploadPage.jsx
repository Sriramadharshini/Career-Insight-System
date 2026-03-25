import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resumeApi } from "../api";
import { useAuth } from "../context/AuthContext";

// ─── Constants ────────────────────────────────────────────────────────────────
const SECTION_META = {
  professionalSummary: { label: "Professional Summary", icon: "📝", max: 15, color: "#6366f1" },
  skills:              { label: "Skills & Technologies",  icon: "⚡", max: 20, color: "#8b5cf6" },
  experience:          { label: "Experience / Internship", icon: "💼", max: 25, color: "#0ea5e9" },
  education:           { label: "Education",              icon: "🎓", max: 15, color: "#10b981" },
  certifications:      { label: "Certifications",         icon: "📜", max: 15, color: "#f59e0b" },
  achievements:        { label: "Achievements",           icon: "🏆", max: 10, color: "#f43f5e" },
};

const ROLE_DESCRIPTIONS = {
  "Frontend Developer":  "UI/UX, React, CSS, JavaScript",
  "Backend Developer":   "Node.js, APIs, Databases",
  "Full Stack Developer":"End-to-end web applications",
  "Data Analyst":        "SQL, Python, Analytics",
  "QA Engineer":         "Testing & Automation",
  "AI/ML Engineer":      "Machine Learning, Python",
};

// ─── Integrated ATS Score Meter ──────────────────────────────────────────────
const ATSScoreMeter = ({ score, size = 220 }) => {
  const [displayed, setDisplayed] = useState(0);
  const strokeWidth = 16;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = Math.PI * radius; // Semi-circle
  const offset = circumference - (displayed / 100) * circumference;
  
  const getColor = (s) => {
    if (s < 40) return "#f43f5e";
    if (s < 70) return "#f59e0b";
    return "#10b981";
  };
  
  const color = getColor(displayed);
  const grade = displayed < 40 ? "Needs Work" : displayed < 60 ? "Average" : displayed < 80 ? "Strong" : "Excellent";

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5s animation
    const startTime = performance.now();
    
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = easeOutQuart * score;
      setDisplayed(Math.round(current));
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div style={{ position: "relative", width: size, height: size * 0.7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
      <svg width={size} height={size / 2 + strokeWidth} style={{ transform: "rotate(0deg)" }}>
        {/* Background track */}
        <path
          d={`M ${strokeWidth},${size/2} A ${radius},${radius} 0 0 1 ${size - strokeWidth},${size/2}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth},${size/2} A ${radius},${radius} 0 0 1 ${size - strokeWidth},${size/2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke 0.5s ease", filter: `drop-shadow(0 0 12px ${color}80)` }}
        />
      </svg>
      
      <div style={{ position:"absolute", bottom: "10%", textAlign:"center", width: "100%" }}>
        <motion.div animate={{ scale: [0.9, 1] }} transition={{ duration: 0.5 }}>
          <span style={{ fontSize: "3.5rem", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.05em" }}>{displayed}</span>
          <span style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.4)", marginLeft: "0.2rem", fontWeight: 600 }}>/100</span>
        </motion.div>
        <div style={{ 
          marginTop: "0.25rem",
          padding: "0.4rem 1rem",
          background: `${color}15`,
          border: `1px solid ${color}30`,
          borderRadius: "999px",
          display: "inline-block"
        }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color, letterSpacing: "1.5px", textTransform:"uppercase" }}>{grade}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Animated Progress Bar ────────────────────────────────────────────────────
const AnimatedBar = ({ value, max, color, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const pct = Math.min((value / max) * 100, 100);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: "999px",
        background: `linear-gradient(90deg, ${color}99, ${color})`,
        width: `${width}%`, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: `0 0 10px ${color}80`
      }} />
    </div>
  );
};

// ─── Upload Zone ──────────────────────────────────────────────────────────────
const UploadZone = ({ file, onFile }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }, [onFile]);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "#6366f1" : file ? "#10b981" : "rgba(99,102,241,0.35)"}`,
        borderRadius: "16px", padding: "2.5rem 2rem", textAlign: "center", cursor: "pointer",
        background: dragging ? "rgba(99,102,241,0.08)" : file ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
        transition: "all 0.3s ease",
        boxShadow: dragging ? "0 0 30px rgba(99,102,241,0.2)" : "none"
      }}>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt"
        style={{ display:"none" }} onChange={e => onFile(e.target.files?.[0])} />
      <motion.div animate={{ y: dragging ? -8 : 0 }} transition={{ type:"spring" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>
          {file ? "✅" : dragging ? "📂" : "📄"}
        </div>
        <p style={{ fontSize: "1rem", fontWeight: 700, color: file ? "#10b981" : "#f1f5f9", margin: "0 0 0.4rem" }}>
          {file ? file.name : "Drop your resume here"}
        </p>
        <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
          {file ? `${(file.size / 1024).toFixed(1)} KB · Click to change` : "PDF, DOCX, TXT supported · Click or drag & drop"}
        </p>
      </motion.div>
    </div>
  );
};

// ─── Skill Chip ───────────────────────────────────────────────────────────────
const Chip = ({ label, color = "#6366f1" }) => (
  <span style={{
    background: `${color}18`, border: `1px solid ${color}40`, color,
    borderRadius: "20px", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 600
  }}>{label}</span>
);

// ─── Loading Spinner Overlay ──────────────────────────────────────────────────
const AnalyzingOverlay = () => (
  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    style={{
      position:"fixed", inset:0, background:"rgba(10,14,33,0.92)", zIndex:999,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.5rem"
    }}>
    <div style={{ position:"relative", width:80, height:80 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          position:"absolute", inset:0, border:`3px solid transparent`,
          borderTopColor: i===0?"#6366f1":i===1?"#8b5cf6":"#0ea5e9",
          borderRadius:"50%", animation:`spin${i+1} ${0.8+i*0.3}s linear infinite`
        }} />
      ))}
    </div>
    <div style={{ textAlign:"center" }}>
      <p style={{ color:"#f1f5f9", fontSize:"1.2rem", fontWeight:700, margin:"0 0 0.4rem" }}>Analyzing Resume…</p>
      <p style={{ color:"#64748b", fontSize:"0.85rem", margin:0 }}>AI is extracting skills, scoring sections and detecting gaps</p>
    </div>
    <style>{`
      @keyframes spin1{to{transform:rotate(360deg)}}
      @keyframes spin2{to{transform:rotate(-360deg)}}
      @keyframes spin3{to{transform:rotate(360deg)}}
    `}</style>
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const ResumeUploadPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const resultsRef = useRef(null);

  useEffect(() => {
    if (location.state?.predefinedAnalysis) {
      setAnalysis(location.state.predefinedAnalysis);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 300);
    }
  }, [token, location.state]);

  const isProfileGenerated = analysis?.isFromProfile || location.state?.fromProfileBuilder;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) { setError("Please select a resume file first."); return; }
    setError(""); setLoading(true);
    try {
      const data = await resumeApi.upload(token, file, targetRole);
      setAnalysis(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 200);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // Compute section max totals for percentage display
  const sectionEntries = analysis?.sectionScores
    ? Object.entries(Object.fromEntries
        ? (analysis.sectionScores instanceof Map
            ? analysis.sectionScores
            : Object.entries(analysis.sectionScores))
        : Object.entries(analysis.sectionScores))
    : [];

  const tabs = [
    { id:"overview",  label:"📊 Overview" },
    { id:"skills",    label:"⚡ Skills" },
    { id:"gaps",      label:"🎯 Gaps Analysis" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#090d1f", fontFamily:"'Inter','Outfit',system-ui,sans-serif", color:"#e2e8f0" }}>
      <AnimatePresence>{loading && <AnalyzingOverlay />}</AnimatePresence>

      {/* ── HERO ── */}
      <section style={{ position:"relative", overflow:"hidden", padding:"4rem 2rem 3rem" }}>
        {/* Background glow */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"center" }}>
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:"999px", padding:"0.35rem 1rem", marginBottom:"1.25rem" }}>
              <span style={{ color:"#818cf8", fontSize:"0.8rem", fontWeight:700 }}>✦ AI-Powered Analysis</span>
            </div>
            <h1 style={{ margin:"0 0 1rem", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, lineHeight:1.15, background:"linear-gradient(135deg,#f1f5f9 30%,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Upload Resume.<br />Get Your ATS Score.
            </h1>
            <p style={{ margin:"0 0 1.5rem", fontSize:"1rem", color:"#64748b", lineHeight:1.7 }}>
              Instantly analyze your resume with our AI engine. Receive section-wise scores, skill gap insights, matched keywords, and career recommendations — all in one scan.
            </p>
            <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", marginTop: "1.25rem" }}>
              {[
                { icon: "🔎", label: "Skill Extraction", color: "#6366f1" },
                { icon: "📈", label: "ATS Scoring",     color: "#10b981" },
                { icon: "🎯", label: "Gap Analysis",    color: "#f59e0b" },
                { icon: "🛣️", label: "Career Path",     color: "#38bdf8" }
              ].map((f) => (
                <motion.div key={f.label} whileHover={{ y: -2 }} style={{ display:"flex", alignItems:"center", gap:"0.6rem", background: "rgba(255,255,255,0.03)", padding: "0.5rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "1.2rem", filter: `drop-shadow(0 0 8px ${f.color}40)` }}>{f.icon}</span>
                  <span style={{ fontSize:"0.88rem", color:"#cbd5e1", fontWeight:600 }}>{f.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, delay:0.15 }}
            style={{ position:"relative" }}>
            <div style={{ position: "relative", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <img src="/resume_ai_scan_hero.png" alt="AI Resume Scan"
                style={{ width:"100%", borderRadius:"20px", display:"block", filter: "brightness(1.1) contrast(1.1)" }} />
            </div>
            {/* Floating badge */}
            <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity, duration:2.5, ease:"easeInOut" }}
              style={{ position:"absolute", bottom:"-10px", left:"1.5rem",
                background:"linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius:"12px",
                padding:"0.6rem 1.25rem", boxShadow:"0 8px 30px rgba(99,102,241,0.4)" }}>
              <p style={{ margin:0, fontSize:"0.72rem", color:"rgba(255,255,255,0.7)" }}>ATS Score</p>
              <p style={{ margin:0, fontSize:"1.4rem", fontWeight:800, color:"#fff" }}>{analysis?.atsScore ? `${analysis.atsScore} pts` : "100 pts"}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── UPLOAD FORM ── */}
      {!isProfileGenerated && (
      <section style={{ padding:"2rem 2rem 4rem", maxWidth:700, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          style={{ background:"rgba(15,20,40,0.8)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"24px", padding:"3rem", backdropFilter:"blur(20px)" }}>
          <h2 style={{ margin:"0 0 0.5rem", fontSize:"1.5rem", fontWeight:800, color:"#fff", display:"flex", alignItems:"center", gap: "0.75rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#818cf8" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Resume
          </h2>
          <p style={{ margin:"0 0 2rem", fontSize:"0.9rem", color:"#64748b", fontWeight: 500 }}>
            Upload PDF or DOCX — our AI will scan it and return your ATS score instantly
          </p>
          <form onSubmit={handleSubmit}>
            <UploadZone file={file} onFile={setFile} />
            {error && (
              <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                style={{ marginTop:"1.5rem", padding:"1rem 1.25rem", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"12px", display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <span style={{ fontSize:"1.2rem" }}>❌</span>
                <div>
                  <p style={{ margin:0, fontSize:"0.88rem", fontWeight:700, color:"#fca5a5" }}>Analysis Failed</p>
                  <p style={{ margin:0, fontSize:"0.75rem", color:"rgba(252,165,165,0.7)" }}>{error}. Please ensure your file is a valid PDF/DOCX and try again.</p>
                </div>
              </motion.div>
            )}
            <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              style={{ width:"100%", marginTop:"2rem", padding:"1.1rem", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", border:"none", borderRadius:"14px", fontSize:"1rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 25px rgba(99,102,241,0.4)" }}>
              ✦ Analyze Resume Now
            </motion.button>
          </form>
        </motion.div>
      </section>
      )}

      {/* ── RESULTS ── */}
      <AnimatePresence>
        {analysis && (
          <motion.section ref={resultsRef}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}
            style={{ padding:"0 2rem 6rem", maxWidth:1100, margin:"0 auto" }}>

            {/* Section divider */}
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
              <div style={{ flex:1, height:1, background:"rgba(99,102,241,0.2)" }} />
              <span style={{ fontSize:"0.8rem", color:"#6366f1", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>✦ Analysis Results ✦</span>
              <div style={{ flex:1, height:1, background:"rgba(99,102,241,0.2)" }} />
            </div>

            {/* ── PROMINENT CAREER CTA (always visible after analysis) ── */}
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1.5rem",
                background:"linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.08))",
                border:"1px solid rgba(16,185,129,0.35)", borderRadius:"16px", padding:"1.25rem 1.75rem",
                marginBottom:"1.5rem", flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                <div style={{ width: 50, height: 50, borderRadius: "12px", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 2v19"/></svg>
                </div>
                <div>
                  <p style={{ margin:"0 0 0.2rem", fontWeight:700, fontSize:"1rem", color:"#f1f5f9" }}>
                    Analysis complete! View your Career Suggestions
                  </p>
                  <p style={{ margin:0, fontSize:"0.82rem", color:"#64748b" }}>
                    Role-matched learning paths, curated websites &amp; YouTube guides based on your resume
                  </p>
                </div>
              </div>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                onClick={() => navigate("/career-suggestions", { state: { isFromProfile: false } })}
                style={{ padding:"0.75rem 1.75rem", background:"linear-gradient(135deg,#059669,#10b981)",
                  color:"#fff", border:"none", borderRadius:"12px", fontSize:"0.92rem", fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
                  boxShadow:"0 4px 20px rgba(16,185,129,0.4)" }}>
                View Career Suggestions →
              </motion.button>
            </motion.div>

            {/* Tabs */}
            <div style={{ display:"flex", gap:"1rem", marginBottom:"2.5rem", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", padding:"0.5rem" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ flex:1, padding:"0.8rem 0.5rem", borderRadius:"12px", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:"1rem", fontWeight:700, transition:"all 0.2s",
                    background: activeTab===tab.id ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent",
                    color: activeTab===tab.id ? "#fff" : "#64748b",
                    boxShadow: activeTab===tab.id ? "0 4px 15px rgba(99,102,241,0.3)" : "none"
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab: OVERVIEW ── */}
            {activeTab==="overview" && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
                {/* Score + summary row */}
                <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"2rem", marginBottom:"2rem", alignItems:"start" }}>
                  {/* Score ring */}
                  <div style={{ background:"rgba(15,20,40,0.8)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"24px", padding:"2rem 2.5rem", textAlign:"center", backdropFilter:"blur(20px)", minWidth:260, flexShrink:0 }}>
                    <p style={{ margin:"0 0 2rem", fontSize:"0.75rem", color:"#818cf8", fontWeight:800, textTransform:"uppercase", letterSpacing:"2px" }}>Overall ATS Score</p>
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <ATSScoreMeter score={analysis.atsScore || 0} />
                    </div>
                    <div style={{ marginTop:"2.5rem", display:"flex", flexWrap:"wrap", gap:"0.5rem", justifyContent:"center" }}>
                      {(analysis.matchedKeywords || []).slice(0,8).map(kw => (
                        <Chip key={kw} label={kw} color="#6366f1" />
                      ))}
                    </div>
                  </div>

                  {/* ATS image + quick stats */}
                  <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem", flex: 1 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
                      {[
                        { label:"Skill Readiness", value:`${analysis.skillReadinessIndex || 0}%`, color:"#10b981", icon: "⚡" },
                        { label:"Sections Found", value:`${Object.keys(analysis.sectionScores||{}).length} / 6`, color:"#38bdf8", icon: "🔍" },
                        { label:"Matched Keywords", value:analysis.matchedKeywords?.length || 0, color:"#8b5cf6", icon: "🔑" },
                        { label:"Improvement Tips", value:analysis.feedback?.length || 0, color:"#f59e0b", icon: "💡" },
                      ].map(stat => (
                        <motion.div key={stat.label} whileHover={{ y: -6 }} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"24px", padding:"1.5rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                            <p style={{ margin:0, fontSize:"0.8rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"1.2px", fontWeight: 800 }}>{stat.label}</p>
                            <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
                          </div>
                          <p style={{ margin:0, fontSize:"2.2rem", fontWeight:900, color:stat.color, letterSpacing: "-1.5px" }}>{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div style={{ background:"rgba(99,102,241,0.05)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:"20px", padding:"1.25rem", display:"flex", alignItems:"center", gap:"1rem" }}>
                      <div style={{ fontSize: "2rem" }}>📈</div>
                      <div>
                        <p style={{ margin:0, fontSize: "0.9rem", color: "#f1f5f9", fontWeight: 700 }}>Smart Analysis Active</p>
                        <p style={{ margin:0, fontSize: "0.8rem", color: "#64748b" }}>Your score is calculated based on keyword density and section completeness.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Scores */}
                <div style={{ background:"rgba(15,20,40,0.8)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"20px", padding:"1.75rem", backdropFilter:"blur(20px)", marginBottom:"2rem" }}>
                  <h3 style={{ margin:"0 0 1.5rem", fontSize:"0.95rem", fontWeight:700, color:"#f1f5f9" }}>📊 Section-wise ATS Breakdown</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
                    {Object.entries(analysis.sectionScores || {}).map(([key, val], i) => {
                      const meta = SECTION_META[key] || { label:key, icon:"•", max:20, color:"#6366f1" };
                      const score = typeof val === "number" ? val : 0;
                      return (
                        <div key={key} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${meta.color}22`, borderRadius:"12px", padding:"1rem" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                              <span style={{ fontSize:"1rem" }}>{meta.icon}</span>
                              <span style={{ fontSize:"0.82rem", fontWeight:600, color:"#e2e8f0" }}>{meta.label}</span>
                            </div>
                            <span style={{ fontSize:"0.88rem", fontWeight:800, color:meta.color }}>{score}<span style={{ fontSize:"0.7rem", color:"#475569" }}>/{meta.max}</span></span>
                          </div>
                          <AnimatedBar value={score} max={meta.max} color={meta.color} delay={i*80} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback */}
                {(analysis.feedback||[]).length > 0 && (
                  <div style={{ background:"rgba(15,20,40,0.8)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:"24px", padding:"2rem", backdropFilter:"blur(20px)" }}>
                    <h3 style={{ margin:"0 0 1.5rem", fontSize:"1.15rem", fontWeight:800, color:"#f1f5f9" }}>Improvement Suggestions</h3>
                    <div style={{ display:"grid", gap:"0.8rem" }}>
                      {analysis.feedback.map((item,i) => (
                        <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
                          style={{ display:"flex", gap:"1rem", alignItems:"flex-start", padding:"1rem 1.25rem", background:"rgba(251,191,36,0.05)", border:"1px solid rgba(251,191,36,0.15)", borderRadius:"14px" }}>
                          <span style={{ color:"#f59e0b", fontSize:"1.1rem", marginTop:"0.1rem" }}>⚡</span>
                          <span style={{ fontSize:"1.05rem", color:"#cbd5e1", lineHeight:1.6 }}>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Tab: SKILLS ── */}
            {activeTab==="skills" && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
                <div style={{ position:"relative", background:"#0f172a", border:"1px solid rgba(16,185,129,0.25)", borderRadius:"32px", padding:"3.5rem", overflow:"hidden", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                  
                  {/* Background Radial Glow */}
                  <div style={{ position:"absolute", top:"-50%", right:"-20%", width:"100%", height:"100%", background:"radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)", pointerEvents:"none" }} />
                  <div style={{ position:"absolute", bottom:"-50%", left:"-20%", width:"100%", height:"100%", background:"radial-gradient(circle, rgba(56,189,248,0.04), transparent 70%)", pointerEvents:"none" }} />

                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative", zIndex: 1 }}>
                    <div style={{ display:"inline-flex", background:"rgba(16,185,129,0.1)", padding:"0.5rem 1.25rem", borderRadius:"999px", color:"#6ee7b7", fontSize:"0.85rem", fontWeight:800, marginBottom:"1rem", textTransform:"uppercase", letterSpacing: "1.5px", border: "1px solid rgba(16,185,129,0.2)" }}>
                      Competency Matrix
                    </div>
                    <h3 style={{ margin:"0 0 1rem", fontSize:"2.5rem", fontWeight:900, color:"#fff", letterSpacing: "-1px" }}>Core Proficiencies</h3>
                    <p style={{ margin:0, color:"#94a3b8", fontSize:"1.1rem", maxWidth: 650, marginInline: "auto", lineHeight: 1.6 }}>
                      Expert-level skills and technologies verified from your professional profile.
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <h4 style={{ textAlign: "center", color: "#6ee7b7", marginBottom: "1.5rem", fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Skills Identified from Resume Content</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", justifyItems: "center", justifyContent: "center", position: "relative", zIndex: 1, marginBottom: "3rem" }}>
                    {(analysis.extractedSkills || analysis.matchedKeywords || []).map((s, i) => (
                      <motion.div key={s} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i * 0.05 }}
                        className="hover-glass" style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "0.75rem 1.5rem", color: "#6ee7b7", fontSize: "1.1rem", fontWeight: 700, boxShadow: "0 8px 16px rgba(0,0,0,0.2)", cursor:"default" }}>
                        <span style={{ fontSize: "1.3rem", background: "rgba(16,185,129,0.15)", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.3)" }}>
                          {["🎯", "💻", "⚡", "🔧", "💡", "🚀", "🛡️", "📊", "🧠", "🌐"][i % 10]}
                        </span>
                        {s}
                      </motion.div>
                    ))}
                  </div>

                  {!(analysis.extractedSkills||analysis.matchedKeywords||[]).length && (
                    <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)", marginBottom: "3rem" }}>
                      <p style={{ color:"#94a3b8", fontSize:"1.1rem", margin: 0 }}>No matching technical proficiencies detected. Consider enriching your profile.</p>
                    </div>
                  )}
                  
                  {/* Readiness Index */}
                  <div style={{ position: "relative", zIndex: 1, padding:"3rem", background:"linear-gradient(135deg, rgba(16,185,129,0.05), rgba(0,0,0,0))", border:"1px solid rgba(16,185,129,0.15)", borderRadius:"24px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                      <div>
                        <h3 style={{ margin:"0 0 0.5rem", fontSize:"1.3rem", fontWeight:900, color:"#fff" }}>Skill Readiness Index</h3>
                        <p style={{ margin:0, fontSize:"1rem", color:"#94a3b8" }}>Matches {(analysis.matchedKeywords||[]).length} core technical keywords for highly competitive roles.</p>
                      </div>
                      <span style={{ fontSize:"2.5rem", fontWeight:900, color:"#10b981", textShadow: "0 0 20px rgba(16,185,129,0.3)" }}>{analysis.skillReadinessIndex || 0}%</span>
                    </div>
                    <AnimatedBar value={analysis.skillReadinessIndex||0} max={100} color="#10b981" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Tab: GAPS (Redesigned) ── */}
            {activeTab==="gaps" && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
                <div style={{ position:"relative", background:"#0f172a", border:"1px solid rgba(234,179,8,0.25)", borderRadius:"32px", padding:"3.5rem", overflow:"hidden", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                  
                  {/* Background Radial Glow */}
                  <div style={{ position:"absolute", top:"-50%", left:"-20%", width:"100%", height:"100%", background:"radial-gradient(circle, rgba(234,179,8,0.06), transparent 70%)", pointerEvents:"none" }} />
                  <div style={{ position:"absolute", bottom:"-50%", right:"-20%", width:"100%", height:"100%", background:"radial-gradient(circle, rgba(244,63,94,0.04), transparent 70%)", pointerEvents:"none" }} />

                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative", zIndex: 1 }}>
                    <div style={{ display:"inline-flex", background:"rgba(234,179,8,0.1)", padding:"0.5rem 1.25rem", borderRadius:"999px", color:"#fde047", fontSize:"0.85rem", fontWeight:800, marginBottom:"1rem", textTransform:"uppercase", letterSpacing: "1.5px", border: "1px solid rgba(234,179,8,0.2)" }}>
                      Career Trajectory Audit
                    </div>
                    <h3 style={{ margin:"0 0 1rem", fontSize:"2.5rem", fontWeight:900, color:"#fff", letterSpacing: "-1px" }}>Timeline &amp; Competency Gaps</h3>
                    <p style={{ margin:0, color:"#94a3b8", fontSize:"1.1rem", maxWidth: 650, marginInline: "auto", lineHeight: 1.6 }}>
                      A professional assessment of your career continuity and missing core competencies required by top-tier employers.
                    </p>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", marginBottom:"3rem", position: "relative", zIndex: 1 }}>
                    {/* Education Tenure */}
                    <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"24px", padding:"2rem", display:"flex", alignItems:"center", gap:"1.5rem", transition:"all 0.3s" }} className="hover-glass">
                      <div style={{ width: 60, height: 60, borderRadius: "16px", background: "rgba(56,189,248,0.1)", color: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                        📅
                      </div>
                      <div>
                         <p style={{ margin:"0 0 0.25rem", fontSize:"0.85rem", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"1.5px", fontWeight: 800 }}>Post-Education Tenure</p>
                         <p style={{ margin:0, fontSize:"2rem", fontWeight:900, color:"#38bdf8" }}>{analysis.yearsSinceEducation !== null ? `${analysis.yearsSinceEducation} Years` : "N/A"}</p>
                         <p style={{ margin:"0.25rem 0 0", fontSize:"0.85rem", color:"#475569" }}>Since graduation</p>
                      </div>
                    </div>

                    {/* Timeline Integrity */}
                    <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"24px", padding:"2rem", display:"flex", alignItems:"center", gap:"1.5rem", transition:"all 0.3s" }} className="hover-glass">
                      <div style={{ width: 60, height: 60, borderRadius: "16px", background: (analysis.timelineGaps||[]).length > 0 ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)", color: (analysis.timelineGaps||[]).length > 0 ? "#f43f5e" : "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                        {(analysis.timelineGaps||[]).length > 0 ? "⏳" : "📈"}
                      </div>
                      <div>
                         <p style={{ margin:"0 0 0.25rem", fontSize:"0.85rem", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"1.5px", fontWeight: 800 }}>Timeline Integrity</p>
                         <p style={{ margin:0, fontSize:"2rem", fontWeight:900, color: (analysis.timelineGaps||[]).length > 0 ? "#f43f5e" : "#10b981" }}>{(analysis.timelineGaps||[]).length > 0 ? "Gap Detected" : "No Gaps"}</p>
                         <p style={{ margin:"0.25rem 0 0", fontSize:"0.85rem", color:"#475569" }}>Based on historical scan</p>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Card */}
                  <div style={{ position: "relative", zIndex: 1, padding:"3rem", background: (analysis.timelineGaps||[]).length > 0 ? "linear-gradient(135deg,rgba(244,63,94,0.15),rgba(159,18,57,0.05))" : "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,78,59,0.05))", border: `2px solid ${(analysis.timelineGaps||[]).length > 0 ? "rgba(244,63,94,0.6)" : "rgba(16,185,129,0.5)"}`, borderRadius:"24px", textAlign: "left", marginBottom: "3rem", display: "flex", gap: "2.5rem", alignItems: "center", boxShadow: (analysis.timelineGaps||[]).length > 0 ? "0 0 30px rgba(244,63,94,0.3)" : "0 0 30px rgba(16,185,129,0.2)" }}>
                      <div style={{ width: 90, height: 90, borderRadius: "50%", background: (analysis.timelineGaps||[]).length > 0 ? "rgba(244,63,94,0.2)" : "rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem", flexShrink: 0, boxShadow: `0 0 40px ${(analysis.timelineGaps||[]).length > 0 ? "rgba(244,63,94,0.4)" : "rgba(16,185,129,0.4)"}` }}>
                        {(analysis.timelineGaps||[]).length > 0 ? "📊" : "🚀"}
                      </div>
                      <div>
                        {/* Highlights */}
                        {(analysis.timelineGaps||[]).length > 0 && <span style={{ display:"inline-block", padding:"0.4rem 1rem", background:"#f43f5e", color:"#fff", fontSize:"0.8rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1px", borderRadius:"8px", marginBottom:"1rem" }}>Action Required</span>}
                        {!(analysis.timelineGaps||[]).length > 0 && <span style={{ display:"inline-block", padding:"0.4rem 1rem", background:"#10b981", color:"#fff", fontSize:"0.8rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1px", borderRadius:"8px", marginBottom:"1rem" }}>Excellent</span>}

                        <h4 style={{ margin:"0 0 0.75rem", fontSize:"1.5rem", fontWeight:900, color:"#fff", lineHeight: 1.4, letterSpacing: "-0.5px" }}>
                          {(analysis.timelineGaps||[]).length > 0 
                            ? `A career gap of ${analysis.yearsSinceEducation !== null ? analysis.yearsSinceEducation : (analysis.timelineGaps||[]).length} years has been identified after your most recent educational qualification.`
                            : "Your academic and career timeline appears consistent with no significant gaps identified."}
                        </h4>
                        <p style={{ margin:0, fontSize:"1.1rem", color: "#cbd5e1", lineHeight: 1.6, fontWeight: 500 }}>
                          {(analysis.timelineGaps||[]).length > 0 
                            ? "You may consider adding certifications, internships, or projects to strengthen your profile." 
                            : "Your career progression demonstrates excellent stability. This consistency is highly attractive to recruiters."}
                        </p>
                        
                        {(analysis.timelineGaps||[]).length > 0 && (
                          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", marginTop: "1.75rem" }}>
                            {analysis.timelineGaps.map((g,i) => (
                              <div key={i} style={{ padding:"0.6rem 1.25rem", background:"rgba(244,63,94,0.15)", border:"1px solid rgba(244,63,94,0.4)", borderRadius:"12px", fontSize:"1rem", fontWeight:700, color:"#ffe4e6", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🗓️</span> {g}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                  </div>

                  {/* Strategic Action Items (Vertical Timeline) */}
                  {(analysis.gapAnalysis||[]).length > 0 && (
                    <div style={{ position: "relative", zIndex: 1, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "3rem" }}>
                      <div style={{ marginBottom: "2.5rem" }}>
                        <h4 style={{ margin:"0 0 0.5rem", fontSize:"1.5rem", fontWeight:800, color:"#fff" }}>Strategic Action Items</h4>
                        <p style={{ margin:0, fontSize:"1rem", color:"#64748b" }}>Role-specific competency gaps to address for peak interview readiness.</p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        {analysis.gapAnalysis.map((gap, i) => (
                          <div key={i} style={{ display: "flex", gap: "1.5rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(234,179,8,0.1)", border: "2px solid rgba(234,179,8,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fef08a", fontSize: "1.2rem", zIndex: 2 }}>
                                {i + 1}
                              </div>
                              {i !== analysis.gapAnalysis.length - 1 && (
                                <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, rgba(234,179,8,0.3), rgba(234,179,8,0.05))", marginTop: "0.5rem", minHeight: "30px" }} />
                              )}
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem", flex: 1, transition: "all 0.3s" }} className="hover-glass">
                              <p style={{ margin:0, fontSize:"1.1rem", color:"#e2e8f0", lineHeight: 1.6 }}>{gap}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        html { font-size: 17px; }
        @media(max-width:768px){
          section > div { grid-template-columns: 1fr !important; }
          html { font-size: 15px; }
        }
      `}</style>
    </div>
  );
};

export default ResumeUploadPage;
