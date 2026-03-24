import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { healthApi } from "../api";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [connectionMessage, setConnectionMessage] = useState("");

  useEffect(() => {
    healthApi
      .check()
      .then(() => setConnectionMessage(""))
      .catch(() =>
        setConnectionMessage(
          "Backend API is not connected. Start the backend server and verify it is running on http://localhost:5001."
        )
      );
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-panel auth-panel-info">
        <span className="eyebrow">Login Portal</span>
        <h2>Welcome back to Career Insight System</h2>
        <p>
          Sign in to continue your resume analysis, profile management, and career guidance flow.
        </p>
        <div className="auth-feature-list">
          <div className="auth-feature-item">
            <span className="auth-icon">📊</span>
            <div>
              <strong>Resume insights</strong>
              <p>Track resume strength, missing gaps, and ATS readiness.</p>
            </div>
          </div>
          <div className="auth-feature-item">
            <span className="auth-icon">🎯</span>
            <div>
              <strong>Career guidance</strong>
              <p>Review role suggestions and plan the next step in your career path.</p>
            </div>
          </div>
          <div className="auth-feature-item">
            <span className="auth-icon">🧠</span>
            <div>
              <strong>AI support</strong>
              <p>Use intelligent analysis to improve your profile and resume content.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-card auth-card-wide auth-form-card">
        <span className="eyebrow">Secure Access</span>
        <h2>Login to your account</h2>
        <p className="auth-subtext">Enter your credentials to access your personalized dashboard.</p>
        {connectionMessage && <p className="warning-text">{connectionMessage}</p>}
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field-group">
            <span className="field-label">📧 Email address</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />
          </label>
          <label className="field-group">
            <span className="field-label">🔒 Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="auth-footer-text">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
