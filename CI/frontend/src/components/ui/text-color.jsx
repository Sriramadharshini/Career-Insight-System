import React from "react";
import { Plus } from "lucide-react";

export function TextColor() {
  return (
    <div className="text-color-root">
      {/* Corner accent markers */}
      <Plus className="tc-plus tc-plus--tl" />
      <Plus className="tc-plus tc-plus--tr" />
      <Plus className="tc-plus tc-plus--bl" />
      <Plus className="tc-plus tc-plus--br" />

      <h1 className="tc-heading">
        {/* Word 1 — "Develop." */}
        <span
          data-content="Develop."
          className="tc-word tc-bg-1"
        >
          <span className="tc-fg tc-fg-1">Develop.</span>
        </span>

        {/* Word 2 — "Your Career." */}
        <span
          data-content="Your Career."
          className="tc-word tc-bg-2"
        >
          <span className="tc-fg tc-fg-2">Your Career.</span>
        </span>

        {/* Word 3 — "Potential with AI." */}
        <span
          data-content="Potential with AI."
          className="tc-word tc-bg-3"
        >
          <span className="tc-fg tc-fg-3">Potential with AI.</span>
        </span>
      </h1>
    </div>
  );
}
