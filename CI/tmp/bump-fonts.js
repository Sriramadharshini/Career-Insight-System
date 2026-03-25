const fs = require("fs");
const path = require("path");

const targetFile = "d:/Dharshu/CI project/CI/frontend/src/pages/ResumeViewPage.jsx";
let content = fs.readFileSync(targetFile, "utf-8");

// Bump logic specifically inside the template components rendering
content = content.replace(/fontSize:\s*"(11px|12px|13px|14px|15px|24px)"/g, (match, size) => {
    switch (size) {
        case "11px": return 'fontSize: "13px"';
        case "12px": return 'fontSize: "14px"';
        case "13px": return 'fontSize: "16px"';
        case "14px": return 'fontSize: "18px"'; // Subtitle/Roles
        case "15px": return 'fontSize: "18px"'; // Section headers
        case "24px": return 'fontSize: "32px"'; // Names
        default: return match;
    }
});

// Also bump TagList font size from 0.75rem to 0.85rem
content = content.replace(/fontSize:\s*"0\.75rem"/g, 'fontSize: "0.85rem"');

fs.writeFileSync(targetFile, content);
console.log("Font sizes bumped perfectly in ResumeViewPage.");
