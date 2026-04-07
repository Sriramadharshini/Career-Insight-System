import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resumeApi, profileApi } from "../api";
import { useAuth } from "../context/AuthContext";

/* ─── Design tokens ───────────────────────── */
const BG = "#050b18";
const SURFACE = "rgba(10,15,32,0.85)";
const GLASS = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f0f4ff";
const MUTED = "#8a96b0";
const FAINT = "#3d4a63";
const INDIGO = "#6366f1";
const VIOLET = "#8b5cf6";
const EMERALD = "#10b981";
const AMBER = "#f59e0b";
const ROSE = "#f43f5e";
const SKY = "#38bdf8";

/* ─── Professional SVG Icons ─────────────── */
const IconATS = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);
const IconSkills = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);
const IconTarget = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconGrowth = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const IconAnalytics = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconCareer = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const IconImprove = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconJobMatch = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconProfile = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconResume = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconInterview = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="9" y1="10" x2="9" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/>
  </svg>
);
const IconSuggestions = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconNav = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

/* ─── Floating orb ───────────────────────── */
const Orb = ({ x, y, size, color, delay }) => (
  <motion.div animate={{ y: [0, -18, 0], opacity: [0.12, 0.25, 0.12] }}
    transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle, ${color}70 0%, transparent 70%)`, filter: "blur(40px)", pointerEvents: "none"
    }}
  />
);

/* ─── Arc SVG meter ───────────────────────── */
const ArcMeter = ({ score, color }) => {
  const r = 60, cx = 90, cy = 70, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ * 0.75;
  return (
    <svg width={180} height={140} viewBox="0 0 180 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12}
        strokeDasharray={`${circ * 0.75} ${circ}`} strokeDashoffset={0} strokeLinecap="round" transform={`rotate(135,${cx},${cy})`}/>
      <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={12}
        strokeDasharray={`${circ * 0.75} ${circ}`}
        initial={{ strokeDashoffset: circ * 0.75 }}
        animate={{ strokeDashoffset: circ * 0.75 - dash }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
        strokeLinecap="round" transform={`rotate(135,${cx},${cy})`}
        style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
      />
      <text x={cx} y={cy - 5} textAnchor="middle" fill={TEXT} fontSize="32" fontWeight="1000" fontFamily="Outfit,sans-serif">{score}</text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill={MUTED} fontSize="14" fontWeight="800" fontFamily="Outfit,sans-serif">/ 100</text>
      <text x={cx} y={cy + 38} textAnchor="middle" fill={color} fontSize="11" fontWeight="950" fontFamily="Outfit,sans-serif" letterSpacing="1px">ATS SCORE</text>
    </svg>
  );
};


/* ─── Ascending Career Dashboard SVG ─────────────────────────────── */
const DashboardIllustration = () => (
  <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 400, filter: "drop-shadow(0 20px 40px rgba(99,102,241,0.15))" }}>
    <defs>
      <radialGradient id="di1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <radialGradient id="di2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <motion.circle cx="200" cy="160" r="160" fill="url(#di1)" opacity="0.12" animate={{ scale: [1, 1.05, 1], opacity: [0.12, 0.18, 0.12] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}/>
    <motion.circle cx="320" cy="100" r="80" fill="url(#di2)" opacity="0.1" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}/>
    
    {/* Base structure: Ascending platforms */}
    <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
      {/* Platform 1 */}
      <path d="M40 240 L120 200 L200 240 L120 280 Z" fill="rgba(30,41,59,0.8)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
      <path d="M40 240 L120 280 L120 300 L40 260 Z" fill="rgba(15,23,42,0.9)" />
      <path d="M200 240 L120 280 L120 300 L200 260 Z" fill="rgba(30,41,59,0.5)" />
      
      {/* Platform 2 */}
      <path d="M120 180 L200 140 L280 180 L200 220 Z" fill="rgba(30,41,59,0.8)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5"/>
      <path d="M120 180 L200 220 L200 240 L120 200 Z" fill="rgba(15,23,42,0.9)" />
      <path d="M280 180 L200 220 L200 240 L280 200 Z" fill="rgba(30,41,59,0.5)" />
      
      {/* Platform 3 */}
      <path d="M200 120 L280 80 L360 120 L280 160 Z" fill="rgba(30,41,59,0.8)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5"/>
      <path d="M200 120 L280 160 L280 180 L200 140 Z" fill="rgba(15,23,42,0.9)" />
      <path d="M360 120 L280 160 L280 180 L360 140 Z" fill="rgba(30,41,59,0.5)" />
    </motion.g>

    {/* Elements on platforms */}
    <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.6 }}>
      {/* Target/Milestone icon on P 1 */}
      <circle cx="120" cy="220" r="16" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="2" filter="url(#glow)"/>
      <circle cx="120" cy="220" r="6" fill="#6366f1"/>
      <text x="120" y="190" textAnchor="middle" fill="#818cf8" fontSize="11" fontWeight="800" fontFamily="Outfit,sans-serif">Profile Built</text>
    </motion.g>
    
    <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.9 }}>
      {/* Skills icon on P 2 */}
      <rect x="184" y="144" width="32" height="32" rx="8" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2" filter="url(#glow)"/>
      <svg x="190" y="150" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
      <text x="200" y="130" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="800" fontFamily="Outfit,sans-serif">Skills Mastered</text>
    </motion.g>
    
    <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 1.2 }}>
      {/* Rocket/Job icon on P 3 */}
      <circle cx="280" cy="100" r="20" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="2" filter="url(#glow)"/>
      <svg x="268" y="88" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      <text x="280" y="66" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="900" fontFamily="Outfit,sans-serif">Career Peak</text>
    </motion.g>

    {/* Connection Trail mapping career progression */}
    <motion.path 
      d="M120 220 Q160 160 200 160 Q240 160 280 100" 
      fill="none" stroke="url(#di1)" strokeWidth="3" strokeDasharray="6 6"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
    />
    
    <motion.circle cx="120" cy="220" r="4" fill="#fff" filter="url(#glow)"
      animate={{ cx: [120, 200, 280], cy: [220, 160, 100], opacity: [0,1,0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}/>
  </svg>
);

/* ─── Stat card ───────────────────────────── */
const StatCard = ({ label, value, sub, color, icon, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -6, boxShadow: `0 24px 48px -8px ${color}35` }}
    style={{ background: SURFACE, border: `1px solid ${color}22`, borderRadius: "22px", padding: "2.8rem 3rem",
      backdropFilter: "blur(20px)", boxShadow: `0 8px 32px -8px rgba(0,0,0,0.4)`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, right: 0, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, transform: "translate(22px,-22px)" }}/>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem", color }}>{icon}</div>
    <p style={{ margin: "0 0 0.35rem", fontSize: "4.5rem", fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
    <p style={{ margin: "0 0 0.2rem", fontSize: "1.4rem", fontWeight: 750, color: TEXT }}>{label}</p>
    {sub && <p style={{ margin: 0, fontSize: "1.15rem", color: FAINT }}>{sub}</p>}
  </motion.div>

);

/* ─── Section heading ─────────────────────── */
const SectionTitle = ({ icon, title, sub }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "1.1rem", marginBottom: "1.75rem" }}>
    <div style={{ width: 48, height: 48, borderRadius: "14px", background: GLASS, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
    <div>
      <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: TEXT, letterSpacing: "-0.3px" }}>{title}</h2>
      {sub && <p style={{ margin: 0, fontSize: "1.05rem", color: MUTED, marginTop: "0.2rem" }}>{sub}</p>}
    </div>
  </div>
);

/* ─── Quick nav button ────────────────────── */
const NavTile = ({ label, to, icon, color }) => {
  const navigate = useNavigate();
  return (
    <motion.button whileHover={{ scale: 1.05, y: -6, boxShadow: `0 15px 35px ${color}25`, background: `${color}08` }} whileTap={{ scale: 0.96 }}
      onClick={() => navigate(to)}
      style={{ padding: "1.75rem 1.4rem", borderRadius: "22px", background: GLASS, border: `1px solid ${color}30`,
        color: TEXT, fontWeight: 800, cursor: "pointer", fontSize: "1.1rem", fontFamily: "'Outfit',sans-serif",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", minWidth: 160,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div style={{ color, display: "flex", alignItems: "center", justifyContent: "center", width: 54, height: 54, borderRadius: "18px", background: `${color}18`, border: `1px solid ${color}25` }}>{icon}</div>
      <span style={{ color: TEXT, fontSize: "1rem", fontWeight: 850, textTransform: "none", letterSpacing: "-0.2px", lineHeight: 1.2, textAlign: "center" }}>{label}</span>
    </motion.button>
  );
};


/* ─── Skill icon map → devicons CDN URLs ──── */
const SKILL_ICON_MAP = {
  react:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  python:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  javascript:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  typescript:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  node:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  sql:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  mysql:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  postgresql:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  docker:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  mongodb:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  aws:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  java:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  css:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  html:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  figma:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  tensorflow:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  flutter:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  express:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  angular:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
  vue:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  kotlin:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  swift:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  rust:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
  go:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  php:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  ruby:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  redux:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  nextjs:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  graphql:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  kubernetes:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  git:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  linux:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  spring:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  django:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  firebase:    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  redis:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
};

/* ─── Skill badge with real icon ─────────── */
const SkillBadge = ({ skill, i }) => {
  const colors = [INDIGO, EMERALD, AMBER, ROSE, SKY, VIOLET, "#f472b6", "#34d399"];
  const c = colors[i % colors.length];
  const key = Object.keys(SKILL_ICON_MAP).find(k => skill.toLowerCase().includes(k));
  const iconUrl = key ? SKILL_ICON_MAP[key] : null;
  const initials = skill.slice(0, 2).toUpperCase();
  return (
    <motion.span whileHover={{ scale: 1.08, y: -4, backgroundColor: `${c}15`, borderColor: `${c}40` }}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: `${c}08`, color: c,
        border: `1px solid ${c}25`, borderRadius: "999px", padding: "0.65rem 1.4rem", fontSize: "1.15rem",
        fontWeight: 800, cursor: "default", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {iconUrl
          ? <img src={iconUrl} alt={skill} style={{ width: 22, height: 22, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }}/>
          : <span style={{ background: `${c}22`, borderRadius: 6, padding: "2px 6px", fontSize: "0.75rem", fontWeight: 900, color: c }}>{initials}</span>
        }
      </span>
      {skill}
    </motion.span>
  );
};


/* ─── Gap card ────────────────────────────── */
const GapCard = ({ gap, i }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
    style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start", padding: "1.4rem 1.6rem",
      background: `${AMBER}08`, border: `1px solid ${AMBER}18`, borderLeft: `5px solid ${AMBER}60`, borderRadius: "16px", transition: "all 0.3s" }}>
    <span style={{ color: AMBER, flexShrink: 0, marginTop: 4 }}><IconGrowth size={24} color={AMBER}/></span>
    <p style={{ margin: 0, fontSize: "1.2rem", color: MUTED, lineHeight: 1.6, fontWeight: 600 }}>{gap}</p>
  </motion.div>
);


/* ─── Role card ───────────────────────────── */
const RoleCard = ({ role, color, i, navigate }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.02 }}
    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", 
      padding: "0.9rem 1.25rem", background: `${color}06`, border: `1px solid ${color}15`,
      borderRadius: "16px", gap: "1rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flex: "1 1 auto" }}>
      <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${color}20`, color }}>
        <IconTarget size={22} color={color}/>
      </div>
      <span style={{ fontWeight: 850, color: TEXT, fontSize: "1.3rem", letterSpacing: "-0.2px" }}>{role}</span>

    </div>
    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
      {/* Mini buttons to keep the layout horizontal and balanced */}
      <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate("/interview-prep", { state: { targetRole: role } })}
        style={{ padding: "0.5rem 0.9rem", borderRadius: "10px", background: `${color}20`, border: `1px solid ${color}30`, color, fontSize: "0.85rem", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
        Prep
      </motion.button>
      <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate("/job-recommendations")}
        style={{ padding: "0.5rem 0.9rem", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: TEXT, fontSize: "0.85rem", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
        Jobs
      </motion.button>
    </div>
  </motion.div>
);


/* ─── Progress bar ────────────────────────── */
const ProgressBar = ({ label, value, max, color }) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "1.15rem", color: MUTED, fontWeight: 750, textTransform: "capitalize" }}>{label}</span>
        <span style={{ fontSize: "1.25rem", color, fontWeight: 950 }}>{value}<span style={{ color: FAINT, fontWeight: 750 }}>/{max}</span></span>
      </div>

      <div style={{ height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          style={{ height: "100%", background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 10, boxShadow: `0 0 8px ${color}40` }}
        />
      </div>
    </div>
  );
};


/* ─── Dashboard ───────────────────────────── */
const OverallDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      resumeApi.getLatest(token).catch(() => null),
      profileApi.get(token).catch(() => null),
    ]).then(([a, p]) => { setAnalysis(a); setProfile(p); setLoading(false); });
  }, [token]);

  const name = profile?.personalInfo?.fullName || user?.name || "there";
  const firstName = name.split(" ")[0];
  const atsScore = analysis?.atsScore ?? 0;
  const skills = (analysis?.extractedSkills || analysis?.matchedKeywords || []).slice(0, 16);
  const rawGaps = analysis?.gapAnalysis || analysis?.missingGaps || [];
  // Ensure gaps is always an array of strings
  const gaps = rawGaps.map(g => typeof g === "string" ? g : g?.skill || g?.gap || JSON.stringify(g)).filter(Boolean);
  const roles = analysis?.recommendedRoles || [];
  const sectionScores = analysis?.sectionScores || {};
  const atsColor = atsScore >= 75 ? EMERALD : atsScore >= 50 ? AMBER : ROSE;
  const roleColors = [INDIGO, EMERALD, AMBER, VIOLET, SKY, ROSE];

  // Calculate remaining gaps (gaps not covered by existing skills)
  const remainingGaps = gaps.filter(gap => {
    const gapLower = typeof gap === "string" ? gap.toLowerCase() : "";
    return !skills.some(skill =>
      typeof skill === "string" && (skill.toLowerCase().includes(gapLower) || gapLower.includes(skill.toLowerCase()))
    );
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", fontFamily: "'Outfit',sans-serif" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        style={{ width: 54, height: 54, border: `3px solid ${INDIGO}25`, borderTopColor: INDIGO, borderRadius: "50%" }}/>
      <p style={{ color: MUTED, fontSize: "1.15rem", fontWeight: 600 }}>Loading your dashboard…</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Outfit','Inter',system-ui,sans-serif", color: TEXT, overflowX: "hidden", paddingBottom: "5rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: 'Outfit',sans-serif; }
        @keyframes pulse-slow { 0%,100%{opacity:0.12} 50%{opacity:0.28} }
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <Orb x="0%" y="0%" size={500} color={INDIGO} delay={0}/>
        <Orb x="70%" y="40%" size={400} color={VIOLET} delay={2.5}/>
        <Orb x="30%" y="75%" size={300} color={EMERALD} delay={5}/>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2.5rem 1.5rem", position: "relative", zIndex: 1 }}>

        {/* ── HERO ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "3rem", alignItems: "center", marginBottom: "3rem" }}>
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: `${INDIGO}15`, border: `1px solid ${INDIGO}30`, borderRadius: "999px", padding: "0.5rem 1.3rem", marginBottom: "1.4rem" }}>
              <IconAnalytics size={16} color={INDIGO}/>
              <span style={{ color: INDIGO, fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px" }}>Career Command Centre</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 1000, lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 1.2rem", background: `linear-gradient(135deg, ${TEXT} 50%, ${VIOLET})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Welcome back,<br/>{firstName} 👋
            </h1>
            <p style={{ fontSize: "1.25rem", color: MUTED, lineHeight: 1.8, margin: "0 0 2rem", maxWidth: 520 }}>

              {analysis ? "Your career intelligence is ready. Explore your skills, track your progress, and take your next move." : "Upload your resume to unlock AI-powered career insights, skill gap analysis, and job recommendations."}
            </p>
            {analysis ? (
              <motion.button 
                whileHover={{ scale: 1.04, filter: "brightness(1.1)" }} 
                animate={{ boxShadow: [`0 0 0px ${EMERALD}00`, `0 0 20px ${EMERALD}60`, `0 0 0px ${EMERALD}00`] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => navigate("/job-recommendations")}
                style={{ 
                  padding: "1rem 2.4rem", 
                  borderRadius: "14px", 
                  background: `linear-gradient(135deg, ${INDIGO}, ${EMERALD})`, 
                  border: "none", 
                  color: "#fff", 
                  fontWeight: 800, 
                  cursor: "pointer", 
                  fontSize: "1.05rem", 
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  boxShadow: `0 10px 28px ${INDIGO}40`
                }}
              >
                <IconJobMatch size={20} color="#fff"/>
                View Job Recommendations →
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/resume-upload")}
                style={{ padding: "1rem 2.4rem", borderRadius: "14px", background: `linear-gradient(135deg,${INDIGO},${VIOLET})`, border: "none", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "1.05rem", fontFamily: "inherit", boxShadow: `0 10px 28px ${INDIGO}40` }}>
                Upload Resume →
              </motion.button>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }}
            style={{ display: "flex", justifyContent: "center" }}>
            <DashboardIllustration />
          </motion.div>
        </div>

        {/* ── STATS ROW ── */}
        {analysis && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
            <StatCard label="ATS Score" value={atsScore} sub="Out of 100" color={atsColor} icon={<IconATS size={22} color={atsColor}/>} delay={0.1}/>
            <StatCard label="Skills Detected" value={skills.length} sub="From your resume" color={INDIGO} icon={<IconSkills size={22} color={INDIGO}/>} delay={0.2}/>
            <StatCard label="Career Roles" value={roles.length} sub="Recommended for you" color={VIOLET} icon={<IconTarget size={22} color={VIOLET}/>} delay={0.3}/>
            <StatCard label="Skill Gaps" value={gaps.length} sub="Areas to improve" color={AMBER} icon={<IconGrowth size={22} color={AMBER}/>} delay={0.4}/>
          </div>
        )}

        {/* ── 2 COL GRID ── */}
        {analysis && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

            {/* Profile Content: ATS Meter + section scores */}
            <motion.div whileHover={{ y: -4 }} style={{ background: SURFACE, border: `1px solid ${atsColor}20`, borderRadius: "22px", padding: "2.2rem", backdropFilter: "blur(20px)", boxShadow: "0 12px 48px -12px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", height: "100%" }}>
              <SectionTitle icon={<IconAnalytics size={24} color={atsColor}/>} title="Profile Content" sub="ATS resume structure breakdown"/>

              <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between", marginTop: "0.5rem", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}>
                  <ArcMeter score={atsScore} color={atsColor}/>
                </div>
                <div style={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {Object.entries(sectionScores).map(([k, v]) => (
                    <ProgressBar key={k} label={k} value={v} max={k === "experience" ? 40 : 20} color={atsColor}/>
                  ))}
                  {!Object.keys(sectionScores).length && <p style={{ color: FAINT, fontSize: "0.95rem", textAlign: "center" }}>No breakdown available.</p>}
                </div>
              </div>
            </motion.div>

            {/* Recommended roles */}
            <motion.div whileHover={{ y: -4 }} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "22px", padding: "1.85rem", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", height: "100%" }}>
              <SectionTitle icon={<IconCareer size={22} color={VIOLET}/>} title="Recommended Roles" sub="AI matched career pathways"/>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {roles.length ? (
                  <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                    {roles.slice(0, 3).map((role, i) => (
                      <RoleCard key={role} role={role} color={roleColors[i % roleColors.length]} i={i} navigate={navigate}/>
                    ))}
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate("/career-suggestions")}
                    style={{ padding: "0.85rem", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, color: "#e2e8f0", fontSize: "0.95rem", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", marginTop: "1rem" }}>
                    View Full Suggestions →
                  </motion.button>
                  </>
                ) : <p style={{ color: FAINT, fontSize: "0.95rem", marginTop: "2rem", textAlign: "center" }}>No roles detected yet. Upload a detailed resume.</p>}
              </div>
            </motion.div>

          </div>
        )}

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <motion.div whileHover={{ y: -3 }} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "22px", padding: "1.85rem", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)", marginBottom: "1.5rem" }}>
            <SectionTitle icon={<IconSkills size={20} color={INDIGO}/>} title="Your Skills" sub={`${skills.length} skills detected from your resume`}/>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {skills.map((s, i) => <SkillBadge key={s} skill={s} i={i}/>)}
            </div>
          </motion.div>
        )}

        {/* ── GAP + JOB preview ── */}
        {analysis && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

            {/* Gap analysis — Remaining Gaps accurately calculated */}
            <motion.div whileHover={{ y: -3 }} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "22px", padding: "1.85rem", backdropFilter: "blur(20px)" }}>
              <SectionTitle icon={<IconImprove size={20} color={AMBER}/>} title="Skill Gaps" sub={`${gaps.length} areas identified for improvement`}/>
              {gaps.length ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                    {gaps.slice(0, 5).map((g, i) => <GapCard key={i} gap={g} i={i}/>)}
                  </div>
                  {gaps.length > 5 && (
                    <div style={{ marginTop: "0.75rem", padding: "0.65rem 1rem", background: `${AMBER}08`, border: `1px solid ${AMBER}18`, borderRadius: "10px", textAlign: "center" }}>
                      <span style={{ color: AMBER, fontSize: "0.85rem", fontWeight: 700 }}>+{gaps.length - 5} more skill gaps identified</span>
                    </div>
                  )}
                  <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: `${ROSE}08`, border: `1px solid ${ROSE}18`, borderLeft: `3px solid ${ROSE}60`, borderRadius: "10px" }}>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: MUTED }}>
                      <span style={{ color: ROSE, fontWeight: 800 }}>{remainingGaps.length} remaining gap{remainingGaps.length !== 1 ? "s" : ""}</span>
                      {remainingGaps.length > 0
                        ? ` not yet in your skill set: ${remainingGaps.slice(0,3).join(", ")}${remainingGaps.length > 3 ? ` +${remainingGaps.length - 3} more` : ""}`
                        : " — your current skills cover all detected gaps!"}
                    </p>
                  </div>
                </>
              ) : <p style={{ color: FAINT, fontSize: "0.95rem" }}>No significant skill gaps detected — great profile!</p>}
            </motion.div>

            {/* Job recommendations preview */}
            <motion.div whileHover={{ y: -3 }} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "22px", padding: "1.85rem", backdropFilter: "blur(20px)" }}>
              <SectionTitle icon={<IconJobMatch size={20} color={EMERALD}/>} title="Job Matches" sub="Click to explore opportunities"/>
              {roles.length ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "1rem" }}>
                    {roles.slice(0, 3).map((role, i) => (
                      <div key={role} style={{ padding: "0.9rem 1rem", background: GLASS, border: `1px solid ${BORDER}`, borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <IconJobMatch size={18} color={EMERALD}/>
                            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: TEXT }}>{role}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: "0.85rem", color: FAINT }}>Multiple openings · All platforms</p>
                        </div>
                        <span style={{ fontSize: "0.85rem", color: EMERALD, fontWeight: 900, background: `${EMERALD}12`, border: `1px solid ${EMERALD}25`, borderRadius: "999px", padding: "0.25rem 0.8rem" }}>3+ Jobs</span>

                      </div>
                    ))}
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate("/job-recommendations")}
                    style={{ width: "100%", padding: "0.9rem", borderRadius: "14px", background: `linear-gradient(135deg,${INDIGO},${VIOLET})`, border: "none", color: "#fff", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${INDIGO}35` }}>
                    View All Job Recommendations →
                  </motion.button>
                </>
              ) : <p style={{ color: FAINT, fontSize: "0.95rem" }}>Upload a resume to see job matches.</p>}
            </motion.div>
          </div>
        )}

        {/* ── QUICK NAV ── (My Profile FIRST) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "22px", padding: "1.85rem", backdropFilter: "blur(20px)" }}>
          <SectionTitle icon={<IconNav size={20} color={SKY}/>} title="Quick Navigation" sub="Jump to any feature instantly"/>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <NavTile label="My Profile"          to="/profile"             icon={<IconProfile size={22} color={SKY}/>}       color={SKY}     />
            <NavTile label="Resume Upload"        to="/resume-upload"       icon={<IconResume size={22} color={INDIGO}/>}     color={INDIGO}  />
            <NavTile label="Career Suggestions"   to="/career-suggestions"  icon={<IconSuggestions size={22} color={VIOLET}/>} color={VIOLET}  />
            <NavTile label="Interview Prep"       to="/interview-prep"      icon={<IconInterview size={22} color={EMERALD}/>} color={EMERALD} />
            <NavTile label="Job Recommendations"  to="/job-recommendations" icon={<IconJobMatch size={22} color={AMBER}/>}   color={AMBER}   />
          </div>
        </motion.div>

        {/* ── If no analysis ── */}
        {!analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ textAlign: "center", marginTop: "3rem", padding: "3.5rem", background: `${INDIGO}08`, border: `1px solid ${INDIGO}20`, borderRadius: "24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: 72, height: 72, borderRadius: "20px", background: `${INDIGO}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${INDIGO}25` }}>
                <IconATS size={36} color={INDIGO}/>
              </div>
            </div>
            <h3 style={{ margin: "0 0 0.85rem", fontSize: "1.7rem", fontWeight: 900, color: TEXT }}>Your Journey Starts Here</h3>
            <p style={{ color: MUTED, marginBottom: "2rem", fontSize: "1.05rem", maxWidth: 450, margin: "0 auto 2rem", lineHeight: 1.7 }}>Upload your resume to unlock ATS scoring, skill gap analysis, AI career recommendations, and job matches — all in one place.</p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate("/resume-upload")}
              style={{ padding: "1.1rem 2.8rem", borderRadius: "14px", background: `linear-gradient(135deg,${INDIGO},${VIOLET})`, border: "none", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "1.05rem", fontFamily: "inherit", boxShadow: `0 10px 28px ${INDIGO}40` }}>
              Upload Resume to Get Started →
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OverallDashboard;
