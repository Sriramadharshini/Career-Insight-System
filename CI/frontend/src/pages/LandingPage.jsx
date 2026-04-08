import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BrainCircuit, LineChart, Target, ShieldCheck, ChevronDown, CheckCircle2, Zap, FileText, Sparkles, LayoutGrid, Check, Smile, Search, Rocket, BarChart3, Users } from "lucide-react";
import heroAi from "../assets/hero_ai_clean.png";
import benefitsStages from "../assets/benefits_stages.png";
import { CareerHeroIllustration } from "../components/ProjectIllustrations";
import { TextColor } from "../components/ui/text-color";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "backOut" } }
};

const faqVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } }
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="landing-page dark-theme-override">

      {/* SECTION 1: HERO */}
      <section className="landing-hero" id="overview">
        <motion.div
          className="landing-copy landing-copy-centered"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="eyebrow neon-glow-text" variants={fadeInUp} style={{ fontSize: '0.95rem', letterSpacing: '0.25em', fontWeight: 800 }}>AI-Powered Career Intelligence Platform</motion.span>
          <motion.div variants={fadeInUp} style={{ marginTop: '2rem', width: '100%' }}>
            <TextColor />
          </motion.div>

          <motion.p className="lead-text" variants={fadeInUp} style={{ fontSize: '1.25rem', lineHeight: 1.8, maxWidth: 620, color: 'rgba(255,255,255,0.7)' }}>
            Stop guessing what recruiters want. Build professional resumes, uncover skill gaps instantly, and discover perfect job matches — all powered by intelligent AI designed for your success.
          </motion.p>
          <motion.div className="hero-actions" variants={fadeInUp} style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link className="button-link button-primary premium-glow" to="/register" style={{ padding: '1.1rem 2.4rem', fontSize: '1.15rem', fontWeight: 800 }}>
              Get Started Free
            </Link>
            <Link className="button-link button-secondary" to="/login" style={{ padding: '1.1rem 2.4rem', fontSize: '1.15rem', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}>
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="hero-illustration-container"
          style={{ width: '100%', maxWidth: '1100px', margin: '6rem auto 0 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ position: 'relative', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>

            {/* Main High-Quality Illustration */}
            <motion.div
              style={{ flex: '1 1 400px', maxWidth: '500px' }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <img src={heroAi} alt="AI Career Analysis" style={{ width: '100%', height: 'auto', borderRadius: '30px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }} />
            </motion.div>

            {/* Accompanying Content Card */}
            <motion.div
              style={{ flex: '1 1 350px', maxWidth: '450px', padding: '1rem' }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} style={{ background: 'rgba(56, 189, 248, 0.1)', display: 'inline-flex', padding: '0.6rem 1.2rem', borderRadius: '100px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                AI CORE INTELLIGENCE
              </motion.div>
              <motion.h3 variants={fadeInUp} style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1.2rem', fontWeight: '800' }}>Smart Profile Analysis</motion.h3>
              <motion.p variants={fadeInUp} style={{ color: '#a1a1aa', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                Our proprietary neural engine identifies over 200 key signals in your professional profile, ensuring your resume speaks the language of modern recruiters.
              </motion.p>

              <motion.div variants={fadeInUp} style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: "Extraction Accuracy", value: "99.8%" },
                  { label: "ATS Optimization", value: "Real-time" }
                ].map((item, id) => (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#a1a1aa' }}>{item.label}</span>
                    <span style={{ color: '#38bdf8', fontWeight: '800' }}>{item.value}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>      {/* SECTION 2: CORE FEATURES */}
      <section className="landing-value-section" id="features" style={{ padding: '10rem 2rem 6rem 2rem', background: 'linear-gradient(to bottom, #000, #050505)' }}>
        <motion.div
          className="deliverables-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ textAlign: 'center' }}
        >
          <span className="eyebrow neon-glow-text" style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem' }}>Precision Engineering</span>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800', color: '#fff' }}>Features That Get You Hired</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: '#a1a1aa', fontSize: '1.2rem', lineHeight: '1.6' }}>We combine stunning resume designs with powerful data insights to give you an unfair advantage in the job market.</p>
        </motion.div>

        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              marginTop: '5rem',
              width: '100%',
              justifyContent: 'center'
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { title: "Smart ATS Scoring", desc: "Find out instantly if your resume will pass automated recruiter filters before you even apply.", color: "#38bdf8", icon: <BarChart3 size={28} /> },
              { title: "Skill Gap Analysis", desc: "Learn exactly which skills you are missing for your desired jobs, and get tips on how to improve.", color: "#a78bfa", icon: <Zap size={28} /> },
              { title: "Ace Your Interview", desc: "Mock interviews, STAR-based answer coaching, role-specific question sets, and follow-up templates to turn interviews into offers.", color: "#f59e0b", icon: <ShieldCheck size={28} /> },
              { title: "Role Recommendations", desc: "Not sure what to apply for? We analyze your strengths and suggest the best career paths for you.", color: "#34d399", icon: <Target size={28} /> }
            ].map((feat, i) => (
              <motion.div
                key={i}
                className="feature-card-modern"
                variants={popIn}
                whileHover={{ y: -15, scale: 1.02, boxShadow: `0 30px 60px ${feat.color}22` }}
                style={{
                  padding: '3.5rem 2.5rem',
                  background: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'border-color 0.3s ease'
                }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${feat.color}22, ${feat.color}11)`,
                  color: feat.color,
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  border: `1px solid ${feat.color}33`
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1.2rem', fontWeight: '800' }}>{feat.title}</h3>
                <p style={{ color: '#e2e8f0', lineHeight: '1.8', fontSize: '1.1rem' }}>{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* SECTION 3: WORKFLOW */}
      <section className="landing-workflow" id="workflow" style={{ padding: '8rem 2rem', background: '#050505', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}></div>
        <motion.div
          className="workflow-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <span className="eyebrow" style={{ color: '#a78bfa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Seamless Process</span>
          <h2 style={{ fontSize: '3.5rem', color: '#fff', fontWeight: '800', marginTop: '1rem' }}>Your Path To Success</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.25rem', maxWidth: '600px', margin: '1.5rem auto' }}>Accelerate your career journey with our intelligent three-step workflow.</p>
        </motion.div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {[
            { step: "01", title: "Build Your Identity", desc: "Create a high-impact, ATS-optimized resume in minutes using our AI-driven builder.", color: "#38bdf8", icon: <FileText size={36} /> },
            { step: "02", title: "Analyze & Optimize", desc: "Get deep insights into your skill gaps and receive actionable suggestions to stay ahead.", color: "#a78bfa", icon: <LineChart size={36} /> },
            { step: "03", title: "Launch Your Career", desc: "Discover tailored job recommendations and career paths that perfectly match your goals.", color: "#34d399", icon: <Rocket size={36} /> }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              style={{ position: 'relative', height: '100%' }}
            >
              <motion.div
                whileHover={{ y: -10 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '3.5rem 2.5rem',
                  borderRadius: '35px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', fontSize: '3.5rem', fontWeight: '900', color: 'rgba(255, 255, 255, 0.03)', pointerEvents: 'none' }}>{item.step}</div>
                <div style={{ color: item.color, marginBottom: '2rem', background: `${item.color}15`, padding: '1.2rem', borderRadius: '20px' }}>{item.icon}</div>
                <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1.2rem', fontWeight: '700' }}>{item.title}</h3>
                <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: '1.7' }}>{item.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: IMPACT STATISTICS */}
      <section style={{ padding: '6rem 2rem', background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.05) 0%, transparent 70%)', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}
          >
            {[
              { num: "3.2x", text: "Interview Rate Increase" },
              { num: "140K+", text: "Resumes Analyzed" },
              { num: "98%", text: "ATS Pass Rate" },
              { num: "12min", text: "Average Polish Time" }
            ].map((stat, i) => (
              <motion.div key={i} variants={popIn} style={{ textAlign: 'center', padding: '2rem', borderRight: i !== 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <h3 style={{ fontSize: '3.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', color: 'transparent', margin: '0 0 0.5rem 0' }}>{stat.num}</h3>
                <p style={{ color: '#a1a1aa', fontSize: '1.1rem', margin: 0, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>      {/* SECTION 5: WHO BENEFITS */}
      <section className="benefit-band" id="benefits" style={{ padding: '10rem 2rem', background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.05) 0%, transparent 80%)' }}>
        <motion.div
          className="benefit-intro"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          style={{ textAlign: 'center', marginBottom: '6rem', width: '100%' }}
        >
          <span className="eyebrow neon-glow-text">System Applications</span>
          <h2 style={{ fontSize: '4rem', color: '#fff', fontWeight: '900', letterSpacing: '-0.02em', margin: '1rem auto', textAlign: 'center' }}>Engineered for your Career</h2>
        </motion.div>

        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

          {/* Illustration Row - Perfectly Balanced */}
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '6rem',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 2rem'
            }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          >
            <div style={{ flex: '1 1 600px', maxWidth: '750px' }}>
              <img src={benefitsStages} alt="Career Evolution" style={{ width: '100%', height: 'auto', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} />
            </div>
            <div style={{ flex: '1 1 400px', maxWidth: '500px', textAlign: 'left' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', letterSpacing: '-0.02em', lineHeight: '1.1' }}>Evolve At Every Level</div>
              <p style={{ color: '#cbd5e1', fontSize: '1.4rem', lineHeight: '1.8', margin: 0 }}>Whether you are just starting out or leading a global organization, our platform grows with you, providing the precise intelligence needed for your next leap.</p>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            className="benefit-showcase-grid"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}
          >
            <motion.article className="benefit-showcase-card glassmorphic-card" variants={popIn} whileHover={{ y: -15 }} style={{ padding: '4rem 2.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.8rem 1.5rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '800' }}>University Level</span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '700' }}>For Freshers</h3>
              <p style={{ color: '#a1a1aa', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>Create a strong first resume using projects and academic history to bypass entry-level filters.</p>
              <ul style={{ color: '#e0e0e0', listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem', textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#38bdf8" /> Guided profile synthesis</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#38bdf8" /> Entry-level ATS templates</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#38bdf8" /> First-job role matching</li>
              </ul>
            </motion.article>

            <motion.article className="benefit-showcase-card glassmorphic-card" variants={popIn} whileHover={{ y: -15 }} style={{ padding: '4rem 2.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ background: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', padding: '0.8rem 1.5rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '800' }}>Transitional Phase</span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '700' }}>For Career Pivoters</h3>
              <p style={{ color: '#a1a1aa', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>Translate your past experience into the language of your new desired industry natively.</p>
              <ul style={{ color: '#e0e0e0', listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem', textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#a78bfa" /> Skill translation logic</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#a78bfa" /> Gap detection mapping</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#a78bfa" /> Pivot probability scoring</li>
              </ul>
            </motion.article>

            <motion.article className="benefit-showcase-card glassmorphic-card" variants={popIn} whileHover={{ y: -15 }} style={{ padding: '4rem 2.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '0.8rem 1.5rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '800' }}>Advanced Level</span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '700' }}>For Senior Pros</h3>
              <p style={{ color: '#a1a1aa', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>Condense massive career histories into high-impact, keyword-dense executive summaries.</p>
              <ul style={{ color: '#e0e0e0', listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem', textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#34d399" /> Leadership keyword extraction</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#34d399" /> Impact verb optimization</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 size={22} color="#34d399" /> Executive ATS structuring</li>
              </ul>
            </motion.article>
          </motion.div>
        </div>
      </section>
      {/* SECTION: PREMIUM CALL TO ACTION */}
      <section style={{ padding: '10rem 2rem', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, background: 'radial-gradient(circle at 70% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)' }}></div>
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, background: 'radial-gradient(circle at 20% 80%, rgba(167, 139, 250, 0.08) 0%, transparent 60%)' }}></div>

        <motion.div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
            padding: '6rem 4rem',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(30px)'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.8rem 1.5rem', borderRadius: '100px', color: '#38bdf8', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.1em', display: 'inline-block', marginBottom: '2rem' }}>
            LIMITED TIME FREE ACCESS
          </div>
          <h2 style={{ fontSize: '4rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
            Elevate Your Career <br /> <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Today.</span>
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#a1a1aa', marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3.5rem auto', lineHeight: '1.6' }}>
            Join thousands of professionals already using Career Insight to unlock their true potential and secure higher-paying roles.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="nav-pill" style={{ padding: '1.4rem 3.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              Get Started<Rocket size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER - Polished Professional Design */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#050505', padding: '6rem 2rem 3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '5rem' }}>

          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.6rem', borderRadius: '12px' }}>
                <Sparkles size={26} color="#38bdf8" />
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: 0, fontWeight: '800', letterSpacing: '-0.02em' }}>Career Insight System</h2>
            </div>
            <p style={{ color: '#a1a1aa', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '380px' }}>
              Our AI-powered platform provides intelligent tools for resume building, skill gap analysis, and personalized career growth.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Rocket size={18} color="#a1a1aa" />
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <BrainCircuit size={18} color="#a1a1aa" />
              </div>
            </div>
          </div>

          {/* Links Grid Wrapper for Symmetrical Alignment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', width: '100%' }}>
            {/* Links Col 1 - Platform */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h3>
              <Link to="/login" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s', fontSize: '1rem' }} className="footer-link-hover">Sign In</Link>
              <Link to="/register" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s', fontSize: '1rem' }} className="footer-link-hover">Create Account</Link>
              <a href="#features" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s', fontSize: '1rem' }} className="footer-link-hover">Key Features</a>
              <a href="#workflow" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s', fontSize: '1rem' }} className="footer-link-hover">Our Workflow</a>
            </div>

            {/* Links Col 2 - Resources */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h3>
              <span style={{ color: '#a1a1aa', cursor: 'pointer', fontSize: '1rem' }} className="footer-link-hover">Documentation</span>
              <span style={{ color: '#a1a1aa', cursor: 'pointer', fontSize: '1rem' }} className="footer-link-hover">Architecture</span>
              <span style={{ color: '#a1a1aa', cursor: 'pointer', fontSize: '1rem' }} className="footer-link-hover">User Manual</span>
              <span style={{ color: '#a1a1aa', cursor: 'pointer', fontSize: '1rem' }} className="footer-link-hover">Privacy & Ethics</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Polished Attribution */}
        <div style={{ maxWidth: '1200px', margin: '5rem auto 0 auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>Career Insight System | 2026</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#334155' }}></div>
            <span style={{ color: '#475569', fontSize: '0.95rem' }}>Empowering Career Excellence</span>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <span style={{ color: '#475569', fontSize: '0.9rem', cursor: 'pointer' }} className="footer-link-hover">Terms of Service</span>
            <span style={{ color: '#475569', fontSize: '0.9rem', cursor: 'pointer' }} className="footer-link-hover">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
