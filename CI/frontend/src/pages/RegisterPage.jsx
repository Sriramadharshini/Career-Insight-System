import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { motion } from "framer-motion";
import registerIllustration from "../assets/register_illustration_v2.png";
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Unable to connect. Please ensure the server is running.");
    }
  };

  return (
    <section className="auth-page-container dark-theme-override">
      <div className="auth-center-card" style={{ background: 'transparent', boxShadow: 'none', maxWidth: '1000px' }}>

        {/* Left Side: Clean Form -> Transformed to Dark Premium Form */}
        <motion.div
          className="auth-form-pane glassmorphic-card"
          style={{ background: 'rgba(15, 15, 20, 0.85)', borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: '1px solid rgba(255,255,255,0.05)' }}
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          <div className="auth-card auth-card-wide auth-form-card" style={{ maxWidth: '440px', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <motion.div style={{ textAlign: 'center', marginBottom: '2rem' }} variants={popItem}>
              <AnimatedText
                text="Start Your Journey"
                gradientColors="linear-gradient(90deg, #a78bfa, #ec4899, #f59e0b, #a78bfa)"
                gradientAnimationDuration={3}
                style={{ padding: '0.25rem 0 0.5rem' }}
                textClassName="auth-animated-title"
              />
              <p className="auth-subtext neon-glow-text">Discover Your Career Path</p>
            </motion.div>

            <motion.form onSubmit={handleSubmit} className="form-grid" variants={formStagger} initial="hidden" animate="visible">

              <motion.div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} variants={popItem}>
                <label className="field-group">
                  <span className="field-label" style={{ color: '#a1a1aa' }}>Full Name <span style={{ color: '#ff453a' }}>*</span></span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    required
                  />
                </label>

                <label className="field-group">
                  <span className="field-label" style={{ color: '#a1a1aa' }}>Phone <span style={{ color: '#ff453a' }}>*</span></span>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    required
                  />
                </label>
              </motion.div>

              <motion.label className="field-group" variants={popItem}>
                <span className="field-label" style={{ color: '#a1a1aa' }}>Email Address <span style={{ color: '#ff453a' }}>*</span></span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  required
                />
              </motion.label>

              <motion.div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} variants={popItem}>
                <label className="field-group">
                  <span className="field-label" style={{ color: '#a1a1aa' }}>Password <span style={{ color: '#ff453a' }}>*</span></span>
                  <input
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    required
                  />
                </label>

                <label className="field-group">
                  <span className="field-label" style={{ color: '#a1a1aa' }}>Confirm <span style={{ color: '#ff453a' }}>*</span></span>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    required
                  />
                </label>
              </motion.div>

              {error && <p className="error-text" style={{ color: '#ff453a' }}>{error}</p>}

              {settings?.allowRegistration === false && (
                <div style={{ color: '#ff453a', background: 'rgba(255, 69, 58, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', border: '1px solid rgba(255, 69, 58, 0.2)' }}>
                  User registration is currently disabled by the administrator.
                </div>
              )}

              <motion.div style={{ marginTop: '0.5rem' }} variants={popItem}>
                <motion.button
                  type="submit"
                  disabled={settings?.allowRegistration === false}
                  style={{ 
                    width: '100%', 
                    padding: '0.8rem', 
                    fontSize: '1rem', 
                    background: settings?.allowRegistration === false ? '#333' : 'linear-gradient(135deg, #a78bfa, #ec4899)', 
                    border: 'none', 
                    color: settings?.allowRegistration === false ? '#777' : '#fff', 
                    borderRadius: '12px',
                    cursor: settings?.allowRegistration === false ? 'not-allowed' : 'pointer'
                  }}
                  whileHover={settings?.allowRegistration !== false ? { scale: 1.02, boxShadow: '0 0 20px rgba(167, 139, 250, 0.4)' } : {}}
                  whileTap={settings?.allowRegistration !== false ? { scale: 0.98 } : {}}
                >
                  Join the Network
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.p
              className="auth-footer-text"
              style={{ marginTop: '2rem', textAlign: 'center', color: '#a1a1aa' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Already have an account? <Link to="/login" style={{ color: '#a78bfa', fontWeight: '600', marginLeft: '0.5rem' }}>Sign in here</Link>
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side: Animated Illustration */}
        <motion.div
          className="auth-hero-pane glassmorphic-card"
          style={{ borderLeft: 'none', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <img src={registerIllustration} alt="Career Guidance Illustration" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <AnimatedText
              text="Build Your Career with AI"
              gradientColors="linear-gradient(90deg, #a78bfa, #38bdf8, #34d399, #a78bfa)"
              gradientAnimationDuration={3.5}
              style={{ padding: '0.5rem 0' }}
              textClassName="auth-hero-animated-title"
            />
          </motion.div>
          <motion.p style={{ color: 'rgba(255,255,255,0.7)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            Join our platform to leverage AI-driven tools that analyze your resume, recommend accurate job roles, and guide your next professional moves.
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
};

export default RegisterPage;
