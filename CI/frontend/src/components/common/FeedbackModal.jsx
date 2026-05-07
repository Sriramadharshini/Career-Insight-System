import React, { useState } from "react";
import { feedbackApi } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { MessageSquarePlus, Star, X, Send } from "lucide-react";

const FeedbackModal = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setMessage("");
    setRating(0);
    setHoveredStar(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }
    setSubmitting(true);
    try {
      await feedbackApi.submit(token, { message, rating: rating || 3 });
      toast.success("Thank you for your feedback!");
      reset();
      setIsOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Send Feedback"
        style={{
          position: "fixed", bottom: "5rem", right: "2rem", zIndex: 900,
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff", border: "none", borderRadius: "50px",
          padding: "0.85rem 1.5rem", fontSize: "0.9rem", fontWeight: 700,
          cursor: "pointer", boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(99,102,241,0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(99,102,241,0.4)";
        }}
      >
        <MessageSquarePlus size={18} />
        Feedback
      </button>

      {/* Feedback Panel — anchored bottom-right, above the button */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: "rgba(0,0,0,0.35)",
              animation: "fadeInOverlay 0.2s ease"
            }}
          />
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{
              position: "fixed", bottom: "9rem", right: "2rem", zIndex: 1000,
              background: "linear-gradient(160deg, #111116 0%, #0c0c10 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px", width: "400px", maxWidth: "calc(100vw - 2rem)",
              padding: "2rem", boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              animation: "slideUpModal 0.3s ease"
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#fafafa", letterSpacing: "-0.02em" }}>
                  Share Your Feedback
                </h2>
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#a1a1aa" }}>
                  Help us improve your experience
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "0.4rem", cursor: "pointer", color: "#a1a1aa",
                  transition: "all 0.2s ease", display: "flex"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Star Rating */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a1a1aa", marginBottom: "0.5rem" }}>
                Rating (optional)
              </label>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    style={{
                      background: "none", border: "none", cursor: "pointer", padding: "0.2rem",
                      transition: "transform 0.15s ease",
                      transform: (hoveredStar >= star || rating >= star) ? "scale(1.2)" : "scale(1)"
                    }}
                  >
                    <Star
                      size={24}
                      fill={(hoveredStar >= star || rating >= star) ? "#fbbf24" : "none"}
                      stroke={(hoveredStar >= star || rating >= star) ? "#fbbf24" : "#52525b"}
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a1a1aa", marginBottom: "0.5rem" }}>
                Your Message <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think, report a bug, or suggest a feature..."
                rows={4}
                style={{
                  width: "100%", resize: "vertical",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "0.85rem",
                  color: "#fafafa", fontSize: "0.9rem", lineHeight: 1.6,
                  fontFamily: "inherit", transition: "border-color 0.2s ease",
                  outline: "none", boxSizing: "border-box"
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => { reset(); setIsOpen(false); }}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "0.6rem 1rem",
                  color: "#a1a1aa", fontSize: "0.85rem", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  background: submitting ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none", borderRadius: "10px", padding: "0.6rem 1.25rem",
                  color: "#fff", fontSize: "0.85rem", fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 15px rgba(99,102,241,0.35)",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(99,102,241,0.35)";
                }}
              >
                <Send size={14} />
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </>
      )}

      {/* Keyframe Animations */}
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default FeedbackModal;
