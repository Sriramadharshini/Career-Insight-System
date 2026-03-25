import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resumeApi } from "../api";
import { useAuth } from "../context/AuthContext";

const TIME_LIMIT = 30; // 30 seconds per question

const InterviewPrepPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [roleTitle, setRoleTitle] = useState("Your Role");
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeSpent, setTimeSpent] = useState({});
  const [evalResults, setEvalResults] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mode selection & Video Recording
  const [mode, setMode] = useState(null); // 'text' or 'video'
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    resumeApi.getLatest(token)
      .then(res => {
        if (res) {
          const reqRole = location.state?.targetRole;
          let roleData = null;
          
          if (reqRole && res.roleSpecificInsights) {
             roleData = res.roleSpecificInsights.find(r => r.role === reqRole);
          }
          
          if (roleData && roleData.interviewQuestions) {
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

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleNext();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Clean up media streams on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setAnswers(prev => ({ ...prev, [currentIndex]: url }));
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Microphone/Camera access denied. Falling back to Text Mode.");
      setMode("text");
    }
  };

  const startInterview = async (selectedMode) => {
    setMode(selectedMode);
    setIsActive(true);
    setTimeLeft(TIME_LIMIT);
    setAnswers({});
    setTimeSpent({});
    setEvalResults(null);
    setCurrentAnswer("");
    setCurrentIndex(0);

    if (selectedMode === "video") {
      await startVideoRecording();
    }
  };

  const handleBackToModeSelection = () => {
    setIsActive(false);
    setIsFinished(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const handleNext = () => {
    const currentQTime = TIME_LIMIT - timeLeft;
    setTimeSpent(prev => ({ ...prev, [currentIndex]: currentQTime }));
    const newAnswers = { ...answers, [currentIndex]: currentAnswer };

    if (mode === "text") {
      setAnswers(newAnswers);
    } else if (mode === "video") {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(TIME_LIMIT);
      setCurrentAnswer("");
      
      if (mode === "video") {
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
             chunksRef.current = [];
             mediaRecorderRef.current.start();
          }
        }, 500); // Small delay to let onstop process the previous blob
      }
    } else {
      setIsActive(false);
      setIsFinished(true);
      if (videoRef.current && videoRef.current.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      
      if (mode === "text") {
        setIsEvaluating(true);
        const qna = questions.map((q, i) => ({
          question: q,
          answer: i === currentIndex ? currentAnswer : newAnswers[i] || "",
          time: i === currentIndex ? currentQTime : timeSpent[i] || 0
        }));
        resumeApi.evaluateInterview(token, { role: roleTitle, qna })
          .then(res => setEvalResults(res))
          .catch(err => console.error(err))
          .finally(() => setIsEvaluating(false));
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#050816", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#6366f1", fontSize:"1.2rem", fontWeight: 600 }}>Preparing your customized interview track...</div>
    </div>
  );

  if (!questions.length) return (
    <div style={{ minHeight:"100vh", background:"#050816", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1.5rem" }}>
      <div style={{ fontSize:"4rem" }}>🎯</div>
      <h2 style={{ color:"#fff", margin: 0 }}>Analysis Needed</h2>
      <p style={{ color:"#64748b", maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>Please build your profile or upload a resume first to generate role-specific interview questions.</p>
      <button onClick={() => navigate("/profile")} style={{ padding:"1rem 2.5rem", borderRadius:"12px", background:"#6366f1", color:"#fff", border:"none", cursor:"pointer", fontWeight: 700 }}>Go to Profile Builder</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#050816", fontFamily:"'Inter','Outfit',sans-serif", color:"#e2e8f0", padding:"3rem 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        <header style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div style={{ display:"inline-flex", background:"rgba(99,102,241,0.1)", padding:"0.5rem 1.25rem", borderRadius:"999px", color:"#818cf8", fontSize:"0.8rem", fontWeight:800, marginBottom:"1rem", textTransform:"uppercase", letterSpacing: "1px", border: "1px solid rgba(99,102,241,0.2)" }}>
            Professional Interview Simulator
          </div>
          <h1 style={{ fontSize:"clamp(2rem, 5vw, 2.8rem)", fontWeight:900, color:"#fff", margin:0, letterSpacing: "-1px" }}>
            Master: <span style={{ background:"linear-gradient(135deg,#c084fc,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{roleTitle}</span>
          </h1>
        </header>

        <AnimatePresence mode="wait">
          {!isActive && !isFinished ? (
            <motion.div key="start" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              style={{ background:"rgba(15,20,40,0.8)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"32px", padding:"4rem", textAlign:"center", backdropFilter:"blur(24px)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
              <div style={{ fontSize:"4rem", marginBottom:"1.5rem" }}>🎙️</div>
              <h2 style={{ fontSize:"2.2rem", marginBottom:"1.25rem", fontWeight: 800 }}>Choose Your Interview Mode</h2>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "20px", padding: "2rem", marginBottom: "2.5rem", textAlign: "left", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ color:"#cbd5e1", fontSize:"1.1rem", marginBottom:"1.5rem", lineHeight:1.7, textAlign:"center" }}>
                  <strong style={{ color: "#fff" }}>{questions.length} Questions</strong> matched to your skills. <br/>
                  <strong style={{ color: "#fff" }}>30 Seconds</strong> per question. No backtracking allowed.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <button onClick={() => startInterview("text")} style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:"16px", padding:"2rem", cursor:"pointer", transition:"all 0.3s", textAlign:"center" }}>
                    <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>⌨️</div>
                    <h3 style={{ color:"#fff", margin:"0 0 0.5rem", fontSize:"1.2rem" }}>Text Mode</h3>
                    <p style={{ margin:0, color:"#94a3b8", fontSize:"0.9rem", lineHeight: 1.5 }}>Read the AI-generated questions and type out your answers within the timeframe.</p>
                  </button>
                  <button onClick={() => startInterview("video")} style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:"16px", padding:"2rem", cursor:"pointer", transition:"all 0.3s", textAlign:"center" }}>
                    <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📹</div>
                    <h3 style={{ color:"#fff", margin:"0 0 0.5rem", fontSize:"1.2rem" }}>Video Mode</h3>
                    <p style={{ margin:0, color:"#94a3b8", fontSize:"0.9rem", lineHeight: 1.5 }}>Turn on your camera and microphone. Answer questions by speaking naturally.</p>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : isActive ? (
            <motion.div key="active" initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
              style={{ background:"rgba(15,20,40,0.8)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"32px", padding: "3rem", position:"relative", backdropFilter:"blur(24px)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)" }}>
              
              {/* Progress & Timer Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem" }}>
                <div>
                  <button onClick={handleBackToModeSelection} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#94a3b8", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1rem", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}>← Change Mode</button>
                  <br />
                  <span style={{ fontSize:"0.8rem", color:"#64748b", fontWeight:800, textTransform:"uppercase", letterSpacing: "1.5px" }}>Question Progression</span>
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    {questions.map((_, i) => (
                      <div key={i} style={{ 
                        width: "30px", height: "6px", borderRadius: "10px", 
                        background: i === currentIndex ? "#6366f1" : i < currentIndex ? "#10b981" : "rgba(255,255,255,0.05)",
                        transition: "all 0.5s ease"
                      }} />
                    ))}
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "0.75rem 1.5rem", borderRadius: "20px", border: `1px solid ${timeLeft <= 10 ? "rgba(244,63,94,0.3)" : "rgba(255,255,255,0.05)"}` }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "0.65rem", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Time Remaining</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: timeLeft <= 10 ? "#f43f5e" : "#fff" }}>{formatTime(timeLeft)}</p>
                  </div>
                  <div style={{ width: "40px", height: "40px", position: "relative" }}>
                    <svg width="40" height="40" style={{ transform:"rotate(-90deg)" }}>
                      <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <motion.circle cx="20" cy="20" r="18" fill="none" 
                        stroke={timeLeft <= 10 ? "#f43f5e" : "#6366f1"} strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: timeLeft / TIME_LIMIT }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div style={{ marginBottom:"2rem" }}>
                <div style={{ background: "rgba(99,102,241,0.05)", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(99,102,241,0.1)" }}>
                  <motion.h3 key={currentIndex} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                    style={{ fontSize:"1.6rem", fontWeight:800, color:"#fff", lineHeight:1.4, margin:0 }}>
                    "{questions[currentIndex]}"
                  </motion.h3>
                </div>
              </div>

              {/* Answer Area */}
              <div style={{ marginBottom: "2.5rem" }}>
                {mode === "text" ? (
                  <>
                    <p style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 600, marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
                       <span>Your Answer:</span>
                       <span style={{ color: currentAnswer.length > 500 ? "#f43f5e" : "#64748b" }}>{currentAnswer.length} / 1000 characters</span>
                    </p>
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your concise response here..."
                      style={{
                        width: "100%", height: "160px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "20px", padding: "1.5rem", color: "#fff", fontSize: "1.05rem", fontFamily: "inherit",
                        resize: "none", outline: "none", boxSizing: "border-box", transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </>
                ) : (
                  <div style={{ position: "relative", width: "100%", maxWidth: "800px", height: "450px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", background: "#000", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.6)", padding: "0.4rem 1rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f43f5e", animation: "pulse 1.5s infinite" }} />
                      <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing:"1px" }}>Recording</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:"1.5rem" }}>
                <button onClick={handleNext} style={{ flex:1, padding:"1.25rem", borderRadius:"18px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", color:"#94a3b8", fontSize:"1rem", fontWeight:700, cursor:"pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"}>
                  Skip Question
                </button>
                <button 
                  onClick={handleNext} 
                  style={{ 
                    flex:2, padding:"1.25rem", borderRadius:"18px", 
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)", 
                    border:"none", color:"#fff", fontSize:"1.1rem", fontWeight:800, 
                    cursor: "pointer", 
                    boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
                    transition: "all 0.3s ease"
                  }}>
                  {mode === "text" ? "Submit & Next →" : "Finish Recording & Next →"}
                </button>
              </div>
            </motion.div>
          ) : (
             <motion.div key="finish" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
              style={{ background:"rgba(15,20,40,0.8)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"32px", padding:"4rem", backdropFilter:"blur(24px)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
              {isEvaluating ? (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <div style={{ width: "60px", height: "60px", border: "4px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1.5rem" }} />
                  <h3 style={{ fontSize: "1.5rem", color: "#fff", margin: "0 0 0.5rem" }}>AI Brain at Work...</h3>
                  <p style={{ color: "#94a3b8" }}>Evaluating your answers against industry standards</p>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : evalResults ? (
                <div style={{ textAlign: "left" }}>
                  <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>{evalResults.totalScore >= 70 ? "🏆" : "📈"}</div>
                    <h2 style={{ fontSize:"2.5rem", marginBottom:"0.5rem", fontWeight: 900 }}>Interview Results</h2>
                    <p style={{ color:"#94a3b8", fontSize:"1.1rem" }}>Based on your {mode} responses for {evalResults.role}</p>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                      <p style={{ margin: "0 0 0.5rem", color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Overall Score</p>
                      <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: 900, color: evalResults.totalScore >= 70 ? "#10b981" : "#f59e0b" }}>{evalResults.totalScore}%</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                      <p style={{ margin: "0 0 0.5rem", color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Confidence Level</p>
                      <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#6366f1", marginTop: "0.3rem" }}>{evalResults.confidenceLevel}</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                      <p style={{ margin: "0 0 0.5rem", color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Avg Response Time</p>
                      <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.3rem" }}>{evalResults.avgTime}s</p>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>Question Review</h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
                    {evalResults.evaluatedAnswers.map((item, idx) => (
                      <div key={idx} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "1.5rem", borderLeft: item.isCorrect ? "4px solid #10b981" : "4px solid #f43f5e" }}>
                        <p style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>Q{idx + 1}: {item.question}</p>

                        {!item.isCorrect && (
                           <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "8px", color: "#fca5a5", fontSize: "0.9rem", fontWeight: 600 }}>
                              "The answer you provided is incorrect. Please review the correct response below."
                           </div>
                        )}

                        <div style={{ marginBottom: "1.5rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Your Answer:</span>
                          <div style={{ margin: "0.25rem 0 0", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", color: item.isCorrect ? "#10b981" : "#f43f5e", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            {item.userAnswer || "No answer provided"}
                          </div>
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "#6366f1", textTransform: "uppercase", fontWeight: 700 }}>Correct Answer:</span>
                          <div style={{ margin: "0.25rem 0 0", padding: "1rem", background: "rgba(99,102,241,0.05)", borderRadius: "8px", border: "1px solid rgba(99,102,241,0.2)", color: "#c7d2fe", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            {item.expectedAnswer}
                          </div>
                        </div>
                        
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "#f59e0b", textTransform: "uppercase", fontWeight: 700 }}>Feedback:</span>
                          <p style={{ margin: "0.25rem 0 0", color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.5 }}>
                            {item.feedback}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display:"flex", gap:"1.5rem", justifyContent:"center" }}>
                    <button onClick={() => navigate("/career-suggestions")} style={{ padding:"1.2rem 2.5rem", borderRadius:"18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", fontWeight:700, cursor:"pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.08)"} onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.04)"}>
                      Back to Dashboard
                    </button>
                    <button onClick={() => { setIsFinished(false); }} style={{ padding:"1.2rem 2.5rem", borderRadius:"18px", background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", fontWeight:800, cursor:"pointer", boxShadow: "0 10px 20px rgba(16,185,129,0.3)" }}>
                      Retake Interview
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize:"5rem", marginBottom:"2rem" }}>🎙️</div>
                  <h2 style={{ fontSize:"2.5rem", marginBottom:"1rem", fontWeight: 900 }}>Interview Complete!</h2>
                  <p style={{ color:"#94a3b8", fontSize:"1.2rem", marginBottom:"2.5rem", lineHeight:1.7, maxWidth: 600, margin: "0 auto 3rem" }}>
                    Excellent effort! You've documented your responses through {questions.length} critical role-specific questions. Consistency is key to mastering the real interview.
                  </p>
                  
                  <div style={{ display:"flex", gap:"1.5rem", justifyContent:"center" }}>
                    <button onClick={() => navigate("/career-suggestions")} style={{ padding:"1.2rem 2.5rem", borderRadius:"18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", fontWeight:700, cursor:"pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.08)"} onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.04)"}>
                      Back to Dashboard
                    </button>
                    <button onClick={() => { setIsFinished(false); }} style={{ padding:"1.2rem 2.5rem", borderRadius:"18px", background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", fontWeight:800, cursor:"pointer", boxShadow: "0 10px 20px rgba(16,185,129,0.3)" }}>
                      Restart Session
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        textarea::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InterviewPrepPage;
