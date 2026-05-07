import React from "react";

/**
 * SkewCards — gradient card showcase with skew + blob animations.
 * Vivid colours, solid dark card background for maximum text legibility.
 */

export default function SkewCards({ cards }) {
  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "2rem 1rem",
      }}>
        {cards.map(({ title, desc, gradientFrom, gradientTo, icon, actionLabel, onClick }, idx) => (
          <div
            key={idx}
            className="skew-card-group"
            style={{
              position: "relative",
              width: "340px",
              height: "430px",
              margin: "40px 30px",
              cursor: onClick ? "pointer" : "default",
            }}
            onClick={onClick}
          >
            {/* Skewed solid gradient panel */}
            <span
              className="skew-panel skew-panel--solid"
              style={{ background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})` }}
            />
            {/* Skewed blurred glow — lower opacity so it glows, not blinds */}
            <span
              className="skew-panel skew-panel--blur"
              style={{ background: `linear-gradient(315deg, ${gradientFrom}99, ${gradientTo}99)` }}
            />

            {/* Blob decorations */}
            <span style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: 10 }}>
              <span className="skew-blob skew-blob--tl" />
              <span className="skew-blob skew-blob--br" />
            </span>

            {/* Content card — solid dark background, no blur on text */}
            <div
              className="skew-content"
              style={{ "--grad-from": gradientFrom, "--grad-to": gradientTo }}
            >
              {icon && (
                <div style={{ marginBottom: "1.25rem" }}>
                  {icon}
                </div>
              )}
              <h2 style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                marginBottom: "0.85rem",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}>
                {title}
              </h2>
              <p style={{
                fontSize: "0.97rem",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                color: "#cbd5e1",   /* light slate — not grey, not washed */
              }}>
                {desc}
              </p>
              {actionLabel && (
                <span className="skew-action-btn" style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                }}>
                  {actionLabel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* ── Skewed gradient panels ─────────────────────────────── */
        .skew-panel {
          position: absolute;
          top: 0;
          left: 50px;
          width: 50%;
          height: 100%;
          border-radius: 14px;
          transform: skewX(15deg);
          transition: all 0.5s ease;
        }
        .skew-panel--blur {
          filter: blur(28px);
          opacity: 0.65;
        }
        .skew-card-group:hover .skew-panel {
          transform: skewX(0deg);
          left: 20px;
          width: calc(100% - 90px);
        }

        /* ── Blob decorations ──────────────────────────────────── */
        .skew-blob {
          position: absolute;
          width: 0;
          height: 0;
          border-radius: 14px;
          opacity: 0;
          background: rgba(255,255,255,0.15);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          transition: all 0.5s ease;
          animation: skew-blob-anim 2s ease-in-out infinite;
        }
        .skew-blob--tl { top: 0; left: 0; }
        .skew-blob--br { bottom: 0; right: 0; animation-delay: -1s; }

        .skew-card-group:hover .skew-blob--tl {
          top: -50px; left: 50px;
          width: 90px; height: 90px;
          opacity: 1;
        }
        .skew-card-group:hover .skew-blob--br {
          bottom: -50px; right: 50px;
          width: 90px; height: 90px;
          opacity: 1;
        }

        @keyframes skew-blob-anim {
          0%, 100% { transform: translateY(10px); }
          50%       { transform: translateX(-10px); }
        }

        /* ── Content card — solid, no text blur ─────────────────── */
        .skew-content {
          position: relative;
          z-index: 20;
          left: 0;
          padding: 32px 34px;
          height: 100%;
          /* Solid dark background — text always crisp */
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.45);
          transition: all 0.5s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
        }
        .skew-card-group:hover .skew-content {
          left: -25px;
          padding: 42px 34px;
          background: #0f1f3d;
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
        }

        /* ── Action button — gradient branded ─────────────────────── */
        .skew-action-btn {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          white-space: nowrap;
          padding: 0.9rem 1.8rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.01em;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
          margin-top: auto;
        }
        .skew-card-group:hover .skew-action-btn {
          filter: brightness(1.2);
          box-shadow: 0 8px 25px rgba(0,0,0,0.45);
          transform: translateY(-2px) translateX(4px);
        }
      `}</style>
    </>
  );
}

