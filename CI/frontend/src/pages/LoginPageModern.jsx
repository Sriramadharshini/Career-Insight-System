import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import loginIllustration from "../assets/login_illustration_v2.png";
import { AnimatedText } from "../components/ui/animated-shiny-text";
import { Eye, EyeOff, ShieldCheck, User as UserIcon, AlertCircle } from "lucide-react";

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
  const { login, adminLogin } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log(`[LoginPage] Attempting ${isAdminMode ? 'Admin' : 'User'} login for: ${formData.email}`);
      
      const authFunc = isAdminMode ? adminLogin : login;
      const data = await authFunc(formData);
      
      // Explicitly check role and redirect immediately
      if (data?.user?.role === "admin") {
        console.log("[LoginPage] Admin login successful, redirecting...");
        navigate("/admin/dashboard", { replace: true });
      } else {
        console.log("[LoginPage] User login successful, redirecting...");
        navigate("/onboarding", { replace: true });
      }
    } catch (err) {
      console.error("[LoginPage] Login error:", err);
      setError(err.message || "Invalid credentials or server error.");
    } finally {
      setIsLoading(false);
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
            

            
            {/* Mode Toggle */}
            <motion.div 
              className="auth-mode-toggle"
              variants={popItem}
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '4px',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <button
                onClick={() => { setIsAdminMode(false); setError(""); }}
                className={`mode-btn ${!isAdminMode ? 'active' : ''}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 0',
                  borderRadius: '8px',
                  border: 'none',
                  background: !isAdminMode ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  color: !isAdminMode ? '#38bdf8' : '#a1a1aa',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <UserIcon size={16} />
                User
              </button>
              <button
                onClick={() => { setIsAdminMode(true); setError(""); }}
                className={`mode-btn ${isAdminMode ? 'active' : ''}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 0',
                  borderRadius: '8px',
                  border: 'none',
                  background: isAdminMode ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: isAdminMode ? '#8b5cf6' : '#a1a1aa',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <ShieldCheck size={16} />
                Admin
              </button>
            </motion.div>
            
            <motion.form onSubmit={handleSubmit} className="form-grid" variants={formStagger} initial="hidden" animate="visible">
              <motion.label className="field-group" variants={popItem}>
                <span className="field-label" style={{ color: '#a1a1aa' }}>Email Address</span>
                <input
                  type="email"
                  placeholder={isAdminMode ? "admin@careerinsight.com" : "Enter your email address"}
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  required
                />
              </motion.label>

              <motion.label className="field-group" variants={popItem} style={{ position: 'relative' }}>
                <span className="field-label" style={{ color: '#a1a1aa' }}>Password</span>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', width: '100%' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#a1a1aa',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.label>

              <motion.div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }} variants={popItem}>
                <Link to="/login" className="auth-inline-link" style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: '500' }}>
                  Forgot password?
                </Link>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: '#ef4444', 
                      background: 'rgba(239, 68, 68, 0.1)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      marginBottom: '1.5rem',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button 
                type="submit" 
                className="auth-submit-button" 
                disabled={isLoading}
                style={{ 
                  padding: '0.8rem', 
                  fontSize: '1rem', 
                  background: isAdminMode 
                    ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' 
                    : 'linear-gradient(135deg, #38bdf8, #8b5cf6)', 
                  border: 'none', 
                  color: '#fff',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                variants={popItem}
                whileHover={{ scale: 1.01, boxShadow: isAdminMode ? '0 0 20px rgba(139, 92, 246, 0.4)' : '0 0 20px rgba(56, 189, 248, 0.4)' }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? 'Processing...' : isAdminMode ? 'Admin Access' : 'Access Portal'}
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
