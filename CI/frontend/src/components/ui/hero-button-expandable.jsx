/**
 * ExpandableCTAButton — hero button that morphs into a full-screen career
 * onboarding modal using framer-motion layoutId.
 *
 * Replaces GodRays / MeshGradient shaders with pure CSS animated gradients.
 * No Tailwind, no TypeScript — plain JSX + inline styles.
 */
import { useState, useEffect } from "react";
import { X, Check, ArrowRight, BrainCircuit, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function ExpandableCTAButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formStep, setFormStep] = useState("idle"); // "idle" | "submitting" | "success"
  const navigate = useNavigate();

  const handleExpand = () => setIsExpanded(true);

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => setFormStep("idle"), 500);
  };

  const handleGoRegister = () => {
    handleClose();
    navigate("/register");
  };

  const handleGoLogin = () => {
    handleClose();
    navigate("/login");
  };

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isExpanded ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isExpanded]);

  return (
    <>
      {/* ── Trigger button ───────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {!isExpanded && (
          <motion.div style={{ position: "relative", display: "inline-block" }}>
            {/* Expanding background tile (layoutId shared with modal) */}
            <motion.div
              layoutId="cta-expander"
              style={{ borderRadius: "100px", position: "absolute", inset: 0 }}
              className="cta-btn-bg"
            />
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25 }}
              onClick={handleExpand}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "1.1rem 2.4rem",
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#fff",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expanded full-screen modal ────────────────────────── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}>
            <motion.div
              layoutId="cta-expander"
              layout
              transition={{ type: "spring", bounce: 0, duration: 0.45 }}
              style={{
                borderRadius: "28px",
                width: "100%",
                maxWidth: "980px",
                minHeight: "580px",
                maxHeight: "92vh",
                overflow: "hidden",
                position: "relative",
                display: "flex",
              }}
              className="cta-modal-bg"
            >
              {/* Animated mesh gradient overlay */}
              <div className="cta-mesh-gradient" />

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                onClick={handleClose}
                style={{
                  position: "absolute", top: "1.25rem", right: "1.25rem",
                  zIndex: 50, width: "40px", height: "40px",
                  borderRadius: "50%", background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff",
                }}
              >
                <X size={18} />
              </motion.button>

              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "100%",
                  position: "relative",
                  zIndex: 10,
                  overflowY: "auto",
                }}
              >
                {/* Left — info panel */}
                <div style={{
                  flex: "1 1 300px",
                  padding: "3rem 3rem 3rem 3.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "2rem",
                  color: "#fff",
                }}>
                  <div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.4rem 1rem", borderRadius: "999px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontSize: "0.8rem", fontWeight: 700,
                      letterSpacing: "0.1em", marginBottom: "1.25rem",
                      color: "#bfdbfe",
                    }}>
                      <BrainCircuit size={14} />
                      AI-POWERED CAREER ENGINE
                    </div>
                    <h2 style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                      fontWeight: 900, margin: "0 0 0.75rem",
                      lineHeight: 1.1, letterSpacing: "-0.03em",
                    }}>
                      Ready to launch your career?
                    </h2>
                    <p style={{ color: "#bfdbfe", fontSize: "1.05rem", lineHeight: 1.7, margin: 0 }}>
                      Join thousands of professionals using AI to build standout resumes, close skill gaps, and land their dream roles.
                    </p>
                  </div>

                  {/* Feature highlights */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {[
                      { icon: <Check size={16} />, text: "ATS-optimized resume builder in minutes" },
                      { icon: <Check size={16} />, text: "AI skill gap analysis & career path insights" },
                      { icon: <Check size={16} />, text: "Mock interview coaching with real feedback" },
                      { icon: <Check size={16} />, text: "Smart job matching for your profile" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "8px",
                          background: "rgba(255,255,255,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, color: "#93c5fd",
                        }}>
                          {item.icon}
                        </div>
                        <span style={{ color: "#e0f2fe", fontSize: "0.97rem" }}>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial */}
                  <div style={{
                    padding: "1.25rem 1.5rem",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}>
                    <p style={{ color: "#e0f2fe", fontSize: "0.92rem", lineHeight: 1.65, margin: "0 0 0.75rem", fontStyle: "italic" }}>
                      "Career Insight helped me land a senior role 3 months after uploading my first resume. The AI analysis was spot on."
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #f472b6, #818cf8)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.9rem", color: "#fff",
                      }}>PS</div>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.88rem" }}>Priya Sharma</div>
                        <div style={{ color: "#93c5fd", fontSize: "0.8rem" }}>Senior Dev, TechCorp</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — CTA panel */}
                <div style={{
                  flex: "1 1 280px",
                  padding: "3rem 3.5rem 3rem 2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "1.25rem",
                }}>
                  <div style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "2.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}>
                    <h3 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                      Start for free today
                    </h3>
                    <p style={{ color: "#bfdbfe", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
                      No credit card required. Full access to AI career tools from day one.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                      {/* Primary CTA */}
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(99,102,241,0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoRegister}
                        style={{
                          width: "100%", padding: "0.95rem",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          color: "#fff", border: "none", borderRadius: "12px",
                          fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                          fontFamily: "inherit", letterSpacing: "-0.01em",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                          boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
                        }}
                      >
                        Create Free Account <Rocket size={17} />
                      </motion.button>

                      {/* Secondary CTA */}
                      <motion.button
                        whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoLogin}
                        style={{
                          width: "100%", padding: "0.9rem",
                          background: "rgba(255,255,255,0.08)",
                          color: "#e0f2fe", border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "12px", fontSize: "0.95rem", fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                      >
                        Sign In to your account
                      </motion.button>
                    </div>

                    <div style={{
                      display: "flex", flexWrap: "wrap", gap: "0.5rem",
                      marginTop: "0.5rem", justifyContent: "center",
                    }}>
                      {["Free forever plan", "No setup needed", "Cancel anytime"].map(tag => (
                        <span key={tag} style={{
                          fontSize: "0.75rem", color: "#93c5fd",
                          background: "rgba(255,255,255,0.07)",
                          padding: "0.25rem 0.7rem", borderRadius: "999px",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{
                    display: "flex", gap: "0.75rem", justifyContent: "space-between",
                  }}>
                    {[
                      { num: "140K+", label: "Resumes Built" },
                      { num: "98%", label: "ATS Pass Rate" },
                      { num: "3.2×", label: "Interview Rate" },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        flex: 1, textAlign: "center",
                        padding: "0.85rem 0.5rem",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}>
                        <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, lineHeight: 1 }}>{stat.num}</div>
                        <div style={{ color: "#93c5fd", fontSize: "0.72rem", marginTop: "0.3rem" }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        /* Trigger button gradient background */
        .cta-btn-bg {
          background: linear-gradient(135deg, #38bdf8, #8b5cf6);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
          transition: box-shadow 0.3s ease;
        }

        /* Modal animated gradient background */
        .cta-modal-bg {
          background: linear-gradient(135deg, #1e1b4b, #1e3a8a, #0c4a6e);
          background-size: 300% 300%;
          animation: cta-mesh-shift 8s ease infinite;
        }

        /* Moving noise/mesh overlay */
        .cta-mesh-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.35) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, rgba(56,189,248,0.3) 0%, transparent 55%),
            radial-gradient(ellipse at 60% 20%, rgba(139,92,246,0.25) 0%, transparent 50%);
          animation: cta-mesh-shift 10s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes cta-mesh-shift {
          0%   { background-position: 0% 50%; opacity: 0.9; }
          50%  { background-position: 100% 50%; opacity: 1; }
          100% { background-position: 0% 50%; opacity: 0.9; }
        }
      `}</style>
    </>
  );
}
