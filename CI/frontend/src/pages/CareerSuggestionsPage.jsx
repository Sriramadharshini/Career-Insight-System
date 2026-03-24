import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profileApi, resumeApi } from "../api";
import { useAuth } from "../context/AuthContext";

// ─── Default Track Data (Fallback) ──────────────────────────────────────────
const defaultTrack = {
  title: "Career Pathway",
  icon: "🚀",
  color: "#6366f1",
  grad: "linear-gradient(135deg,#4f46e5,#818cf8)",
  description: "Personalized learning roadmap to advance your professional journey.",
  websites: [
    { name: "MDN Web Docs", url: "https://developer.mozilla.org", focus: "Standard web technologies" },
    { name: "freeCodeCamp", url: "https://www.freecodecamp.org", focus: "Interactive learning" },
    { name: "Coursera", url: "https://www.coursera.org", focus: "Professional certifications" },
    { name: "Udemy", url: "https://www.udemy.com", focus: "Practical skill building" },
    { name: "LinkedIn Learning", url: "https://www.linkedin.com/learning", focus: "Business and tech skills" }
  ],
  youtube: [
    "Software Engineer Career Guide",
    "Modern Tech Stack Roadmap 2026",
    "How to Build a Technical Portfolio",
    "Technical Interview Preparation Tips",
    "High-Paying Tech Skills to Learn"
  ]
};

const TRACK_META = {
  frontend:  { title: "Frontend Development", icon: "🖥️", color: "#6366f1", grad: "linear-gradient(135deg,#4f46e5,#818cf8)", description: "Advance your skills in React, TypeScript, and modern UI/UX design." },
  backend:   { title: "Backend Development", icon: "⚙️", color: "#10b981", grad: "linear-gradient(135deg,#059669,#34d399)", description: "Master server-side logic, microservices, and scalable database architectures." },
  data:      { title: "Data & Analytics", icon: "📊", color: "#f59e0b", grad: "linear-gradient(135deg,#d97706,#fbbf24)", description: "Deep dive into statistical analysis, data visualization, and automated reporting." },
  ai:        { title: "AI & Machine Learning", icon: "🤖", color: "#ec4899", grad: "linear-gradient(135deg,#db2777,#f472b6)", description: "Build and deploy neural networks, LLMs, and intelligent automation systems." },
  cloud:     { title: "Cloud & DevOps", icon: "☁️", color: "#0ea5e9", grad: "linear-gradient(135deg,#0284c7,#38bdf8)", description: "Orchestrate containers, automate pipelines, and manage cloud infrastructure." },
  fullstack: { title: "Full Stack Development", icon: "🌐", color: "#8b5cf6", grad: "linear-gradient(135deg,#7c3aed,#a78bfa)", description: "Combine modern frontend and robust backend to build complete products." },
  mobile:    { title: "Mobile App Development", icon: "📱", color: "#f43f5e", grad: "linear-gradient(135deg,#e11d48,#fb7185)", description: "Create high-performance iOS and Android applications using native or cross-platform tools." },
  design:    { title: "UI/UX Design", icon: "🎨", color: "#fbbf24", grad: "linear-gradient(135deg,#d97706,#fcd34d)", description: "Design intuitive, visually stunning, and user-centered digital experiences." },
  security:  { title: "Cybersecurity", icon: "🛡️", color: "#22c55e", grad: "linear-gradient(135deg,#16a34a,#4ade80)", description: "Secure networks, protect data, and defend against advanced digital threats." },
  qa:        { title: "Quality Assurance", icon: "🔍", color: "#94a3b8", grad: "linear-gradient(135deg,#475569,#cbd5e1)", description: "Ensure software reliability through automated testing and rigorous quality standards." }
};

// ─── Card component ───────────────────────────────────────────────────────────
const GlassCard = ({ children, gradient, style = {} }) => (
  <div style={{
    background: gradient || "rgba(15,20,40,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "1.75rem",
    backdropFilter: "blur(20px)",
    ...style
  }}>{children}</div>
);

// ─── Resource Link ────────────────────────────────────────────────────────────
const ResourceLink = ({ href, index, name, focus, accent, icon }) => (
  <motion.a
    href={href} target="_blank" rel="noreferrer"
    whileHover={{ x:6, scale:1.02, backgroundColor:"rgba(255,255,255,0.05)" }}
    style={{ display:"flex", gap:"1.25rem", alignItems:"center", padding:"1.25rem 1.5rem",
      background:"rgba(255,255,255,0.02)", border:`1px solid ${accent}15`, borderRadius:"16px",
      textDecoration:"none", transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
    <div style={{ width:40, height:40, borderRadius:"10px", background:`${accent}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>
      {icon}
    </div>
    <div style={{ flex:1 }}>
      <p style={{ margin:"0 0 0.25rem", fontSize:"1.05rem", fontWeight:700, color:"#f1f5f9" }}>{name}</p>
      <p style={{ margin:0, fontSize:"0.85rem", color:"#94a3b8" }}>{focus}</p>
    </div>
    <span style={{ color:`${accent}80`, fontSize:"1.2rem" }}>↗</span>
  </motion.a>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const CareerSuggestionsPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeResource, setActiveResource] = useState("websites");

  useEffect(() => {
    profileApi.get(token).then(setProfile).catch(() => setProfile(null));
    resumeApi.getLatest(token).then(setAnalysis).catch(() => setAnalysis(null));
  }, [token]);

  const trackKey = analysis?.careerTrack || "fullstack";
  const trackInfo = TRACK_META[trackKey] || TRACK_META.fullstack;
  const suggestedSkills = analysis?.nextLevelSkills || [];
  const resources = analysis?.suggestedResources || defaultTrack;

  return (
    <div style={{ minHeight:"100vh", background:"#050816", fontFamily:"'Inter','Outfit',system-ui,sans-serif", color:"#e2e8f0", fontSize:"18px" }}>
      
      {/* ── HERO ── */}
      <section style={{ position:"relative", overflow:"hidden", padding:"6rem 2rem 4rem" }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", height:"100%", background:"radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)", pointerEvents:"none" }} />
        
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:"4rem", alignItems:"center" }}>
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"0.6rem", background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:"999px", padding:"0.5rem 1.25rem", marginBottom:"1.5rem" }}>
              <span style={{ fontSize:"1.2rem" }}>✨</span>
              <span style={{ color:"#a78bfa", fontSize:"0.95rem", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>Future-Proof Your Career</span>
            </div>
            <h1 style={{ margin:"0 0 1.5rem", fontSize:"clamp(2.5rem,5vw,3.8rem)", fontWeight:900, lineHeight:1.1, color:"#fff", letterSpacing:"-1px" }}>
              Unlock Your <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Next Level</span>
            </h1>
            <p style={{ margin:"0 0 2.5rem", fontSize:"1.25rem", color:"#94a3b8", lineHeight:1.7, maxWidth:650 }}>
              Based on your resume analysis, we've identified the <strong style={{ color:"#f1f5f9" }}>{trackInfo.title}</strong> track as your most effective growth path. Here are the skills and resources to get you there.
            </p>

            <div style={{ display:"flex", gap:"1rem" }}>
              <button 
                onClick={() => document.getElementById("skills-section")?.scrollIntoView({ behavior:"smooth" })}
                style={{ padding:"1.2rem 2.5rem", borderRadius:"16px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", fontSize:"1.05rem", fontWeight:700, cursor:"pointer", boxShadow:"0 10px 25px -5px rgba(99,102,241,0.4)", transition:"all 0.3s" }}>
                View Roadmap ↓
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8 }}
            style={{ display:"flex", justifyContent:"center" }}>
            <img src="/career_hero.png" alt="Career Path" style={{ width:"100%", maxWidth:500, filter:"drop-shadow(0 20px 50px rgba(99,102,241,0.2))" }} />
          </motion.div>
        </div>
      </section>

      {/* ── NEXT STEPS (only show if skills available) ── */}
      {suggestedSkills.length > 0 && (
        <section id="skills-section" style={{ maxWidth:1200, margin:"0 auto", padding:"4rem 2rem" }}>
          <div style={{ textAlign:"center", marginBottom:"4rem" }}>
            <h2 style={{ fontSize:"2.2rem", fontWeight:800, marginBottom:"1rem" }}>Skills to Learn Next 🛠️</h2>
            <p style={{ color:"#94a3b8", maxWidth:700, margin:"0 auto" }}>These selected technologies will complement your existing expertise and make your profile stand out to top-tier employers.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"1.5rem" }}>
            {suggestedSkills.map((skill, index) => (
              <motion.div key={skill} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:index*0.1 }}
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"24px", padding:"2rem", display:"flex", alignItems:"flex-start", gap:"1.5rem" }}>
                <div style={{ width:50, height:50, borderRadius:"15px", background:`${trackInfo.color}15`, color:trackInfo.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", flexShrink:0 }}>
                  {index + 1}
                </div>
                <div>
                  <h4 style={{ margin:"0 0 0.5rem", fontSize:"1.2rem", fontWeight:700, color:"#f1f5f9" }}>{skill}</h4>
                  <p style={{ margin:0, fontSize:"0.95rem", color:"#64748b", lineHeight:1.6 }}>Essential for progressing your career in {trackInfo.title}.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── RESOURCES ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"4rem 2rem 8rem" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(15,20,40,0.8),rgba(10,15,30,0.9))", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"40px", padding:"4rem", display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:"4rem", alignItems:"center" }}>
          <div>
            <div style={{ display:"inline-block", background:`${trackInfo.color}15`, color:trackInfo.color, padding:"0.6rem 1.2rem", borderRadius:"12px", fontSize:"0.9rem", fontWeight:700, marginBottom:"1.5rem", textTransform:"uppercase" }}>
              Learning Toolkit
            </div>
            <h2 style={{ fontSize:"2.5rem", fontWeight:900, marginBottom:"1.5rem", color:"#fff" }}>Curated Resources for {trackInfo.title}</h2>
            <p style={{ fontSize:"1.15rem", color:"#94a3b8", lineHeight:1.7, marginBottom:"2.5rem" }}>
              We've hand-picked the best documentation and video series to help you master your next set of skills efficiently.
            </p>
            
            <div style={{ display:"flex", gap:"0.75rem", background:"rgba(0,0,0,0.2)", padding:"0.5rem", borderRadius:"16px", width:"fit-content" }}>
              <button onClick={() => setActiveResource("websites")}
                style={{ padding:"0.8rem 1.75rem", borderRadius:"12px", border:"none", cursor:"pointer", transition:"0.3s", fontSize:"1rem", fontWeight:700,
                  background: activeResource==="websites" ? trackInfo.grad : "transparent",
                  color: activeResource==="websites" ? "#fff" : "#64748b" }}>
                Websites
              </button>
              <button onClick={() => setActiveResource("youtube")}
                style={{ padding:"0.8rem 1.75rem", borderRadius:"12px", border:"none", cursor:"pointer", transition:"0.3s", fontSize:"1rem", fontWeight:700,
                  background: activeResource==="youtube" ? "#f43f5e" : "transparent",
                  color: activeResource==="youtube" ? "#fff" : "#64748b" }}>
                YouTube
              </button>
            </div>

            <div style={{ marginTop:"3rem" }}>
              <img src="/learning_resources.png" alt="Resources" style={{ width:"100%", maxWidth:350, opacity:0.8 }} />
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <AnimatePresence mode="wait">
              {activeResource === "websites" ? (
                <motion.div key="websites" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                  style={{ display:"grid", gap:"1rem" }}>
                  {resources.websites.map((w, i) => (
                    <ResourceLink key={i} href={w.url} name={w.name} focus={w.focus} accent={trackInfo.color} icon="🌐" />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="youtube" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                  style={{ display:"grid", gap:"1rem" }}>
                  {resources.youtube.map((q, i) => (
                    <ResourceLink 
                      key={i} 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`} 
                      name={q} 
                      focus="Curated Video Guide" 
                      accent="#f43f5e" 
                      icon="▶" 
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── INTERVIEW PREP CTA ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 2rem 4rem" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(139,92,246,0.1),transparent)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:"32px", padding:"3rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"2rem", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:300 }}>
            <h3 style={{ fontSize:"1.75rem", fontWeight:800, color:"#fff", marginBottom:"1rem" }}>Ready for the real thing? 🎯</h3>
            <p style={{ color:"#94a3b8", fontSize:"1.05rem", lineHeight:1.6, margin:0 }}>
              Test your knowledge with our AI-powered Interview Simulator. Practice with timed questions tailored specifically to your {trackInfo.title} profile.
            </p>
          </div>
          <button onClick={() => navigate("/interview-prep")}
            style={{ padding:"1.2rem 2.5rem", borderRadius:"16px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", fontSize:"1.1rem", fontWeight:700, cursor:"pointer", transition:"0.3s", boxShadow:"0 10px 25px rgba(99,102,241,0.3)" }}>
            Start Mock Interview →
          </button>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 2rem 6rem", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:"1.5rem" }}>
          <button onClick={() => navigate("/resume-upload")}
            style={{ padding:"1.2rem 2.5rem", borderRadius:"16px", background:"rgba(255,255,255,0.05)", color:"#fff", border:"1px solid rgba(255,255,255,0.1)", fontSize:"1.05rem", fontWeight:700, cursor:"pointer", transition:"0.3s" }}>
            ← Back to Analysis
          </button>
          <button onClick={() => navigate("/profile")}
            style={{ padding:"1.2rem 2.5rem", borderRadius:"16px", background:"rgba(255,255,255,0.05)", color:"#fff", border:"1px solid rgba(255,255,255,0.1)", fontSize:"1.05rem", fontWeight:700, cursor:"pointer", transition:"0.3s" }}>
            ✏️ Update Profile
          </button>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        button:hover { transform: translateY(-3px); filter: brightness(1.1); }
        @media(max-width:768px){
          section > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
          div[style*="gridTemplateColumns: 1fr 1.2fr"] { grid-template-columns: 1fr !important; padding: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default CareerSuggestionsPage;
