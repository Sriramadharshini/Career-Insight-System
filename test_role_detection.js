import { analyzeResume } from './CI/backend/src/utils/atsScorer.js';

const cases = [
  {
    name: "Backend Resume",
    text: "Backend Developer with 5 years experience in Node.js, Express, MongoDB, SQL, Python, and Java. Strong in API design and microservices."
  },
  {
    name: "Frontend Resume",
    text: "Frontend Developer expert in React, Javascript, HTML, CSS, UI, and Typescript. Experienced in building responsive web apps."
  },
  {
    name: "Fullstack Resume",
    text: "Full Stack Developer proficient in React, Node.js, MongoDB, Express, API, HTML, CSS, and SQL. Handled end-to-end development."
  }
];

cases.forEach(c => {
  console.log(`\n--- ${c.name} ---`);
  const res = analyzeResume(c.text);
  console.log("Career Track:", res.careerTrack);
  console.log("Recommended Roles:", res.recommendedRoles.join(", "));
  console.log("Interview Questions (first 2):", res.interviewQuestions.slice(0, 2).join(" | "));
  console.log("Total Questions:", res.interviewQuestions.length);
});
