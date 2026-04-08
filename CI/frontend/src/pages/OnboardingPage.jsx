import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Briefcase, GraduationCap, ChevronRight } from "lucide-react";
import SkewCards from "../components/ui/gradient-card-showcase";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [hoveredPath, setHoveredPath] = useState(null); // 'fresher' or 'experienced'

  return (
    <section className="dark-theme-override" style={{ 
      position: 'relative', 
      minHeight: 'calc(100vh - 73px)', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      
      {/* Dynamic Background Elements */}
      <AnimatePresence>
        {hoveredPath === 'fresher' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}
          />
        )}
        {hoveredPath === 'experienced' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px', padding: '2rem' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1.1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', marginBottom: '1rem' }}>
            <BrainCircuit size={16} color="#38bdf8" />
            <span className="neon-glow-text" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>System Initialized</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3rem)', fontWeight: '800', margin: '0 0 0.8rem 0', letterSpacing: '-0.03em', color: '#fff' }}>
            Initialize Your <span style={{ background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Vector</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
            The AI core requires your baseline to generate the optimal career trajectory. Select your starting coordinates.
          </p>
        </motion.div>

        {/* Path Selection — Animated Skew Cards */}
        <SkewCards
          cards={[
            {
              title: "Create a Resume from Scratch",
              desc: "Build a professional profile guided by our intelligent builder. Perfect for students, new graduates, or anyone starting fresh on their career journey.",
              gradientFrom: "#a78bfa",
              gradientTo: "#8b5cf6",
              icon: (
                <div style={{
                  width: "60px", height: "60px", borderRadius: "16px",
                  background: "rgba(167,139,250,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(167,139,250,0.4)"
                }}>
                  <GraduationCap size={30} color="#a78bfa" />
                </div>
              ),
              actionLabel: "Start Building Now →",
              onClick: () => navigate("/profile"),
            },
            {
              title: "Upload an Existing Resume",
              desc: "Import your current resume and let our AI analyze your experience, find skill gaps, and optimize your ATS visibility for maximum recruiter impact.",
              gradientFrom: "#38bdf8",
              gradientTo: "#0ea5e9",
              icon: (
                <div style={{
                  width: "60px", height: "60px", borderRadius: "16px",
                  background: "rgba(56,189,248,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(56,189,248,0.4)"
                }}>
                  <Briefcase size={30} color="#38bdf8" />
                </div>
              ),
              actionLabel: "Analyze Resume Now →",
              onClick: () => navigate("/resume-upload"),
            },
          ]}
        />
      </div>
    </section>
  );
};

export default OnboardingPage;