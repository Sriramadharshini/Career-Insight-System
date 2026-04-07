import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { resumeApi } from "../api";
import jobMatchHero from "../assets/job_match_hero.png";
import { 
  Search, 
  ExternalLink, 
  Briefcase, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  LayoutDashboard, 
  ArrowLeft,
  RefreshCw,
  Target,
  ChevronRight,
  ChevronLeft,
  Rocket
} from "lucide-react";

const BG = "#050b18";
const TEXT = "#f0f4ff";
const MUTED = "#8a96b0";
const FAINT = "#3d4a63";
const BORDER = "rgba(255,255,255,0.08)";
const INDIGO = "#6366f1";
const VIOLET = "#8b5cf6";
const EMERALD = "#10b981";
const AMBER = "#f59e0b";
const ROSE = "#f43f5e";
const SKY = "#38bdf8";


/* ─── Job Platforms ─────────────────────────────────────────── */
const PLATFORMS = [
  {
    name: "LinkedIn",
    url: (q) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=India`,
    color: "#0a66c2",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    name: "Naukri",
    url: (q) => `https://www.naukri.com/jobs-in-india?q=${encodeURIComponent(q)}`,
    color: "#4a90e2",
    logo: <span style={{ fontWeight: 900, color: "#fff", fontSize: 13 }}>N</span>
  },
  {
    name: "Indeed",
    url: (q) => `https://in.indeed.com/jobs?q=${encodeURIComponent(q)}&l=India`,
    color: "#2557a7",
    logo: <span style={{ fontWeight: 900, color: "#fff", fontSize: 12 }}>in</span>
  },
  {
    name: "Glassdoor",
    url: (q) => `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encodeURIComponent(q)}`,
    color: "#0caa41",
    logo: <span style={{ fontWeight: 900, color: "#fff", fontSize: 13 }}>G</span>
  },
  {
    name: "Internshala",
    url: (q) => `https://internshala.com/jobs/keywords-${encodeURIComponent(q.replace(/ /g,"-"))}`,
    color: "#008bdc",
    logo: <span style={{ fontWeight: 900, color: "#fff", fontSize: 12 }}>IS</span>
  }
];

/* ─── Components ────────────────────────────────────────────── */
const Orb = ({ x, y, size, color, delay }) => (
  <motion.div
    animate={{ y: [0, -30, 0], opacity: [0.1, 0.25, 0.1] }}
    transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    style={{
      position: "fixed", left: x, top: y, width: size, height: size,
      borderRadius: "50%", background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
      filter: "blur(40px)", pointerEvents: "none", zIndex: 0
    }}
  />
);

const MatchRing = ({ pct }) => {
  const color = pct >= 90 ? EMERALD : pct >= 75 ? INDIGO : AMBER;
  const r = 26, cx = 35, cy = 35, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={80} height={80} viewBox="0 0 80 80" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke={`${color}10`} strokeWidth={7} strokeDasharray={circ} />
        <motion.circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${circ}`} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${color}50)` }}
        />
      </svg>
      <div style={{ textAlign: "center", zIndex: 1, paddingBottom: 2 }}>
        <span style={{ fontSize: "1.25rem", fontWeight: 1000, color, display: "block", lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: "0.55rem", fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "1px" }}>MATCH</span>
      </div>
    </div>
  );
};







const PlatformLink = ({ platform, query }) => (
  <motion.a
    href={platform.url(query)}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.04, boxShadow: `0 8px 20px ${platform.color}30` }}
    whileTap={{ scale: 0.95 }}
    style={{
      display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.9rem",
      borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`,
      textDecoration: "none", transition: "all 0.2s", minWidth: 110
    }}
  >
    <div style={{ width: 22, height: 22, borderRadius: "6px", background: platform.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {platform.logo}
    </div>
    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>{platform.name}</span>
  </motion.a>
);

const JobCard = ({ job, index }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30, scale: 0.98 },
      show: { opacity: 1, y: 0, scale: 1 }
    }}
    whileHover={{ 
      y: -12, 
      scale: 1.02, 
      backgroundColor: "rgba(255,255,255,0.06)",
      borderColor: `${INDIGO}50`,
      boxShadow: `0 35px 80px -15px ${INDIGO}25`,
    }}
    transition={{ 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    }}
    style={{
      background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`,
      borderRadius: "32px", padding: "2.5rem", display: "flex", alignItems: "center",
      gap: "2.5rem", flexWrap: "wrap", backdropFilter: "blur(30px)", 
      position: "relative", overflow: "hidden", cursor: "pointer"
    }}
  >

    <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: job.match >= 90 ? EMERALD : job.match >= 75 ? INDIGO : AMBER }}></div>
    
    <MatchRing pct={job.match} />
    
    <div style={{ flex: "1 1 350px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 1000, color: "#fff", letterSpacing: "-0.5px" }}>{job.title}</h3>
        {job.hot && (
          <span style={{ background: `linear-gradient(135deg, ${ROSE}, #f472b6)`, color: "#fff", fontSize: "0.75rem", fontWeight: 900, padding: "0.4rem 0.9rem", borderRadius: "10px", textTransform: "uppercase", letterSpacing: "1px", boxShadow: `0 4px 15px ${ROSE}40` }}>
            Priority Hire
          </span>
        )}
      </div>
      
      <div style={{ display: "flex", gap: "1.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "1.05rem", color: TEXT, fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ opacity: 0.6 }}>📍</span> {job.location}
        </span>
        <span style={{ fontSize: "1.05rem", color: MUTED, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Briefcase size={16} /> {job.exp}
        </span>
        <span style={{ fontSize: "1.05rem", color: EMERALD, fontWeight: 900, background: `${EMERALD}10`, padding: "0.2rem 0.6rem", borderRadius: "8px" }}>
          {job.salary}
        </span>
        <span style={{ fontSize: "0.95rem", fontWeight: 800, color: INDIGO, border: `1px solid ${INDIGO}30`, padding: "0.3rem 1rem", borderRadius: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {job.type}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem" }}>
        {job.skills?.slice(0, 5).map(skill => (
          <span key={skill} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", background: "rgba(255,255,255,0.04)", padding: "0.45rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
            {skill}
          </span>
        ))}
        {job.skills?.length > 5 && <span style={{ fontSize: "0.85rem", fontWeight: 700, color: FAINT }}>+{job.skills.length - 5} more</span>}
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 260, padding: "1.5rem", background: "rgba(255,255,255,0.01)", borderRadius: "20px", border: `1px solid ${BORDER}` }}>
      <p style={{ margin: "0 0 0.2rem", fontSize: "0.75rem", fontWeight: 900, color: MUTED, textTransform: "uppercase", letterSpacing: "1.5px" }}>Direct Engagement</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {PLATFORMS.map(p => (
          <PlatformLink key={p.name} platform={p} query={job.title + " " + job.location} />
        ))}
      </div>
    </div>
  </motion.div>
);


const JobRecommendationsPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchRecommendations = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [aData, jData] = await Promise.all([
        resumeApi.getLatest(token),
        resumeApi.getJobRecommendations(token)
      ]);
      setAnalysis(aData);
      setJobs(Array.isArray(jData) ? jData : []);
    } catch (err) {
      console.error("Fetch error", err);
      if (err.noResume) {
        setError("Resume not found. Please upload or generate a resume first.");
      } else {
        setError("We're having trouble reaching the AI matcher. You can try refreshing or use our fallback recommendations.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  const handleRefresh = () => {
    fetchRecommendations(true);
  };




  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", fontFamily: "'Outfit',sans-serif", padding: "2rem" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </motion.div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: TEXT, fontSize: "2.2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-1px" }}>AI Talent Matcher</h2>
        <p style={{ color: MUTED, fontSize: "1.2rem", fontWeight: 500 }}>Scanning 10,000+ opportunities for your experience level...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#020308", color: TEXT, fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden" }}>
      
      {/* Hero Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, padding: "0 2rem" }}>
        
        <header style={{ 
          marginBottom: "6rem", 
          display: "grid", 
          gridTemplateColumns: "1.3fr 1fr", 
          gap: "6rem", 
          alignItems: "center", 
          position: "relative",
          textAlign: "left"
        }}>
          <div>
            <motion.div initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
 animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ duration: 1 }}
               style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem", background: `rgba(255,255,255,0.03)`, border: `1px solid ${BORDER}`, padding: "0.6rem 1.5rem", borderRadius: "99px", marginBottom: "2.5rem", backdropFilter: "blur(10px)" }}>
              <Sparkles size={16} color={AMBER} fill={AMBER} />
              <span style={{ color: TEXT, fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.2px" }}>Precision AI Matching</span>
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} 
               style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)", fontWeight: 1000, margin: "0 0 1.5rem", letterSpacing: "-2.5px", lineHeight: 1, background: `linear-gradient(to right, #fff 30%, #a5b4fc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Your Next Global <br/>Opportunity Awaits
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
               style={{ fontSize: "1.25rem", color: MUTED, maxWidth: 650, margin: "0", lineHeight: 1.8, fontWeight: 500 }}>
              Our neural matching engine has cross-referenced your {analysis?.yearsSinceEducation ? `${analysis.yearsSinceEducation} years of` : "professional"} profile against global benchmarks. 
              Discover roles optimized for your specific career trajectory.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1.2, type: "spring" }}
             style={{ width: "100%", maxWidth: 620, display: "flex", justifyContent: "center" }}>
             <motion.img 
               src={jobMatchHero} 
               alt="AI Job Discovery" 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               style={{ width: "100%", height: "auto", borderRadius: "40px", filter: `drop-shadow(0 20px 40px ${INDIGO}25)` }}
             />
          </motion.div>


        </header>




        {error ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "40px", border: `1px solid ${BORDER}`, backdropFilter: "blur(20px)", margin: "4rem 2rem" }}>
             <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${ROSE}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                <Briefcase size={40} color={ROSE} />
             </div>
             <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "1rem", color: TEXT }}>Connection Notice</h2>
             <p style={{ color: MUTED, fontSize: "1.1rem", maxWidth: 500, margin: "0 auto 2.5rem", lineHeight: 1.6 }}>{error}</p>
             <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
               <button 
                 onClick={handleRefresh}
                 style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "1rem 2rem", borderRadius: "16px", background: INDIGO, border: "none", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "1.05rem", boxShadow: `0 8px 25px ${INDIGO}40` }}
               >
                 <RefreshCw size={20} /> Try Again
               </button>
               <button 
                 onClick={() => navigate("/dashboard")}
                 style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "1rem 2rem", borderRadius: "16px", background: "transparent", border: `1px solid ${BORDER}`, color: TEXT, fontWeight: 800, cursor: "pointer", fontSize: "1.05rem" }}
               >
                 <ArrowLeft size={20} /> Back to Dashboard
               </button>
             </div>
          </div>
        ) : (
          <div style={{ position: "relative", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", maxWidth: 1000, marginInline: "auto" }}>
               <h2 style={{ fontSize: "2rem", fontWeight: 1000, margin: 0, display: "flex", alignItems: "center", gap: "1rem", letterSpacing: "-0.5px" }}>
                 <Sparkles color={AMBER} fill={AMBER} size={32} />
                 Top Strategic Matches
               </h2>
               <div style={{ display: "flex", gap: "1rem" }}>
                 <motion.button
                   whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.08)" }} whileTap={{ scale: 0.95 }}
                   onClick={handleRefresh}
                   style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.7rem 1.4rem", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT, fontWeight: 800, cursor: "pointer" }}
                 >
                   <RefreshCw size={18} /> Refresh AI
                 </motion.button>
               </div>
            </div>

            {jobs.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(100%, 1fr))", 
                  gap: "2.5rem",
                  maxWidth: 1000,
                  margin: "0 auto"
                }}
              >
                {jobs.map((job, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" },
                      show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}

                  >
                    <JobCard job={job} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div style={{ textAlign: "center", padding: "8rem 2rem", background: "rgba(255,255,255,0.01)", borderRadius: "40px", border: `1px dashed ${BORDER}`, margin: "0 2rem" }}>
                 <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🔍</div>
                 <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: TEXT, marginBottom: "0.5rem" }}>Curating Your List</h3>
                 <p style={{ color: MUTED, fontSize: "1.1rem" }}>We didn't find specific matches just yet. Try refreshing or updating your target role in the dashboard.</p>
              </div>
            )}

          </div>
        )}

        <section style={{ maxWidth: 1000, margin: "6rem auto 0", padding: "0 2rem" }}>
          <div style={{ 
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))", 
            border: `1px solid ${BORDER}`, 
            borderRadius: "40px", 
            padding: "4rem", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: "3rem",
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.1 }}>
               <Rocket size={120} color={VIOLET} />
            </div>
            
            <div style={{ flex: 1, minWidth: 320, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <Target color={ROSE} size={32} />
                <h3 style={{ margin: 0, fontSize: "2.4rem", fontWeight: 1000, color: "#fff", letterSpacing: "-1px" }}>Ready to Transition?</h3>
              </div>
              <p style={{ margin: 0, fontSize: "1.25rem", color: MUTED, lineHeight: 1.8, fontWeight: 500 }}>
                Analyze your strategic fit. Refine your delivery with our AI simulator or backtrack to overview for a comprehensive audit.
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <motion.button 
                whileHover={{ y: -5, boxShadow: `0 10px 25px ${INDIGO}40` }}
                onClick={() => navigate("/dashboard")} 
                style={{ padding: "1.1rem 2.2rem", borderRadius: "18px", background: "rgba(255,255,255,0.04)", color: "#fff", border: `1px solid ${BORDER}`, fontWeight: 850, fontSize: "1.05rem", cursor: "pointer", transition: "0.3s", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <LayoutDashboard size={20} /> Dashboard
              </motion.button>
              <motion.button 
                whileHover={{ y: -5, scale: 1.02, boxShadow: `0 15px 35px ${INDIGO}50` }}
                onClick={() => navigate("/interview-prep")} 
                style={{ padding: "1.1rem 2.5rem", borderRadius: "18px", background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, color: "#fff", border: "none", fontWeight: 850, fontSize: "1.05rem", cursor: "pointer", transition: "0.3s", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                Interview Prep <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
          html, body { overflow-x: hidden; width: 100%; position: relative; margin: 0; padding: 0; }
          * { box-sizing: border-box; }
          
          @media (max-width: 992px) {
            header { grid-template-columns: 1fr !important; text-align: center !important; gap: 3rem !important; }
            header > div { margin: 0 auto !important; }
            h1 { font-size: 2.8rem !important; }
          }
        `}</style>

      </div>
    </div>

  );
};

export default JobRecommendationsPage;
