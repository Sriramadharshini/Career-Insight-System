import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resumeApi } from "../api";
import { NavbarActions } from "../components/common/NavbarPortals";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard } from "lucide-react";

const TIME_LIMIT = 30;

const BODY_LANG_TIPS = [
  "Look directly at the camera lens, not the screen.",
  "Sit upright — good posture projects confidence.",
  "Smile briefly before answering each question.",
  "Speak at a measured pace — avoid rushing.",
  "Use natural hand gestures to emphasise key points.",
  "Avoid looking down or away — maintain eye contact.",
  "Take a breath before you start answering.",
  "Keep your background clean and well-lit.",
  "Avoid filler words like 'um', 'uh', and 'like'.",
  "End each answer with a clear, definitive statement.",
];

/* ─── tiny design tokens ────────────────────────────────────── */
const C = {
  bg:        "#06080f",
  surface:   "rgba(13,17,33,0.85)",
  glass:     "rgba(255,255,255,0.04)",
  border:    "rgba(255,255,255,0.07)",
  indigo:    "#6366f1",
  violet:    "#8b5cf6",
  emerald:   "#10b981",
  rose:      "#f43f5e",
  amber:     "#f59e0b",
  sky:       "#38bdf8",
  text:      "#f1f5f9",
  muted:     "#94a3b8",
  faint:     "#475569",
};

/* ─── shared micro-styles ───────────────────────────────────── */
const pill = (color = C.indigo) => ({
  display: "inline-flex", alignItems: "center", gap: "0.4rem",
  padding: "0.35rem 1rem", borderRadius: "999px",
  background: `${color}18`, border: `1px solid ${color}35`,
  color, fontSize: "0.72rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: "1.5px",
});

const card = (extra = {}) => ({
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: "28px",
  backdropFilter: "blur(28px)",
  boxShadow: "0 32px 64px -12px rgba(0,0,0,0.6)",
  ...extra,
});

const btn = (bg, shadow, extra = {}) => ({
  padding: "1rem 2.2rem", borderRadius: "14px",
  background: bg, border: "none", color: "#fff",
  fontSize: "1rem", fontWeight: 800, cursor: "pointer",
  boxShadow: shadow, transition: "all 0.25s ease",
  ...extra,
});

/* ─── component ─────────────────────────────────────────────── */
const InterviewPrepPage = () => {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [questions,    setQuestions]    = useState([]);
  const [roleTitle,    setRoleTitle]    = useState("Your Role");
  const [answers,      setAnswers]      = useState({});
  const [currentAnswer,setCurrentAnswer]= useState("");
  const [timeSpent,    setTimeSpent]    = useState({});
  const [evalResults,  setEvalResults]  = useState(null);
  const [videoResults, setVideoResults] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft,     setTimeLeft]     = useState(TIME_LIMIT);
  const [isActive,     setIsActive]     = useState(false);
  const [isFinished,   setIsFinished]   = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [mode,         setMode]         = useState(null);
  const [bodyLangTipIdx, setBodyLangTipIdx] = useState(0);

  const videoRef        = useRef(null);
  const mediaRecorderRef= useRef(null);
  const chunksRef       = useRef([]);
  const timerRef        = useRef(null);
  const pendingStreamRef= useRef(null);

  /* fetch questions */
  useEffect(() => {
    resumeApi.getLatest(token)
      .then(res => {
        if (res) {
          const reqRole  = location.state?.targetRole;
          let   roleData = null;
          if (reqRole && res.roleSpecificInsights)
            roleData = res.roleSpecificInsights.find(r => r.role === reqRole);
          if (roleData?.interviewQuestions) {
            setQuestions(roleData.interviewQuestions);
            setRoleTitle(roleData.role);
          } else if (res.interviewQuestions) {
            setQuestions(res.interviewQuestions);
            setRoleTitle(reqRole || res.recommendedRoles?.[0] || "Your Role");
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, location.state]);

  /* countdown */
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleNext();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  /* cleanup camera */
  useEffect(() => () => {
    if (videoRef.current?.srcObject)
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    if (pendingStreamRef.current)
      pendingStreamRef.current.getTracks().forEach(t => t.stop());
  }, []);

  const formatTime = s => `${Math.floor(s/60)}:${(s%60)<10?"0":""}${s%60}`;

  /* video helpers */
  /* Attach pending camera stream once the <video> element renders */
  useEffect(() => {
    if (mode === "video" && videoRef.current && pendingStreamRef.current) {
      const stream = pendingStreamRef.current;
      pendingStreamRef.current = null;
      videoRef.current.srcObject = stream;

      try {
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        chunksRef.current = [];
        mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          setAnswers(p => ({ ...p, [currentIndex]: URL.createObjectURL(blob) }));
        };
        mr.start();
      } catch (recErr) {
        console.error("MediaRecorder error:", recErr);
        stream.getTracks().forEach(t => t.stop());
        alert("Could not start recording. Falling back to Text Mode.");
        setMode("text");
      }
    }
  }, [mode, isActive]);

  const startInterview = async (selectedMode) => {
    if (selectedMode === "video") {
      /* ── Acquire camera BEFORE switching mode ── */
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Your browser does not support video recording.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true }
        );
        pendingStreamRef.current = stream;      // store for useEffect
      } catch (err) {
        console.error("Camera access error:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
          alert("Camera/Microphone access denied. Please allow access in your browser settings.");
        else if (err.name === "NotFoundError")
          alert("No camera or microphone found.");
        else if (err.name === "NotReadableError" || err.name === "AbortError")
          alert("Camera is in use by another application. Please close it and try again.");
        else
          alert("Camera error: " + (err.message || err.name) + ". Falling back to Text Mode.");
        setMode("text");
        return;
      }
    }

    /* ── Set state → triggers re-render → useEffect attaches stream ── */
    setMode(selectedMode);
    setIsActive(true);
    setTimeLeft(TIME_LIMIT);
    setAnswers({});
    setTimeSpent({});
    setEvalResults(null);
    setCurrentAnswer("");
    setCurrentIndex(0);
  };


  const handleBackToMode = () => {
    setIsActive(false); setIsFinished(false);
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    if (videoRef.current?.srcObject)
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
  };

  const handleNext = () => {
    const qTime    = TIME_LIMIT - timeLeft;
    const newSpent = { ...timeSpent, [currentIndex]: qTime };
    setTimeSpent(newSpent);
    const newAnswers = { ...answers, [currentIndex]: currentAnswer };

    if (mode === "text") setAnswers(newAnswers);
    else if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(p => p+1);
      setTimeLeft(TIME_LIMIT);
      setCurrentAnswer("");
      setBodyLangTipIdx(p => (p + 1) % BODY_LANG_TIPS.length);
      if (mode === "video") {
        setTimeout(() => {
          if (mediaRecorderRef.current?.state === "inactive") {
            chunksRef.current = [];
            mediaRecorderRef.current.start();
          }
        }, 500);
      }
    } else {
      setIsActive(false); setIsFinished(true);
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      if (mode === "text") {
        setIsEvaluating(true);
        const qna = questions.map((q,i) => ({
          question: q,
          answer:   i === currentIndex ? currentAnswer : newAnswers[i] || "",
          time:     i === currentIndex ? qTime : newSpent[i] || 0,
        }));
        resumeApi.evaluateInterview(token, { role: roleTitle, qna })
          .then(r => setEvalResults(r))
          .catch(console.error)
          .finally(() => setIsEvaluating(false));
      } else if (mode === "video") {
        setIsEvaluating(true);
        const questionTimings = questions.map((q, i) => ({
          question: q,
          timeTaken: i === currentIndex ? qTime : newSpent[i] || 0,
        }));
        resumeApi.evaluateVideoInterview(token, { role: roleTitle, questionTimings })
          .then(r => setVideoResults(r?.results || r))
          .catch(console.error)
          .finally(() => setIsEvaluating(false));
      }
    }
  };

  /* ── helpers ── */
  const progress     = questions.length ? ((currentIndex) / questions.length) * 100 : 0;
  const timerPercent = timeLeft / TIME_LIMIT;
  const timerColor   = timeLeft <= 10 ? C.rose : C.indigo;

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */

  /* loading */
  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1.5rem" }}>
      <div style={{ width:56, height:56, border:`3px solid ${C.indigo}30`, borderTopColor:C.indigo, borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
      <p style={{ color:C.muted, fontFamily:"'Outfit',sans-serif", fontSize:"1.05rem", margin:0 }}>Preparing your personalised interview track…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* no questions */
  if (!questions.length) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif" }}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{ ...card({padding:"4rem 3rem", textAlign:"center", maxWidth:480}) }}>
        <div style={{ fontSize:"4rem", marginBottom:"1.5rem" }}>🎯</div>
        <h2 style={{ color:C.text, fontWeight:900, fontSize:"1.8rem", margin:"0 0 1rem" }}>Profile Needed</h2>
        <p style={{ color:C.muted, lineHeight:1.7, margin:"0 0 2.5rem" }}>Build your profile or upload a resume first to unlock role-specific interview questions.</p>
        <button onClick={() => navigate("/profile")} style={btn(`linear-gradient(135deg,${C.indigo},${C.violet})`, `0 12px 28px ${C.indigo}40`)}>
          Go to Profile Builder →
        </button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif", color:C.text, padding:"3rem 1.5rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        textarea::placeholder { color: rgba(255,255,255,0.18); }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.25)} }
        @keyframes pulse-ring { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes fade-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .mode-card:hover { transform:translateY(-5px)!important; box-shadow:0 24px 48px -8px rgba(0,0,0,0.7)!important; border-opacity:0.7!important; }
        .mode-card:hover svg { transform:scale(1.12); transition:transform 0.3s ease; }
        .ghost-btn:hover { background:rgba(255,255,255,0.08)!important; }
        .primary-btn:hover { filter:brightness(1.12); transform:translateY(-2px); }
        .danger-btn:hover  { filter:brightness(1.1); }
      `}</style>

      {/* ── ambient glow ── */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, pointerEvents:"none", zIndex:0,
        background:`radial-gradient(ellipse 80% 50% at 20% -10%, ${C.indigo}18 0%, transparent 70%),
                    radial-gradient(ellipse 60% 40% at 80% 110%, ${C.violet}12 0%, transparent 70%)` }} />

      <div style={{ maxWidth:920, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* ── Navbar Actions ── */}
        <NavbarActions>
          <button onClick={() => navigate("/dashboard")}
            style={{
              background: "linear-gradient(135deg, #C026D3, #E879F9)",
              border: "none",
              color: "#ffffff", borderRadius: "10px", padding: "0.55rem 1.25rem",
              fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "all 0.25s ease", boxShadow: "0 6px 15px rgba(192, 38, 211, 0.35)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, #E879F9, #F0ABFC)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(192, 38, 211, 0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, #C026D3, #E879F9)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(192, 38, 211, 0.35)";
            }}>
            <LayoutDashboard size={16} />
            Dashboard
          </button>
        </NavbarActions>

        {/* ── Header ── */}
        <motion.header initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:.5}}
          style={{ textAlign:"center", marginBottom:"3rem" }}>
          <span style={pill(C.indigo)}>
            <span>⚡</span> Professional Interview Simulator
          </span>
          <h1 style={{ fontSize:"clamp(2rem,5vw,3rem)", fontWeight:900, color:C.text, margin:"1rem 0 0.5rem", letterSpacing:"-1.5px", lineHeight:1.15 }}>
            Master the&nbsp;
            <span style={{ background:`linear-gradient(135deg,${C.violet},${C.indigo})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {roleTitle}
            </span>
            &nbsp;Interview
          </h1>
          <p style={{ color:C.muted, fontSize:"1.05rem", margin:0 }}>
            {questions.length} AI-generated questions · 30 seconds each
          </p>
        </motion.header>

        <AnimatePresence mode="wait">

          {/* ════════════════════════════════════
              MODE SELECTION
          ════════════════════════════════════ */}
          {!isActive && !isFinished && (
            <motion.div key="start"
              initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
              transition={{duration:.4}}>

              {/* Stats row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2rem" }}>
                {[
                  { icon:"📋", label:"Questions",    value: questions.length, color: C.indigo },
                  { icon:"⏱️", label:"Per Question", value: "30 sec",         color: C.sky    },
                  { icon:"🏆", label:"Passing Score", value: "70%+",          color: C.emerald },
                ].map(s => (
                  <div key={s.label} style={{ ...card({ padding:"1.5rem", textAlign:"center" }) }}>
                    <div style={{ fontSize:"1.8rem", marginBottom:"0.5rem" }}>{s.icon}</div>
                    <div style={{ fontSize:"1.6rem", fontWeight:900, color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:"0.78rem", color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", marginTop:"0.25rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Mode cards */}
              <div style={{ ...card({ padding:"2.5rem" }) }}>
                <h2 style={{ textAlign:"center", fontSize:"1.6rem", fontWeight:900, margin:"0 0 0.5rem", color:C.text }}>Choose Your Interview Mode</h2>
                <p style={{ textAlign:"center", color:C.muted, margin:"0 0 2.5rem", fontSize:"0.95rem" }}>Select how you'd like to deliver your answers</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>

                  {/* Text mode */}
                  <button className="mode-card" onClick={() => startInterview("text")}
                    style={{ background:`linear-gradient(145deg,${C.indigo}18,${C.indigo}08)`,
                      border:`1px solid ${C.indigo}40`, borderRadius:"22px", padding:"2.5rem 2rem",
                      cursor:"pointer", textAlign:"center", transition:"all 0.3s ease",
                      boxShadow:`0 8px 24px -4px ${C.indigo}20` }}>
                    <div style={{ width:64, height:64, borderRadius:"18px", background:`${C.indigo}22`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem" }}>
                      <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </div>
                    <h3 style={{ color:C.text, margin:"0 0 0.6rem", fontSize:"1.25rem", fontWeight:800 }}>Text Mode</h3>
                    <p style={{ margin:0, color:C.muted, fontSize:"0.9rem", lineHeight:1.6 }}>Read AI-generated questions and type your answers. Best for thoughtful, written responses.</p>
                    <div style={{ marginTop:"1.5rem", ...pill(C.indigo) }}>AI Evaluated</div>
                  </button>

                  {/* Video mode */}
                  <button className="mode-card" onClick={() => startInterview("video")}
                    style={{ background:`linear-gradient(145deg,${C.emerald}18,${C.emerald}08)`,
                      border:`1px solid ${C.emerald}40`, borderRadius:"22px", padding:"2.5rem 2rem",
                      cursor:"pointer", textAlign:"center", transition:"all 0.3s ease",
                      boxShadow:`0 8px 24px -4px ${C.emerald}20` }}>
                    <div style={{ width:64, height:64, borderRadius:"18px", background:`${C.emerald}22`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem" }}>
                      <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </div>
                    <h3 style={{ color:C.text, margin:"0 0 0.6rem", fontSize:"1.25rem", fontWeight:800 }}>Video Mode</h3>
                    <p style={{ margin:0, color:C.muted, fontSize:"0.9rem", lineHeight:1.6 }}>Turn on your camera and microphone. Answer questions by speaking naturally — just like a real interview.</p>
                    <div style={{ marginTop:"1.5rem", ...pill(C.emerald) }}>Live Recording</div>
                  </button>
                </div>

                <div style={{ marginTop:"2rem", padding:"1.25rem 1.5rem", background:C.glass, borderRadius:"14px", border:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", gap:"0.75rem" }}>
                  <span style={{ fontSize:"1.2rem", flexShrink:0, marginTop:"2px" }}>ℹ️</span>
                  <p style={{ margin:0, color:C.muted, fontSize:"0.88rem", lineHeight:1.6 }}>
                    Once started, there is <strong style={{color:C.text}}>no backtracking</strong>. Answer each question within the 30-second window. Text mode answers are evaluated by AI for detailed feedback.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════
              ACTIVE INTERVIEW
          ════════════════════════════════════ */}
          {isActive && (
            <motion.div key="active"
              initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.96}}
              transition={{duration:.35}}>

              {/* Top bar */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
                <button className="ghost-btn" onClick={handleBackToMode}
                  style={{ background:C.glass, border:`1px solid ${C.border}`, color:C.muted,
                    padding:"0.6rem 1.2rem", borderRadius:"10px", cursor:"pointer", fontSize:"0.875rem",
                    fontWeight:700, transition:"all 0.2s", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                  ← Change Mode
                </button>
                <div style={{ ...pill(mode === "video" ? C.rose : C.indigo) }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background: mode==="video"?C.rose:C.indigo, animation:"pulse-dot 1.5s infinite" }} />
                  {mode === "video" ? "Recording" : "Text Mode"}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom:"1.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
                  <span style={{ fontSize:"0.78rem", color:C.faint, fontWeight:800, textTransform:"uppercase", letterSpacing:"1.5px" }}>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span style={{ fontSize:"0.78rem", color:C.faint, fontWeight:700 }}>
                    {Math.round(((currentIndex)/questions.length)*100)}% complete
                  </span>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:"6px", overflow:"hidden" }}>
                  <motion.div
                    animate={{ width:`${progress}%` }}
                    transition={{ duration:.5, ease:"easeOut" }}
                    style={{ height:"100%", background:`linear-gradient(90deg,${C.indigo},${C.violet})`, borderRadius:"6px" }} />
                </div>
                {/* Dot indicators */}
                <div style={{ display:"flex", gap:5, marginTop:"0.6rem" }}>
                  {questions.map((_,i) => (
                    <div key={i} style={{
                      flex:1, height:4, borderRadius:4,
                      background: i===currentIndex ? C.indigo : i < currentIndex ? C.emerald : "rgba(255,255,255,0.07)",
                      transition:"background 0.4s ease",
                    }} />
                  ))}
                </div>
              </div>

              <div style={{ ...card({ padding:"3rem" }) }}>
                {/* Timer + question header */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:"2rem", marginBottom:"2.5rem" }}>
                  {/* Circular timer – self-contained SVG with centred text */}
                  <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
                    <div style={{ position:"relative", width:96, height:96 }}>
                      {/* Coloured glow ring when urgent */}
                      {timeLeft <= 10 && (
                        <div style={{ position:"absolute", inset:-4, borderRadius:"50%", background:`radial-gradient(circle, ${C.rose}25 0%, transparent 70%)`, animation:"pulse-ring 1s ease-in-out infinite" }} />
                      )}
                      <svg width={96} height={96} viewBox="0 0 96 96" style={{ transform:"rotate(-90deg)", display:"block" }}>
                        {/* Track */}
                        <circle cx={48} cy={48} r={40} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
                        {/* Progress arc */}
                        <motion.circle
                          cx={48} cy={48} r={40} fill="none"
                          stroke={timerColor} strokeWidth={6} strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 40}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - timerPercent) }}
                          transition={{ duration: 0.9, ease: "linear" }}
                        />
                        {/* Centred countdown – un-rotate so text stays upright */}
                        <text
                          x={48} y={48}
                          textAnchor="middle" dominantBaseline="central"
                          style={{ transform:"rotate(90deg)", transformOrigin:"48px 48px" }}
                          fill={timeLeft <= 10 ? C.rose : C.text}
                          fontSize={timeLeft < 10 ? 22 : 18}
                          fontWeight={900}
                          fontFamily="'Outfit',sans-serif"
                        >
                          {formatTime(timeLeft)}
                        </text>
                      </svg>
                    </div>
                    <span style={{ fontSize:"0.65rem", color:C.faint, fontWeight:800, textTransform:"uppercase", letterSpacing:"1.5px" }}>remaining</span>
                  </div>

                  {/* Question text */}
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:"0.72rem", color:C.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"1.5px", display:"block", marginBottom:"0.75rem" }}>
                      Interview Question
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.h3 key={currentIndex}
                        initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}}
                        transition={{duration:.3}}
                        style={{ fontSize:"1.45rem", fontWeight:800, color:C.text, lineHeight:1.5, margin:0 }}>
                        {questions[currentIndex]}
                      </motion.h3>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Alert if time is low */}
                {timeLeft <= 10 && (
                  <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                    style={{ marginBottom:"1.5rem", padding:"0.75rem 1.25rem", background:`${C.rose}12`, border:`1px solid ${C.rose}35`, borderRadius:"10px", color:C.rose, fontSize:"0.88rem", fontWeight:700, display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    ⚠️ Time is almost up — wrap up your answer!
                  </motion.div>
                )}

                {/* Answer area */}
                {mode === "text" ? (
                  <div style={{ marginBottom:"2rem" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.75rem" }}>
                      <span style={{ fontSize:"0.82rem", color:C.muted, fontWeight:700 }}>Your Answer</span>
                      <span style={{ fontSize:"0.78rem", color: currentAnswer.length > 500 ? C.rose : C.faint, fontWeight:600 }}>
                        {currentAnswer.length} / 1000
                      </span>
                    </div>
                    <textarea
                      value={currentAnswer}
                      onChange={e => setCurrentAnswer(e.target.value)}
                      placeholder="Type your response here…"
                      style={{
                        width:"100%", height:160, background:"rgba(0,0,0,0.25)",
                        border:`1.5px solid rgba(255,255,255,0.1)`,
                        borderRadius:"16px", padding:"1.25rem 1.5rem",
                        color:C.text, fontSize:"1rem", fontFamily:"inherit",
                        resize:"none", outline:"none", boxSizing:"border-box",
                        transition:"border-color 0.2s ease", lineHeight:1.65,
                      }}
                      onFocus={e => e.target.style.borderColor = C.indigo}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom:"2rem" }}>
                    <div style={{ position:"relative", width:"100%", maxWidth:760, height:380, margin:"0 auto", borderRadius:"18px", overflow:"hidden", background:"#000", border:`1px solid rgba(255,255,255,0.08)`, boxShadow:"0 16px 40px -8px rgba(0,0,0,0.7)" }}>
                      <video ref={videoRef} autoPlay muted playsInline style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />
                      {/* Live badge */}
                      <div style={{ position:"absolute", top:"1rem", right:"1rem", background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)", padding:"0.4rem 1rem", borderRadius:"20px", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <div style={{ width:9, height:9, borderRadius:"50%", background:C.rose, animation:"pulse-dot 1.4s infinite" }} />
                        <span style={{ color:"#fff", fontSize:"0.75rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1.5px" }}>Live</span>
                      </div>
                      {/* Body language tip overlay */}
                      <AnimatePresence mode="wait">
                        <motion.div key={bodyLangTipIdx}
                          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                          style={{ position:"absolute", bottom:0, left:0, right:0, padding:"1rem 1.25rem", background:"linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                            <span style={{ fontSize:"1rem", flexShrink:0 }}>💡</span>
                            <span style={{ color:"rgba(255,255,255,0.85)", fontSize:"0.82rem", fontWeight:600, lineHeight:1.4 }}>
                              {BODY_LANG_TIPS[bodyLangTipIdx % BODY_LANG_TIPS.length]}
                            </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display:"flex", gap:"1rem" }}>
                  <button className="ghost-btn" onClick={handleNext}
                    style={{ flex:1, padding:"1rem 1.5rem", borderRadius:"14px", background:C.glass, border:`1px solid ${C.border}`, color:C.muted, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                    Skip
                  </button>
                  <button className="primary-btn" onClick={handleNext}
                    style={{ ...btn(`linear-gradient(135deg,${C.indigo},${C.violet})`, `0 12px 30px ${C.indigo}40`, { flex:3 }) }}>
                    {mode === "text" ? "Submit & Next →" : "Done & Next →"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════
              FINISHED / RESULTS
          ════════════════════════════════════ */}
          {isFinished && (
            <motion.div key="finish"
              initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
              transition={{duration:.4}}>

              {/* ── AI Evaluating ── */}
              {isEvaluating && (
                <div style={{ ...card({ padding:"5rem 3rem", textAlign:"center" }) }}>
                  <div style={{ width:72, height:72, border:`4px solid ${C.indigo}25`, borderTopColor:C.indigo, borderRadius:"50%", animation:"spin 0.9s linear infinite", margin:"0 auto 2rem" }} />
                  <h3 style={{ fontSize:"1.75rem", fontWeight:900, color:C.text, margin:"0 0 0.75rem" }}>Analysing Your Responses…</h3>
                  <p style={{ color:C.muted, margin:0, fontSize:"1rem" }}>Your answers are being evaluated against industry standards</p>
                </div>
              )}

              {/* ── Eval results ── */}
              {!isEvaluating && evalResults && (
                <div style={{ ...card({ padding:"3rem" }) }}>
                  {/* Hero banner */}
                  <div style={{ textAlign:"center", marginBottom:"3rem", padding:"2.5rem", background:evalResults.totalScore >= 70 ? `${C.emerald}0d` : `${C.amber}0d`, border:`1px solid ${evalResults.totalScore>=70?C.emerald:C.amber}30`, borderRadius:"20px" }}>
                    <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>{evalResults.totalScore >= 80 ? "🏆" : evalResults.totalScore >= 70 ? "🎉" : "📈"}</div>
                    <h2 style={{ fontSize:"2.4rem", fontWeight:900, color:C.text, margin:"0 0 0.5rem" }}>Interview Complete</h2>
                    <p style={{ color:C.muted, margin:0 }}>Results for <strong style={{color:C.text}}>{evalResults.role}</strong></p>
                  </div>

                  {/* Score cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem", marginBottom:"3rem" }}>
                    {[
                      { label:"Overall Score",    value:`${evalResults.totalScore}%`, color: evalResults.totalScore>=70?C.emerald:C.amber },
                      { label:"Confidence Level", value: evalResults.confidenceLevel, color: C.indigo },
                      { label:"Avg Response Time",value:`${evalResults.avgTime}s`,    color: C.sky   },
                    ].map(s => (
                      <div key={s.label} style={{ background:C.glass, border:`1px solid ${C.border}`, borderRadius:"18px", padding:"1.75rem 1.5rem", textAlign:"center" }}>
                        <p style={{ margin:"0 0 0.5rem", fontSize:"0.75rem", color:C.faint, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>{s.label}</p>
                        <p style={{ margin:0, fontSize:"2rem", fontWeight:900, color:s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Question Review */}
                  <h3 style={{ fontSize:"1.2rem", fontWeight:900, color:C.text, margin:"0 0 1.5rem", display:"flex", alignItems:"center", gap:"0.6rem" }}>
                    <span style={{ width:4, height:20, background:`linear-gradient(${C.indigo},${C.violet})`, borderRadius:4, display:"inline-block" }} />
                    Detailed Question Review
                  </h3>

                  <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem", marginBottom:"3rem" }}>
                    {evalResults.evaluatedAnswers.map((item, idx) => (
                      <motion.div key={idx}
                        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:idx*0.05}}
                        style={{ background:`rgba(0,0,0,0.2)`, borderRadius:"18px", overflow:"hidden",
                          border:`1px solid ${item.isCorrect ? C.emerald : C.rose}30`,
                          borderLeft:`4px solid ${item.isCorrect ? C.emerald : C.rose}` }}>
                        {/* Q header */}
                        <div style={{ padding:"1.25rem 1.5rem", background: item.isCorrect ? `${C.emerald}0a` : `${C.rose}0a`, display:"flex", alignItems:"flex-start", gap:"1rem" }}>
                          <span style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", background: item.isCorrect ? `${C.emerald}25` : `${C.rose}25`, color: item.isCorrect ? C.emerald : C.rose, fontSize:"0.8rem", fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {item.isCorrect ? "✓" : "✕"}
                          </span>
                          <p style={{ margin:0, fontSize:"1rem", fontWeight:700, color:C.text, lineHeight:1.5 }}>
                            <span style={{ color:C.faint, fontWeight:600 }}>Q{idx+1}:&nbsp;</span>{item.question}
                          </p>
                        </div>

                        <div style={{ padding:"1.5rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
                          {/* Your answer */}
                          <div>
                            <span style={{ fontSize:"0.72rem", color: item.isCorrect ? C.emerald : C.rose, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Your Answer</span>
                            <div style={{ marginTop:"0.5rem", padding:"0.9rem 1rem", background:"rgba(255,255,255,0.03)", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.06)", color: item.isCorrect ? C.emerald : C.rose, fontSize:"0.9rem", lineHeight:1.6, minHeight:60 }}>
                              {item.userAnswer || <span style={{color:C.faint,fontStyle:"italic"}}>No answer provided</span>}
                            </div>
                          </div>
                          {/* Expected */}
                          <div>
                            <span style={{ fontSize:"0.72rem", color:C.indigo, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Model Answer</span>
                            <div style={{ marginTop:"0.5rem", padding:"0.9rem 1rem", background:`${C.indigo}08`, borderRadius:"10px", border:`1px solid ${C.indigo}20`, color:"#c7d2fe", fontSize:"0.9rem", lineHeight:1.6, minHeight:60 }}>
                              {item.expectedAnswer}
                            </div>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div style={{ padding:"0 1.5rem 1.5rem" }}>
                          <span style={{ fontSize:"0.72rem", color:C.amber, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>AI Feedback</span>
                          <p style={{ margin:"0.5rem 0 0", color:C.muted, fontSize:"0.9rem", lineHeight:1.65, background:`${C.amber}08`, border:`1px solid ${C.amber}20`, borderRadius:"10px", padding:"0.9rem 1rem" }}>
                            {item.feedback}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div style={{ display:"flex", gap:"1rem", justifyContent:"center" }}>
                    <button className="ghost-btn" onClick={() => navigate("/career-suggestions")}
                      style={{ padding:"1rem 2rem", borderRadius:"14px", background:C.glass, border:`1px solid ${C.border}`, color:C.text, fontWeight:700, cursor:"pointer", transition:"all 0.2s", fontSize:"0.95rem" }}>
                      ← Back to Dashboard
                    </button>
                    <button className="primary-btn" onClick={() => setIsFinished(false)}
                      style={{ ...btn(`linear-gradient(135deg,${C.emerald},#059669)`, `0 12px 28px ${C.emerald}35`) }}>
                      🔄 Retake Interview
                    </button>
                  </div>
                </div>
              )}

              {/* ── Video complete (rich results) ── */}
              {!isEvaluating && !evalResults && (
                <div style={{ ...card({ padding:"3rem" }) }}>
                  {videoResults ? (
                    <>
                      {/* Score banner */}
                      <div style={{ textAlign:"center", marginBottom:"2.5rem", padding:"2.5rem", background: videoResults.performanceScore >= 70 ? `${C.emerald}0d` : `${C.amber}0d`, border:`1px solid ${videoResults.performanceScore>=70?C.emerald:C.amber}30`, borderRadius:"20px" }}>
                        <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>{videoResults.performanceScore >= 80 ? "🏆" : videoResults.performanceScore >= 60 ? "🎙️" : "📈"}</div>
                        <h2 style={{ fontSize:"2.2rem", fontWeight:900, margin:"0 0 0.5rem", color:C.text }}>Video Interview Complete</h2>
                        <p style={{ color:C.muted, margin:"0 0 1.25rem" }}>Performance analysis for <strong style={{color:C.text}}>{videoResults.role}</strong></p>
                        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.75rem", background:`${videoResults.performanceScore>=70?C.emerald:C.amber}20`, border:`1px solid ${videoResults.performanceScore>=70?C.emerald:C.amber}40`, borderRadius:"999px", padding:"0.6rem 1.5rem" }}>
                          <span style={{ fontSize:"2rem", fontWeight:900, color:videoResults.performanceScore>=70?C.emerald:C.amber }}>{videoResults.performanceScore}%</span>
                          <span style={{ color:C.muted, fontSize:"0.9rem" }}>Pacing Score</span>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2.5rem" }}>
                        {[
                          { label:"Questions",     value: videoResults.totalQuestions, color: C.indigo },
                          { label:"Ideal Pacing",  value: videoResults.idealAnswers,   color: C.emerald },
                          { label:"Needs Work",    value: videoResults.totalQuestions - videoResults.idealAnswers, color: C.amber },
                        ].map(s => (
                          <div key={s.label} style={{ background:C.glass, border:`1px solid ${C.border}`, borderRadius:"16px", padding:"1.25rem", textAlign:"center" }}>
                            <p style={{ margin:"0 0 0.35rem", fontSize:"0.72rem", color:C.faint, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>{s.label}</p>
                            <p style={{ margin:0, fontSize:"2rem", fontWeight:900, color:s.color }}>{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Overall feedback */}
                      <div style={{ marginBottom:"2.5rem", padding:"1.25rem 1.5rem", background:`${C.indigo}08`, border:`1px solid ${C.indigo}20`, borderRadius:"16px" }}>
                        <p style={{ margin:0, color:"#c7d2fe", fontSize:"1rem", lineHeight:1.65 }}>
                          <span style={{ fontWeight:800, color:C.indigo }}>AI Feedback: </span>{videoResults.overallFeedback}
                        </p>
                      </div>

                      {/* Per-question breakdown */}
                      <h3 style={{ fontSize:"1.15rem", fontWeight:900, color:C.text, margin:"0 0 1.25rem", display:"flex", alignItems:"center", gap:"0.6rem" }}>
                        <span style={{ width:4, height:18, background:`linear-gradient(${C.emerald},${C.indigo})`, borderRadius:4, display:"inline-block" }} />
                        Per-Question Breakdown
                      </h3>

                      <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2.5rem" }}>
                        {videoResults.perQuestionFeedback?.map((item, idx) => {
                          const ratingColor = item.timeRating === "ideal" ? C.emerald : item.timeRating === "slightly_short" ? C.sky : item.timeRating === "too_long" ? C.amber : C.rose;
                          const ratingLabel = { ideal:"✓ Ideal", slightly_short:"↑ Brief", too_long:"↓ Long", too_short:"✕ Skipped" }[item.timeRating] || item.timeRating;
                          return (
                            <motion.div key={idx} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx * 0.05 }}
                              style={{ background:"rgba(0,0,0,0.2)", borderRadius:"16px", overflow:"hidden", border:`1px solid ${ratingColor}25`, borderLeft:`4px solid ${ratingColor}` }}>
                              <div style={{ padding:"1rem 1.25rem", background:`${ratingColor}08`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                <p style={{ margin:0, fontSize:"0.9rem", fontWeight:700, color:C.text, flex:1, marginRight:"1rem" }}>
                                  <span style={{ color:C.faint }}>Q{idx+1}: </span>{item.question}
                                </p>
                                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexShrink:0 }}>
                                  <span style={{ fontSize:"0.75rem", color:C.faint }}>{item.timeTaken}s</span>
                                  <span style={{ padding:"0.25rem 0.75rem", background:`${ratingColor}20`, color:ratingColor, borderRadius:"999px", fontSize:"0.75rem", fontWeight:800 }}>{ratingLabel}</span>
                                </div>
                              </div>
                              <div style={{ padding:"1rem 1.25rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                                <div>
                                  <span style={{ fontSize:"0.7rem", color:C.amber, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Timing Feedback</span>
                                  <p style={{ margin:"0.4rem 0 0", fontSize:"0.85rem", color:C.muted, lineHeight:1.5 }}>{item.timeFeedback}</p>
                                </div>
                                <div>
                                  <span style={{ fontSize:"0.7rem", color:C.indigo, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Body Language Tip</span>
                                  <p style={{ margin:"0.4rem 0 0", fontSize:"0.85rem", color:C.muted, lineHeight:1.5 }}>{item.bodyLanguageTip}</p>
                                </div>
                              </div>
                              <div style={{ padding:"0 1.25rem 1rem" }}>
                                <span style={{ fontSize:"0.7rem", color:C.emerald, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Improvement Tip</span>
                                <p style={{ margin:"0.4rem 0 0", fontSize:"0.85rem", color:C.muted, lineHeight:1.5, background:`${C.emerald}08`, border:`1px solid ${C.emerald}20`, borderRadius:"8px", padding:"0.65rem 0.85rem" }}>{item.suggestion}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* General body language tips */}
                      <div style={{ marginBottom:"2.5rem", background:`${C.amber}06`, border:`1px solid ${C.amber}20`, borderRadius:"16px", padding:"1.5rem" }}>
                        <h4 style={{ margin:"0 0 1rem", color:C.amber, fontSize:"0.85rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>General Body Language Coaching</h4>
                        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                          {videoResults.generalBodyLanguageTips?.map((tip, i) => (
                            <div key={i} style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
                              <span style={{ color:C.amber, flexShrink:0, marginTop:"2px" }}>→</span>
                              <span style={{ color:C.muted, fontSize:"0.9rem", lineHeight:1.5 }}>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Fallback if video results didn't load */
                    <>
                      <div style={{ fontSize:"5rem", marginBottom:"2rem", textAlign:"center" }}>🎙️</div>
                      <h2 style={{ fontSize:"2.4rem", fontWeight:900, margin:"0 0 1rem", color:C.text, textAlign:"center" }}>Session Complete!</h2>
                      <p style={{ color:C.muted, lineHeight:1.8, maxWidth:520, margin:"0 auto 3rem", fontSize:"1.05rem", textAlign:"center" }}>
                        Excellent effort! You navigated all&nbsp;<strong style={{color:C.text}}>{questions.length}</strong>&nbsp;role-specific questions.
                      </p>
                    </>
                  )}

                  <div style={{ display:"flex", gap:"1rem", justifyContent:"center" }}>
                    <button className="ghost-btn" onClick={() => navigate("/career-suggestions")}
                      style={{ padding:"1rem 2rem", borderRadius:"14px", background:C.glass, border:`1px solid ${C.border}`, color:C.text, fontWeight:700, cursor:"pointer", transition:"all 0.2s", fontSize:"0.95rem" }}>
                      ← Dashboard
                    </button>
                    <button className="primary-btn" onClick={() => { setIsFinished(false); setVideoResults(null); }}
                      style={{ ...btn(`linear-gradient(135deg,${C.emerald},#059669)`, `0 12px 28px ${C.emerald}35`) }}>
                      🔄 Restart Session
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewPrepPage;
