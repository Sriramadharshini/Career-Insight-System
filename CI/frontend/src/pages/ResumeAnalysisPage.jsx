import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { resumeApi } from "../api";
import { useAuth } from "../context/AuthContext";

const scoreColors = {
  contactInfo: "score-blue",
  professionalSummary: "score-teal",
  education: "score-gold",
  skills: "score-violet",
  experience: "score-green",
  projects: "score-rose"
};

const scoreLabels = {
  contactInfo: "Contact Information",
  professionalSummary: "Professional Summary",
  education: "Education",
  skills: "Skills",
  experience: "Experience / Internship",
  projects: "Projects"
};

const ResumeAnalysisPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    resumeApi.getLatest(token).then(setAnalysis).catch(() => setAnalysis(null));
  }, [token]);

  if (!analysis) {
    return (
      <section className="panel">
        <h2>Resume Analysis</h2>
        <p>No analyzed resume found yet.</p>
        <Link className="button-link button-primary" to="/resume-upload">
          Go to Resume Upload
        </Link>
      </section>
    );
  }

  return (
    <section className="analysis-result-shell">
      <div className="analysis-header-card">
        <span className="eyebrow">Analysis Result</span>
        <h2>Your resume has been analyzed</h2>
        <p>View your overall ATS score and continue to the career suggestions page.</p>
      </div>

      <div className="resume-scoreboard-grid">
        <div className="resume-overall-card">
          <span className="eyebrow">Overall ATS Score</span>
          <div className="resume-score-ring">
            <div className="resume-score-ring-inner">
              <strong>{analysis.atsScore}</strong>
              <span>/100</span>
            </div>
          </div>
          <p>Your uploaded resume has been evaluated and scored out of 100.</p>
        </div>

        <div className="analysis-action-card">
          <span className="eyebrow">Next Step</span>
          <h3>Continue to career suggestions</h3>
          <div className="analysis-action-buttons">
            <button type="button" onClick={() => navigate("/career-suggestions", { state: { isFromProfile: false } })}>
              View Career Suggestions
            </button>
          </div>
        </div>
      </div>

      <div className="resume-section-scores">
        {Object.entries(analysis.sectionScores || {}).map(([key, value]) => (
          <article key={key} className={`section-score-card ${scoreColors[key] || "score-blue"}`}>
            <div className="section-score-head">
              <h4>{scoreLabels[key] || key}</h4>
              <span>{value}/20</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((value / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ResumeAnalysisPage;
