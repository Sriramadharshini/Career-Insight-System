import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Briefcase, GraduationCap, ChevronRight } from "lucide-react";

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

        {/* Path Selection Interactive Nodes */}
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap' }}>
          
          {/* Node 1: Create from Scratch */}
          <motion.div 
            onHoverStart={() => setHoveredPath('fresher')}
            onHoverEnd={() => setHoveredPath(null)}
            onClick={() => navigate("/profile")}
            style={{ 
              width: '100%', maxWidth: '440px', padding: '2.5rem 2.5rem', borderRadius: '32px', 
              background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(30px)', border: '1px solid rgba(167, 139, 250, 0.3)',
              cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
            }}
            whileHover={{ y: -12, scale: 1.02, borderColor: 'rgba(167, 139, 250, 0.6)', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(167, 139, 250, 0.1)' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #a78bfa, #8b5cf6)' }}
              animate={hoveredPath === 'fresher' ? { opacity: 1, scaleX: 1 } : { opacity: 0.3, scaleX: 0.5 }}
            />
            
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
              <GraduationCap size={36} color="#a78bfa" />
            </div>
            
            <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Create a Resume from Scratch</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.8rem', flexGrow: 1 }}>
               Build a professional profile guided by our intelligent builder. Perfect for students, new graduates, or anyone starting fresh.
            </p>
            
            <motion.div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#a78bfa', fontWeight: '700', fontSize: '1.1rem' }}
              animate={{ x: hoveredPath === 'fresher' ? 10 : 0 }}
            >
              Start Building Now <ChevronRight size={20} />
            </motion.div>
          </motion.div>

          {/* Node 2: Upload Existing */}
          <motion.div 
            onHoverStart={() => setHoveredPath('experienced')}
            onHoverEnd={() => setHoveredPath(null)}
            onClick={() => navigate("/resume-upload")}
            style={{ 
              width: '100%', maxWidth: '440px', padding: '2.5rem 2.5rem', borderRadius: '32px', 
              background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(30px)', border: '1px solid rgba(56, 189, 248, 0.3)',
              cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
            }}
            whileHover={{ y: -12, scale: 1.02, borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(56, 189, 248, 0.1)' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)' }}
              animate={hoveredPath === 'experienced' ? { opacity: 1, scaleX: 1 } : { opacity: 0.3, scaleX: 0.5 }}
            />
            
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
              <Briefcase size={36} color="#38bdf8" />
            </div>
            
            <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Upload an Existing Resume</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.8rem', flexGrow: 1 }}>
               Import your current resume and let our AI analyze your experience, find skill gaps, and optimize your ATS visibility.
            </p>
            
            <motion.div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#38bdf8', fontWeight: '700', fontSize: '1.1rem' }}
              animate={{ x: hoveredPath === 'experienced' ? 10 : 0 }}
            >
              Analyze Resume Now <ChevronRight size={20} />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default OnboardingPage;