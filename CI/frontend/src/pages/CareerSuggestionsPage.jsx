import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  TrendingUp, Sparkles, Zap, ExternalLink, Video, Brain, LayoutDashboard,
  MessageSquare, Users, Lightbulb, Shield, Database, Code2, 
  Terminal, Briefcase, Cloud, Workflow, CheckCircle2
} from "lucide-react";
import ModernHomeIcon from "../components/common/ModernHomeIcon";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarActions } from "../components/common/NavbarPortals";
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
  frontend: { title: "Frontend Development", icon: "🖥️", color: "#6366f1", grad: "linear-gradient(135deg,#4f46e5,#818cf8)", description: "Advance your skills in React, TypeScript, and modern UI/UX design." },
  backend: { title: "Backend Development", icon: "⚙️", color: "#10b981", grad: "linear-gradient(135deg,#059669,#34d399)", description: "Master server-side logic, microservices, and scalable database architectures." },
  data: { title: "Data & Analytics", icon: "📊", color: "#f59e0b", grad: "linear-gradient(135deg,#d97706,#fbbf24)", description: "Deep dive into statistical analysis, data visualization, and automated reporting." },
  ai: { title: "AI & Machine Learning", icon: "🤖", color: "#ec4899", grad: "linear-gradient(135deg,#db2777,#f472b6)", description: "Build and deploy neural networks, LLMs, and intelligent automation systems." },
  cloud: { title: "Cloud & DevOps", icon: "☁️", color: "#0ea5e9", grad: "linear-gradient(135deg,#0284c7,#38bdf8)", description: "Orchestrate containers, automate pipelines, and manage cloud infrastructure." },
  fullstack: { title: "Full Stack Development", icon: "🌐", color: "#8b5cf6", grad: "linear-gradient(135deg,#7c3aed,#a78bfa)", description: "Combine modern frontend and robust backend to build complete products." },
  mobile: { title: "Mobile App Development", icon: "📱", color: "#f43f5e", grad: "linear-gradient(135deg,#e11d48,#fb7185)", description: "Create high-performance iOS and Android applications using native or cross-platform tools." },
  design: { title: "UI/UX Design", icon: "🎨", color: "#fbbf24", grad: "linear-gradient(135deg,#d97706,#fcd34d)", description: "Design intuitive, visually stunning, and user-centered digital experiences." },
  security: { title: "Cybersecurity", icon: "🛡️", color: "#22c55e", grad: "linear-gradient(135deg,#16a34a,#4ade80)", description: "Secure networks, protect data, and defend against advanced digital threats." },
  qa: { title: "Quality Assurance", icon: "🔍", color: "#94a3b8", grad: "linear-gradient(135deg,#475569,#cbd5e1)", description: "Ensure software reliability through automated testing and rigorous quality standards." }
};

const SKILL_ICON_MAP = {
  // Languages & Core
  react:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  python:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  javascript:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  typescript:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  node:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  html:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  java:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  cpp:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  cplusplus:   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  csharp:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  php:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  go:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  rust:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
  kotlin:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  swift:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  ruby:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",

  // Frameworks & Libs
  nextjs:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  redux:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  tailwind:    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  bootstrap:   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  sass:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
  graphql:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  django:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  spring:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  tensorflow:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  pytorch:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",

  // Databases
  sql:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  mysql:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  postgresql:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  mongodb:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  redis:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",

  // Infrastructure
  docker:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  kubernetes:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  aws:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
  azure:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  git:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  jenkins:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",

  // Design
  figma:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  photoshop:   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
  canva:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"
};

const SOFT_SKILL_MAP = [
  { keywords: ["communication", "writing", "speaker", "presentation"], icon: MessageSquare, color: "#38bdf8" },
  { keywords: ["leadership", "management", "team", "mentoring", "direction"], icon: Users, color: "#8b5cf6" },
  { keywords: ["problem solving", "analytical", "critical thinking", "strategy", "insight" , "analysis"], icon: Brain, color: "#f59e0b" },
  { keywords: ["creativity", "design", "innovative", "brainstorming", "ideation", "ui", "ux"], icon: Lightbulb, color: "#f472b6" },
  { keywords: ["security", "privacy", "protection", "compliance", "audit"], icon: Shield, color: "#ef4444" },
  { keywords: ["testing", "quality", "qa", "validation", "verification"], icon: CheckCircle2, color: "#10b981" },
  { keywords: ["cloud", "serverless", "infrastructure", "scaling", "aws", "gcp", "azure"], icon: Cloud, color: "#0ea5e9" },
  { keywords: ["api", "rest", "backend", "integration", "endpoint"], icon: Workflow, color: "#6366f1" },
  { keywords: ["data", "db", "query", "optimize", "indexing", "statistics"], icon: Database, color: "#818cf8" },
  { keywords: ["coding", "programming", "logic", "algorithm", "clean code"], icon: Code2, color: "#10b981" },
  { keywords: ["terminal", "bash", "cli", "linux", "ops"], icon: Terminal, color: "#475569" },
  { keywords: ["business", "marketing", "finance", "economics"], icon: Briefcase, color: "#f59e0b" }
];

const SkillIcon = ({ skill, trackColor }) => {
  const lowerSkill = skill.toLowerCase();
  
  // 1. Try technical logos (Devicons)
  const techKey = Object.keys(SKILL_ICON_MAP).find(k => lowerSkill.includes(k));
  if (techKey) {
    return (
      <div style={{ width: 56, height: 56, borderRadius: "18px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }}>
        <img src={SKILL_ICON_MAP[techKey]} alt={skill} style={{ width: 32, height: 32, objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }}/>
      </div>
    );
  }

  // 2. Try soft skill categories (Lucide)
  const softMatch = SOFT_SKILL_MAP.find(s => s.keywords.some(k => lowerSkill.includes(k)));
  if (softMatch) {
    const IconComp = softMatch.icon;
    return (
      <div style={{ width: 56, height: 56, borderRadius: "18px", background: `${softMatch.color}15`, color: softMatch.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${softMatch.color}30` }}>
        <IconComp size={28} />
      </div>
    );
  }

  // 3. Fallback
  return (
    <div style={{ width: 56, height: 56, borderRadius: "18px", background: `${trackColor}10`, color: trackColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${trackColor}25` }}>
      <Zap size={26} />
    </div>
  );
};



// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const SkeletonPulse = ({ width = "100%", height = "1.2rem", radius = "8px", style = {} }) => (
  <div style={{
    width, height, borderRadius: radius,
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    ...style
  }} />
);

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
const ResourceLink = ({ href, index, name, focus, accent, isYoutube }) => {
  let domain = "google.com";
  try {
    domain = new URL(href).hostname;
  } catch (e) {
    console.warn("Invalid URL in ResourceLink:", href);
  }
  const logoUrl = isYoutube 
    ? "https://www.google.com/s2/favicons?sz=128&domain=youtube.com"
    : `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

  return (
    <motion.a
      href={href} target="_blank" rel="noreferrer"
      whileHover={{ x: 6, scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
      style={{
        display: "flex", gap: "1.25rem", alignItems: "center", padding: "1.25rem 1.5rem",
        background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}15`, borderRadius: "16px",
        textDecoration: "none", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>
      <div style={{ width: 44, height: 44, borderRadius: "12px", background: isYoutube ? "rgba(244,63,94,0.1)" : `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)" }}>
        <img 
          src={logoUrl} 
          alt={name} 
          style={{ width: "24px", height: "24px", objectFit: "contain" }}
          onError={(e) => { e.target.src = "https://www.google.com/s2/favicons?sz=64&domain=google.com"; }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: "0 0 0.25rem", fontSize: "1.05rem", fontWeight: 700, color: "#f1f5f9" }}>{name}</p>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>{focus}</p>
      </div>
      <span style={{ color: isYoutube ? "#f43f5e80" : `${accent}80`, fontSize: "1.1rem" }}>
        {isYoutube ? <Video size={18} /> : <ExternalLink size={18} />}
      </span>
    </motion.a>
  );
};

// ─── Full-page Loading State ──────────────────────────────────────────────────
const LoadingView = () => (
  <div style={{ minHeight: "100vh", background: "#050816", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", padding: "2rem", fontFamily: "'Inter','Outfit',system-ui,sans-serif" }}>
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
      <Brain size={52} color="#8b5cf6" />
    </motion.div>
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: "#f1f5f9", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.75rem" }}>
        AI is Analyzing Your Resume
      </h2>
      <p style={{ color: "#64748b", fontSize: "1.1rem", maxWidth: 480, lineHeight: 1.7 }}>
        Our Gemini AI is reading your profile, identifying your strengths, and crafting a personalized career roadmap just for you. This takes a few seconds…
      </p>
    </div>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          style={{ width: 10, height: 10, borderRadius: "50%", background: "#8b5cf6" }} />
      ))}
    </div>
  </div>
);

export const normalizeDomainName = (name) => {
  if (!name || typeof name !== 'string') return name;
  const n = name.trim().toLowerCase();
  if (['full stack', 'full-stack', 'fullstack', 'full stack developer'].includes(n)) return 'Full Stack Development';
  if (['front end', 'front-end', 'frontend', 'frontend developer', 'ui developer'].includes(n)) return 'Frontend Development';
  if (['back end', 'back-end', 'backend', 'backend developer'].includes(n)) return 'Backend Development';
  if (n === 'api' || n === 'rest api' || n === 'restful api') return 'API Design & Integration';
  if (n === 'microservices' || n === 'micro-services') return 'Microservices Architecture';
  if (n === 'performance' || n === 'performance optimization') return 'Performance & Scalability';
  if (n === 'testing' || n === 'qa' || n === 'unit testing') return 'Testing & Quality Assurance';
  if (['react', 'reactjs', 'react.js'].includes(n)) return 'React.js';
  if (['node', 'nodejs', 'node.js'].includes(n)) return 'Node.js';
  if (['vue', 'vuejs', 'vue.js'].includes(n)) return 'Vue.js';
  return name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const CareerSuggestionsPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeResource, setActiveResource] = useState("websites");

  const isFromProfile = location.state?.isFromProfile || analysis?.isFromProfile;

  useEffect(() => {
    Promise.all([
      profileApi.get(token).catch(() => null),
      resumeApi.getLatest(token).catch(() => null)
    ]).then(([prof, anal]) => {
      setProfile(prof);
      setAnalysis(anal);
      setLoading(false);
      
      // Log career suggestions view
      fetch("http://localhost:5002/api/resume/log-career-view", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }).catch(e => console.error("Failed to log view", e));
    });
  }, [token]);

  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  const insights = analysis?.roleSpecificInsights || [];
  const currentInsight = insights[selectedRoleIndex] || null;
  const trackKey = currentInsight?.trackKey || analysis?.careerTrack || "fullstack";
  const trackInfo = TRACK_META[trackKey] || TRACK_META.fullstack;

  const rawSkills = currentInsight?.nextLevelSkills || analysis?.nextLevelSkills || [];
  
  // Strict case-insensitive uniqueness and normalization for skills
  const suggestedSkills = [];
  const seenSkills = new Set();
  rawSkills.forEach(s => {
    if (typeof s === 'string') {
      const normalized = normalizeDomainName(s);
      const lower = normalized.toLowerCase();
      if (!seenSkills.has(lower)) {
        seenSkills.add(lower);
        suggestedSkills.push(normalized);
      }
    }
  });
  
  // Strict uniqueness for resources based on URL and Name
  let rawResources = currentInsight?.suggestedResources || analysis?.suggestedResources || defaultTrack;
  const uniqueWebsites = [];
  const seenUrls = new Set();
  (rawResources?.websites || []).forEach(w => {
    if (!seenUrls.has(w.url)) {
      seenUrls.add(w.url);
      uniqueWebsites.push(w);
    }
  });

  const uniqueYoutube = [];
  const seenYoutube = new Set();
  (rawResources?.youtube || []).forEach(y => {
    const lowerQ = typeof y === 'string' ? y.toLowerCase().trim() : '';
    if (lowerQ && !seenYoutube.has(lowerQ)) {
      seenYoutube.add(lowerQ);
      uniqueYoutube.push(y);
    }
  });

  const resources = { websites: uniqueWebsites, youtube: uniqueYoutube };
  let displayTitle = currentInsight?.role || trackInfo.title;
  displayTitle = normalizeDomainName(displayTitle);
  const roleSummary = currentInsight?.summary || null;
  const isAI = analysis?.aiCareerSuggestions === true;

  if (loading) return <LoadingView />;

  return (
    <div style={{ minHeight: "100vh", background: "#050816", fontFamily: "'Inter','Outfit',system-ui,sans-serif", color: "#e2e8f0", fontSize: "18px" }}>

      {/* ── NAVBAR PORTALS ── */}
      <NavbarActions>
        <button onClick={() => navigate(isFromProfile ? "/resume-view" : "/resume-upload")}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0", borderRadius: "8px", padding: "0.55rem 1rem",
            fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem",
            transition: "all 0.2s ease"
          }}>
          ← Back
        </button>
        <button onClick={() => navigate("/job-recommendations")}
          style={{
            background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", border: "none",
            borderRadius: "8px", padding: "0.55rem 1.25rem",
            fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem",
            boxShadow: "0 4px 15px rgba(245,158,11,0.3)", transition: "all 0.2s ease"
          }}>
          💼 Jobs
        </button>
      </NavbarActions>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "2rem 2rem 4rem" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "100%", background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "999px", padding: "0.5rem 1.25rem" }}>
                <span style={{ fontSize: "1.2rem" }}>✨</span>
                <span style={{ color: "#a78bfa", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Future-Proof Your Career</span>
              </div>
              {isAI && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg,rgba(236,72,153,0.15),rgba(139,92,246,0.15))", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "999px", padding: "0.5rem 1.25rem" }}>
                  <Brain size={16} color="#ec4899" />
                  <span style={{ color: "#ec4899", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.3px" }}>AI-Powered Analysis</span>
                </motion.div>
              )}
            </div>

            <h1 style={{ margin: "0 0 1.5rem", fontSize: "clamp(2.5rem,5vw,3.8rem)", fontWeight: 900, lineHeight: 1.1, color: "#fff", letterSpacing: "-1px" }}>
              Unlock Your <span style={{ background: "linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Next Level</span>
            </h1>
            <p style={{ margin: "0 0 2rem", fontSize: "1.25rem", color: "#94a3b8", lineHeight: 1.7, maxWidth: 650 }}>
              {isAI
                ? <>Our AI has analyzed your resume and identified <strong style={{ color: "#f1f5f9" }}>{displayTitle}</strong> as your strongest career fit. Explore the personalized roadmap below.</>
                : <>Based on your resume analysis, we've identified <strong style={{ color: "#f1f5f9" }}>{displayTitle}</strong> as a highly effective growth path for you. Here are the skills and resources to get you there.</>
              }
            </p>

            {insights.length > 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
                {insights.map((insight, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRoleIndex(idx)}
                    style={{
                      padding: "0.6rem 1.2rem", borderRadius: "12px", border: "none", cursor: "pointer", transition: "all 0.3s",
                      fontSize: "0.95rem", fontWeight: 700,
                      background: selectedRoleIndex === idx ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.05)",
                      color: selectedRoleIndex === idx ? "#fff" : "#94a3b8",
                      boxShadow: selectedRoleIndex === idx ? "0 4px 15px rgba(99,102,241,0.3)" : "none",
                      border: selectedRoleIndex !== idx ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent"
                    }}
                  >
                    {normalizeDomainName(insight.role)}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => document.getElementById("skills-section")?.scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "1.2rem 2.5rem", borderRadius: "16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 25px -5px rgba(99,102,241,0.4)", transition: "all 0.3s" }}>
                View Roadmap ↓
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            style={{ display: "flex", justifyContent: "center" }}>
            <img src="/career_hero.png" alt="Career Path" style={{ width: "100%", maxWidth: 500, filter: "drop-shadow(0 20px 50px rgba(99,102,241,0.2))" }} />
          </motion.div>
        </div>
      </section>

      {/* ── AI ROLE SUMMARY CARD ── */}
      {isAI && roleSummary && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 2rem" }}>
          <div style={{
            background: "linear-gradient(135deg,rgba(236,72,153,0.08),rgba(139,92,246,0.08))",
            border: "1px solid rgba(139,92,246,0.2)", borderRadius: "20px", padding: "1.75rem 2rem",
            display: "flex", alignItems: "flex-start", gap: "1.25rem"
          }}>
            <div style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", borderRadius: "14px", padding: "0.75rem", flexShrink: 0 }}>
              <Brain size={22} color="#fff" />
            </div>
            <div>
              <p style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "#ec4899", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                AI Career Analysis — {displayTitle}
              </p>
              <p style={{ margin: 0, color: "#c4c9d4", fontSize: "1.05rem", lineHeight: 1.7 }}>{roleSummary}</p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── NEXT STEPS (only show if skills available) ── */}
      {suggestedSkills.length > 0 && (
        <section id="skills-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              Skills to Learn Next <Sparkles size={32} color="#fbbf24" />
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 700, margin: "0 auto" }}>
              {isAI
                ? "Our AI identified these skills as the most impactful additions to your profile — specifically chosen based on what your resume currently lacks for this career path."
                : "These selected technologies will complement your existing expertise and make your profile stand out to top-tier employers."
              }
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {suggestedSkills.map((skill, index) => {
              return (
                <motion.div key={skill} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)", borderColor: `${trackInfo.color}40`, boxShadow: `0 20px 40px -10px ${trackInfo.color}20` }}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer" }}>
                  <SkillIcon skill={skill} trackColor={trackInfo.color} />
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.2px" }}>{skill}</h4>
                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1.6 }}>
                      {isAI ? `AI-identified as a key growth area for your ${displayTitle} pathway.` : `Critical competency for advancing your career within the ${displayTitle} industry.`}
                    </p>
                  </div>
                </motion.div>
              );
            })}

          </div>
        </section>
      )}

      {/* ── RESOURCES ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem 8rem" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(15,20,40,0.8),rgba(10,15,30,0.9))", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "40px", padding: "4rem", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", background: `${trackInfo.color}15`, color: trackInfo.color, padding: "0.6rem 1.2rem", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase" }}>
              {isAI ? "AI-Curated Learning Toolkit" : "Learning Toolkit"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1.5rem", color: "#fff" }}>Curated Resources for {displayTitle}</h2>
            <p style={{ fontSize: "1.15rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              {isAI
                ? "Our Gemini AI hand-picked these platforms and video guides specifically for your skill level and the career path you're targeting."
                : "We've hand-picked the best documentation and video series to help you master your next set of skills efficiently."
              }
            </p>

            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(0,0,0,0.2)", padding: "0.5rem", borderRadius: "16px", width: "fit-content" }}>
              <button onClick={() => setActiveResource("websites")}
                style={{
                  padding: "0.8rem 1.75rem", borderRadius: "12px", border: "none", cursor: "pointer", transition: "0.3s", fontSize: "1rem", fontWeight: 700,
                  background: activeResource === "websites" ? trackInfo.grad : "transparent",
                  color: activeResource === "websites" ? "#fff" : "#64748b"
                }}>
                Websites
              </button>
              <button onClick={() => setActiveResource("youtube")}
                style={{
                  padding: "0.8rem 1.75rem", borderRadius: "12px", border: "none", cursor: "pointer", transition: "0.3s", fontSize: "1rem", fontWeight: 700,
                  background: activeResource === "youtube" ? "#f43f5e" : "transparent",
                  color: activeResource === "youtube" ? "#fff" : "#64748b"
                }}>
                YouTube
              </button>
            </div>

            <div style={{ marginTop: "3rem" }}>
              <img src="/learning_resources.png" alt="Resources" style={{ width: "100%", maxWidth: 350, opacity: 0.8 }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AnimatePresence mode="wait">
              {activeResource === "websites" ? (
                <motion.div key="websites" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  style={{ display: "grid", gap: "1rem" }}>
                  {(resources.websites || []).map((w, i) => (
                    <ResourceLink key={i} href={w.url} name={w.name} focus={w.focus} accent={trackInfo.color} />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="youtube" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  style={{ display: "grid", gap: "1rem" }}>
                  {(resources.youtube || []).map((q, i) => (
                    <ResourceLink
                      key={i}
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                      name={q}
                      focus="Curated Video Guide"
                      accent="#f43f5e"
                      isYoutube={true}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── INTERVIEW PREP CTA ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 4rem" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.1),transparent)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "32px", padding: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
              Master Your Interview Readiness <Zap size={28} color="#f59e0b" fill="#f59e0b" />
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              Validate your expertise and build confidence with our AI-powered Interview Simulator. Practice with realistic, timed scenarios tailored precisely to your background as a {displayTitle}.
            </p>
          </div>
          <button onClick={() => navigate("/interview-prep", { state: { targetRole: displayTitle } })}
            style={{ padding: "1.2rem 2.5rem", borderRadius: "16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", transition: "0.3s", boxShadow: "0 10px 25px rgba(99,102,241,0.3)" }}>
            Start Mock Interview →
          </button>
        </div>
      </section>



      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        button:hover { transform: translateY(-3px); filter: brightness(1.1); }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media(max-width:768px){
          section > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
          div[style*="gridTemplateColumns: 1fr 1.2fr"] { grid-template-columns: 1fr !important; padding: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default CareerSuggestionsPage;
