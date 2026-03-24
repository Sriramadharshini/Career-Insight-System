import { analyzeResume } from "./backend/src/utils/atsScorer.js";

const testResumes = [
  {
    name: "Frontend Specialist",
    text: "React, Javascript, HTML, CSS, Tailwind, Figma, User Research. Graduated in 2024.",
    expectedTrack: "frontend"
  },
  {
    name: "Backend Specialist",
    text: "Node.js, Express, MongoDB, SQL, Python, Java. Graduated in 2023.",
    expectedTrack: "backend"
  },
  {
    name: "Mobile Specialist",
    text: "React Native, Flutter, iOS, Android, Swift, Kotlin. Graduated in 2025.",
    expectedTrack: "mobile"
  },
  {
    name: "Design Specialist",
    text: "Figma, Adobe XD, UI, UX, Design, Prototyping. Graduated in 2026.",
    expectedTrack: "design"
  },
  {
    name: "Security Specialist",
    text: "Cybersecurity, Security, Encryption, Firewall, Penetration Testing. Graduated in 2022.",
    expectedTrack: "security"
  }
];

testResumes.forEach(test => {
  const result = analyzeResume(test.text);
  console.log(`--- Test: ${test.name} ---`);
  console.log(`Detected Track: ${result.careerTrack}`);
  console.log(`Gap Message: ${result.gapMessage}`);
  console.log(`Years Since Education: ${result.yearsSinceEducation}`);
  console.log(`Resources: ${result.suggestedResources.websites[0].name}...`);
  console.log('-------------------------\n');
});
