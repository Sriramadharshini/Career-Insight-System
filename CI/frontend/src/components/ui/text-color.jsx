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
        {/* Main phrase — single consistent professional colour */}
        <span className="tc-main-phrase">
          Develop your career potential
        </span>

        {/* Highlight — contrasting colour for "with AI" */}
        <span className="tc-ai-phrase">
          with <span className="tc-ai-word">AI</span>
        </span>
      </h1>
    </div>
  );
}
