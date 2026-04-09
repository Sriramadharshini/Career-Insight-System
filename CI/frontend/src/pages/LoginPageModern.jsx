import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import loginIllustration from "../assets/login_illustration_v2.png";
import { AnimatedText } from "../components/ui/animated-shiny-text";

// Animation Variants
const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
};

const formStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.4 }
  }
};

const popItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const LoginPageModern = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await login(formData);
      if (data?.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      setError(err.message || "Unable to connect. Please ensure the server is running.");
    }
  };


  return (
    <section className="auth-page-container dark-theme-override">
      <div className="auth-center-card" style={{ background: 'transparent', boxShadow: 'none' }}>
        
        {/* Left Side: Solid Gradient Hero (Animated) */}
        <motion.div 
          className="auth-hero-pane glassmorphic-card" 
          style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          <img src={loginIllustration} alt="AI Career Analytics Illustration" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <AnimatedText
              text="Unlock Your AI Career Potential"
              gradientColors="linear-gradient(90deg, #38bdf8, #34d399, #8b5cf6, #38bdf8)"
              gradientAnimationDuration={4}
              style={{ padding: '0.5rem 0' }}
              textClassName="auth-hero-animated-title"
            />
          </motion.div>
          <motion.p style={{ color: 'rgba(255,255,255,0.7)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            Sign in to access personalized career insights, ATS score analysis, and intelligent skill gap detection.
          </motion.p>
        </motion.div>

        {/* Right Side: Clean White Form -> Transformed to Dark Premium Form */}
        <motion.div 
          className="auth-form-pane glassmorphic-card"
          style={{ background: 'rgba(15, 15, 20, 0.85)', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: '1px solid rgba(255,255,255,0.05)' }}
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <div className="auth-card auth-form-card auth-login-form-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <motion.div className="auth-login-form-head" style={{ textAlign: 'center', marginBottom: '2rem' }} variants={popItem}>
              <AnimatedText
                text="Welcome Back"
                gradientColors="linear-gradient(90deg, #38bdf8, #8b5cf6, #ec4899, #38bdf8)"
                gradientAnimationDuration={3}
                style={{ padding: '0.25rem 0 0.5rem' }}
                textClassName="auth-animated-title"
              />
              <p className="auth-subtext neon-glow-text">Log In To Career Insight</p>
            </motion.div>
            

            
            <motion.form onSubmit={handleSubmit} className="form-grid" variants={formStagger} initial="hidden" animate="visible">
              <motion.label className="field-group" variants={popItem}>
                <span className="field-label" style={{ color: '#a1a1aa' }}>Email Address</span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  required
                />
              </motion.label>

              <motion.label className="field-group" variants={popItem}>
                <span className="field-label" style={{ color: '#a1a1aa' }}>Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  required
                />
              </motion.label>

              <motion.div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }} variants={popItem}>
                <Link to="/login" className="auth-inline-link" style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: '500' }}>
                  Forgot password?
                </Link>
              </motion.div>

              {error && <p className="error-text">{error}</p>}
              
              <motion.button 
                type="submit" 
                className="auth-submit-button" 
                style={{ padding: '0.8rem', fontSize: '1rem', background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)', border: 'none', color: '#000' }}
                variants={popItem}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                Access Portal
              </motion.button>
            </motion.form>
            
            <motion.p 
              className="auth-footer-text" 
              style={{ marginTop: '2rem', textAlign: 'center', color: '#a1a1aa', fontSize: '0.9rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Don&apos;t have an account? <Link to="/register" style={{ color: '#38bdf8', fontWeight: '600', marginLeft: '0.5rem' }}>Create account</Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginPageModern;
