import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Telescope, Video,
  ArrowLeft, ArrowRight, Sparkles, ChevronRight, CheckCircle2,
} from "lucide-react";

/* ─── High-quality, purpose-matched Unsplash images ─────────────────────────
   Career Suggestions → career planning / roadmap / professional growth
   Job Recommendations → modern office / hiring / professional workspace
   Mock Interview      → interview room / video call / preparation setting    */
const TABS = [
  {
    id: "01",
    key: "career",
    title: "Career Suggestions",
    tagline: "AI-curated paths built from your resume",
    description:
      "Receive a personalised roadmap generated directly from your resume data. Uncover the roles you're best suited for, the skills that will make you stand out, and a clear action plan to reach your goals.",
    icon: Compass,
    color: "#818cf8",
    gradient: "linear-gradient(135deg,#4f46e5 0%,#818cf8 55%,#c084fc 100%)",
    glowColor: "rgba(129,140,248,0.4)",
    route: "/career-suggestions",
    features: ["AI-powered role matching", "Skill gap deep-dive", "Curated learning resources"],
    label: "AI Roadmap",
    // Professional career growth / skill development
    image: "/chub-career.png",
  },
  {
    id: "02",
    key: "jobs",
    title: "Job Recommendations",
    tagline: "Smart live matches for your unique profile",
    description:
      "Our intelligent matching engine scans thousands of live listings and surfaces roles that genuinely fit your skills and goals — saving you hours of manual searching.",
    icon: Telescope,
    color: "#34d399",
    gradient: "linear-gradient(135deg,#059669 0%,#34d399 55%,#6ee7b7 100%)",
    glowColor: "rgba(52,211,153,0.4)",
    route: "/job-recommendations",
    features: ["Real-time job matching", "ATS compatibility check", "One-click apply tracking"],
    label: "Live Listings",
    // Modern professional workplace / hiring environment
    image: "/chub-job.png",
  },
  {
    id: "03",
    key: "interview",
    title: "Mock Interview",
    tagline: "Practise until confidence is second nature",
    description:
      "Face realistic AI-generated interview questions tailored to your target role. Get instant feedback on structure, tone, and content — so you walk in prepared and confident.",
    icon: Video,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg,#d97706 0%,#f59e0b 55%,#fcd34d 100%)",
    glowColor: "rgba(245,158,11,0.4)",
    route: "/interview-prep",
    features: ["Role-specific question sets", "STAR-method coaching", "Real-time AI feedback"],
    label: "AI Coach",
    // Video interview / interview preparation setting
    image: "/chub-interview.png",
  },
];

const AUTO_PLAY_MS = 6000;

/* ── Ultra-smooth cinematic animation config for images ── */
const IMAGE_VARIANTS = {
  enter: (d) => ({
    x: d > 0 ? "8%" : "-8%",
    opacity: 0,
    scale: 1.03,
    filter: "blur(12px)",
  }),
  center: {
    x: 0, opacity: 1, scale: 1,
    filter: "blur(0px)",
    zIndex: 1,
  },
  exit: (d) => ({
    x: d > 0 ? "-8%" : "8%",
    opacity: 0,
    scale: 0.97,
    filter: "blur(12px)",
    zIndex: 0,
  }),
};

const IMAGE_TRANSITION = {
  x: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  opacity: { duration: 0.7, ease: "easeInOut" },
  scale: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  filter: { duration: 0.7 },
};

/* ── Stagger animation for list items ── */
const FEATURE_VARIANTS = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ─── Image Panel ──────────────────────────────────────────────────────────── */
function ImagePanel({ tab, direction, onNext }) {
  return (
    <div className="chub-image-panel">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={tab.key}
          custom={direction}
          variants={IMAGE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={IMAGE_TRANSITION}
          className="chub-image-frame"
          onClick={onNext}
        >
          <img src={tab.image} alt={tab.title} className="chub-image-img" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function CareerHubPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromProfile = location.state?.isFromProfile;
  const [active, setActive]       = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused]       = useState(false);

  const goNext = useCallback(() => {
    setDirection(1);
    setActive((p) => (p + 1) % TABS.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActive((p) => (p - 1 + TABS.length) % TABS.length);
  }, []);

  const handleTabClick = (i) => {
    if (i === active) return;
    setDirection(i > active ? 1 : -1);
    setActive(i);
    setPaused(false);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(goNext, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [active, paused, goNext]);

  const tab = TABS[active];

  return (
    <div className="chub-root">

      {/* ── Background mesh ── */}
      <div className="chub-bg-mesh" />
      <motion.div
        className="chub-blob chub-blob-1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.22, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="chub-blob chub-blob-2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Hero header ── */}
      <motion.div
        className="chub-hero"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="chub-hero-badge"
          whileHover={{ scale: 1.04 }}
        >
          <Sparkles size={13} strokeWidth={2.5} />
          <span>Your Career Intelligence Hub</span>
        </motion.div>

        <h1 className="chub-hero-title">
          What would you like to&nbsp;<br />
          <span className="chub-hero-gradient">explore next?</span>
        </h1>

        <p className="chub-hero-sub">
          Three powerful tools — one seamless journey from resume&nbsp;to&nbsp;offer.
        </p>

        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.5 }}
           style={{ marginTop: "2rem", marginBottom: "3.5rem" }}
        >
          <motion.button
             onClick={() => navigate("/career-suggestions")}
             whileHover={{ scale: 1.05, filter: "brightness(1.15)", boxShadow: "0 12px 35px rgba(16, 185, 129, 0.4)" }}
             whileTap={{ scale: 0.95 }}
             style={{
               background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
               color: "#ffffff", 
               border: "none", 
               padding: "1rem 2.5rem", 
               borderRadius: "100px", 
               fontSize: "1.05rem", 
               fontWeight: "700", 
               cursor: "pointer",
               boxShadow: "0 8px 25px rgba(16, 185, 129, 0.25)",
               display: "inline-flex",
               alignItems: "center",
               gap: "0.6rem"
             }}
          >
             Explore Career Path <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* Animated divider line */}
        <motion.div
          className="chub-hero-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* ── Main grid ── */}
      <div className="chub-grid">

        {/* ══ LEFT: Vertical tabs ══ */}
        <motion.div
          className="chub-tabs-col"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {TABS.map((t, i) => {
            const isActive = active === i;
            const Icon = t.icon;
            return (
              <motion.button
                key={t.id}
                className={`chub-tab${isActive ? " chub-tab--active" : ""}`}
                onClick={() => handleTabClick(i)}
                whileHover={!isActive ? { x: 6 } : {}}
                transition={{ duration: 0.25 }}
              >
                {/* Left progress rail */}
                <div className="chub-tab-rail">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key={`prog-${i}-${paused}`}
                        className="chub-tab-rail-fill"
                        style={{ background: t.gradient }}
                        initial={{ scaleY: 0 }}
                        animate={paused ? { scaleY: 0 } : { scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: AUTO_PLAY_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Icon */}
                <motion.div
                  className="chub-tab-icon"
                  animate={
                    isActive
                      ? { background: t.gradient, boxShadow: `0 8px 28px ${t.glowColor}` }
                      : { background: "rgba(255,255,255,0.05)", boxShadow: "none" }
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} color={isActive ? "#fff" : t.color} />
                </motion.div>

                {/* Text */}
                <div className="chub-tab-body">
                  <div className="chub-tab-number">/{t.id}</div>

                  <motion.div
                    className="chub-tab-title"
                    animate={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {t.title}
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`body-${i}`}
                        initial={{ opacity: 0, height: 0, y: 8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="chub-tab-expanded"
                      >
                        <p className="chub-tab-desc">{t.description}</p>

                        <ul className="chub-tab-features">
                          {t.features.map((f, fi) => (
                            <motion.li
                              key={f}
                              custom={fi}
                              variants={FEATURE_VARIANTS}
                              initial="hidden"
                              animate="visible"
                            >
                              <CheckCircle2 size={13} color={t.color} strokeWidth={2.5} />
                              {f}
                            </motion.li>
                          ))}
                        </ul>

                        <motion.button
                          className="chub-tab-cta"
                          style={{ background: t.gradient, boxShadow: `0 10px 30px ${t.glowColor}` }}
                          onClick={(e) => { e.stopPropagation(); navigate(t.route); }}
                          whileHover={{ scale: 1.03, y: -3, filter: "brightness(1.15)", boxShadow: `0 15px 40px ${t.glowColor}` }}
                          whileTap={{ scale: 0.97 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.4 }}
                        >
                          Go to {t.title}
                          <ChevronRight size={15} strokeWidth={2.5} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ══ RIGHT: Image column ══ */}
        <motion.div
          className="chub-image-col"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dynamic colour glow */}
          <motion.div
            className="chub-image-glow"
            animate={{ background: tab.glowColor }}
            transition={{ duration: 0.7 }}
          />

          <ImagePanel tab={tab} direction={direction} onNext={goNext} />

          {/* Controls row */}
          <div className="chub-controls">
            {/* Dot indicators */}
            <div className="chub-dots">
              {TABS.map((t, i) => (
                <motion.button
                  key={i}
                  className={`chub-dot${active === i ? " chub-dot--active" : ""}`}
                  onClick={() => handleTabClick(i)}
                  animate={active === i
                    ? { width: "28px", background: tab.color }
                    : { width: "8px", background: "rgba(255,255,255,0.18)" }
                  }
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  aria-label={t.title}
                />
              ))}
            </div>

            {/* Arrow navigation */}
            <div className="chub-nav-btns">
              <motion.button
                className="chub-nav-btn"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.14)" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
              </motion.button>
              <motion.button
                className="chub-nav-btn"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.14)" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next"
              >
                <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom action area ── */}
      <motion.div 
        className="chub-bottom-action"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.button
          className="chub-back-btn"
          onClick={() => navigate(isFromProfile ? "/resume-view" : "/resume-upload")}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back to Analysis
        </motion.button>
      </motion.div>
    </div>
  );
}
