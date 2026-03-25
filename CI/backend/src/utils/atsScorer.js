const ATS_KEYWORDS = [
  "javascript", "react", "node", "mongodb", "express", "python", "sql", "api", "git",
  "communication", "problem solving", "teamwork", "html", "css", "docker", "aws", "typescript",
  "java", "c++", "machine learning", "tensorflow", "kubernetes", "mysql", "postgresql",
  "rest api", "graphql", "redux", "angular", "vue", "bootstrap", "tailwind", "figma",
  "agile", "scrum", "jira", "linux", "bash", "ci/cd", "testing", "selenium", "jest",
  "figma", "adobe xd", "sketch", "ui", "ux", "wireframing", "prototyping", "user research",
  "security", "cybersecurity", "penetration testing", "firewall", "encryption", "ethical hacking",
  "swift", "kotlin", "react native", "flutter", "ios", "android", "mobile",
  "selenium", "cypress", "automation", "quality assurance", "qa", "manual testing"
];

import * as ExpandedData from "./expandedData.js";
const ROLE_RULES = ExpandedData.ROLE_RULES;
const TRACK_RESOURCES = ExpandedData.TRACK_RESOURCES;

const SKILL_PROGRESSION = {
  "javascript": ["TypeScript", "Advanced Design Patterns", "Testing with Jest"],
  "react": ["Next.js", "State Management (Redux/Zustand)", "Performance Optimization"],
  "node": ["Microservices", "System Design", "Advanced Security (OAuth/OpenID)"],
  "python": ["Django/Flask", "Data Analysis (Pandas/NumPy)", "Machine Learning"],
  "java": ["Spring Boot", "Microservices Architecture", "Hibernate/JPA"],
  "sql": ["Database Optimization", "Data Warehousing", "NoSQL (MongoDB/Redis)"],
  "html": ["UI/UX Design Principles", "Advanced CSS/Tailwind", "Web Accessibility"],
  "css": ["Sass/SCSS", "Animation Libraries (Framer Motion)", "Responsive Design Systems"],
  "docker": ["Kubernetes", "CI/CD Pipeline Design", "Infrastructure as Code (Terraform)"],
  "machine learning": ["Deep Learning", "Natural Language Processing", "MLOps"],
};

// Helper: produce a realistic score with slight natural variation
const realisticScore = (base, minVal, maxVal) => {
  const jitter = Math.floor(Math.random() * 5) - 2; // -2 to +2
  return Math.min(maxVal, Math.max(minVal, base + jitter));
};

export const analyzeResume = (resumeText = "", targetRole = "") => {
  const text = resumeText.toLowerCase().replace(/[^\w\s#+]/g, " "); // Clean text but keep # and + (C#, C++)
  const words = text.split(/\s+/);
  
  // Refined keyword detection using word boundaries logic
  const matchedKeywords = ATS_KEYWORDS.filter(kw => {
    if (kw.length < 3) return words.includes(kw); // Direct match for short words like 'r'
    return text.includes(kw);
  });
  
  const extractedSkills = [...new Set(matchedKeywords)];
  const feedback = [];
  const missingGaps = [];

  // ── Section scoring (realistic, tougher to get 90+) ─────────────────────────
  const hasSummary   = /summary|objective|profile|about me/i.test(text);
  const hasSkills    = /skills|technologies|stack|tools|expertise/i.test(text);
  const hasExp       = /experience|work history|employment|intern/i.test(text);
  const hasEdu       = /education|academic|university|degree|college/i.test(text);
  const hasCerts     = /certification|certificate|award|course/i.test(text);
  const hasAchieve   = /achievement|accomplishment|honor|recognition/i.test(text);
  const hasProjects  = /project|portfolio|github|labs/i.test(text);
  const isDetailed   = text.length > 1000;
  const isVeryDetailed = text.length > 2000;

  // Keyword density bonus (max +3)
  const kwBonus = Math.min(3, Math.floor(matchedKeywords.length / 5));

  const sectionScores = {
    professionalSummary: hasSummary
      ? realisticScore(10 + kwBonus, 7, 13)
      : realisticScore(3, 1, 5),

    skills: hasSkills
      ? realisticScore(12 + Math.min(4, matchedKeywords.length / 2), 8, 17)
      : realisticScore(3, 1, 6),

    experience: hasExp
      ? (isVeryDetailed ? realisticScore(22, 19, 25) : realisticScore(17, 13, 22))
      : realisticScore(5, 2, 8),

    education: hasEdu
      ? realisticScore(10, 7, 12)
      : realisticScore(2, 0, 4),

    certifications: hasCerts
      ? realisticScore(8, 5, 11)
      : realisticScore(1, 0, 3),

    achievements: hasAchieve
      ? realisticScore(6, 4, 8)
      : realisticScore(1, 0, 2),
  };

  // Base ATS score from sections
  let score = Object.values(sectionScores).reduce((t, v) => t + v, 0);

  // Content depth bonus
  if (isVeryDetailed) score += 3;
  else if (isDetailed) score += 1;

  // Projects bonus
  if (hasProjects) score += 2;

  // Keyword density bonus
  score += kwBonus;

  // Realistic cap: Very high quality resumes with everything hit ~75-82
  // Rare "perfect" outliers can hit 85
  const baseMax = hasExp && hasSummary && hasSkills && hasEdu && hasCerts && hasAchieve && hasProjects ? 85 : 78;
  score = Math.min(score, baseMax);

  // Natural scaling for decent resumes
  if (text.length > 500 && score < 45) score += 10;
  if (text.length > 1000 && score < 60) score += 5;

  // Final rounding to integers
  score = Math.round(score);

  // ── Feedback generation ──────────────────────────────────────────────────────
  if (!hasAchieve) {
    feedback.push("Add an Achievements or Awards section — it signals measurable impact to employers.");
    missingGaps.push("Achievements / Awards section is missing");
  }
  if (!isDetailed) {
    feedback.push("Expand your project and experience descriptions with metrics, outcomes and tools used.");
    missingGaps.push("Resume lacks detailed content — add quantified achievements");
  }
  if (!hasProjects) {
    feedback.push("Add a Projects section with GitHub links or live demos to show practical skills.");
    missingGaps.push("Projects section is missing or unclear");
  }
  if (!hasExp) {
    feedback.push("Include internships, freelance work, or hands-on experience if available.");
    missingGaps.push("Work experience / internship section is missing");
  }
  if (!hasEdu) {
    feedback.push("Add an Education section (degree, college, year) for ATS completeness.");
    missingGaps.push("Education section is missing");
  }
  if (!hasSkills) {
    feedback.push("Add a dedicated Skills section listing technical tools, languages, and frameworks.");
    missingGaps.push("Skills section is missing");
  }
  if (!hasSummary) {
    feedback.push("Write a 2–3 line Professional Summary at the top of your resume to immediately grab attention.");
    missingGaps.push("Professional summary is missing");
  }
  if (matchedKeywords.length < 4) {
    feedback.push("Include more industry-relevant keywords (React, Node, SQL, Docker, etc.) to improve ATS visibility.");
    missingGaps.push("Low keyword density — add more relevant tech terms");
  }

  // ── Certifications (Still detecting for scoring, but UI will hide them in Skills tab) ──
  let certifications = [];
  if (hasCerts) {
    if (text.includes("aws")) certifications.push("AWS Certification (Detected)");
    else if (text.includes("google")) certifications.push("Google Certification (Detected)");
    else certifications.push("Industry Certification (Detected)");
  }

  // ── Gap Analysis: Education Year & Career Gaps ───────────────────────────────
  const CURRENT_YEAR = 2026;
  let yearsSinceEducation = 0;
  let graduationYear = null;

  const yearMatches = text.match(/\b(20\d{2})\b/g);
  if (yearMatches && yearMatches.length > 0) {
    const years = yearMatches.map(y => parseInt(y)).filter(y => y <= CURRENT_YEAR);
    if (years.length > 0) {
      graduationYear = Math.max(...years);
      yearsSinceEducation = CURRENT_YEAR - graduationYear;
    }
  }

  let gapMessage = "Excellent! Your career timeline shows consistent progression with no education gaps.";
  const timelineGaps = [];

  if (graduationYear && yearsSinceEducation > 0) {
    gapMessage = `A career gap of ${yearsSinceEducation} year${yearsSinceEducation > 1 ? "s" : ""} was detected since your graduation in ${graduationYear}. Consider addressing this in your resume summary.`;
    timelineGaps.push(`Gap detected: ${yearsSinceEducation} year${yearsSinceEducation > 1 ? "s" : ""} since graduation (${graduationYear}).`);
  }

  // ── Skill readiness (realistic 0–100) ───────────────────────────────────────
  const skillReadinessIndex = Math.min(95, Math.max(20, (matchedKeywords.length * 8) + 15));

  // ── Role-specific gap analysis ──────────────────────────────────────────────
  const gapAnalysis = [];
  const learningPathways = [];
  
  if (targetRole) {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes("frontend") || roleLower.includes("react")) {
      if (!text.includes("react") && !text.includes("vue") && !text.includes("angular"))
        gapAnalysis.push("Missing a frontend framework (React / Vue / Angular) — critical for Frontend roles.");
      if (!text.includes("typescript"))
        gapAnalysis.push("TypeScript knowledge is preferred by most Frontend employers in 2025+.");
      if (!text.includes("css") && !text.includes("tailwind"))
        gapAnalysis.push("CSS / Tailwind skills not detected — add styling expertise.");
      learningPathways.push("Advanced React Patterns & Performance Optimization");
      if (!text.includes("typescript")) learningPathways.push("TypeScript for Large-Scale Applications");
    } else if (roleLower.includes("backend") || roleLower.includes("node")) {
      if (!text.includes("node") && !text.includes("python") && !text.includes("java"))
        gapAnalysis.push("Missing a backend language (Node.js / Python / Java) — critical for Backend roles.");
      if (!text.includes("sql") && !text.includes("mongo"))
        gapAnalysis.push("Database skills (SQL or NoSQL) are essential — none detected.");
      if (!text.includes("docker") && !text.includes("aws"))
        gapAnalysis.push("Cloud or containerization skills (Docker / AWS) would significantly strengthen the profile.");
      learningPathways.push("RESTful API Design & Security Best Practices");
      if (!text.includes("docker")) learningPathways.push("Containerization with Docker & Docker Compose");
    } else if (roleLower.includes("data") || roleLower.includes("analyst")) {
      if (!text.includes("sql"))
        gapAnalysis.push("SQL is a must-have for Data Analyst roles — not detected in resume.");
      if (!text.includes("python") && !text.includes("r "))
        gapAnalysis.push("Python or R is expected for data analysis and automation tasks.");
      if (!text.includes("power bi") && !text.includes("tableau"))
        gapAnalysis.push("Add a visualization tool (Power BI or Tableau) to strengthen the data profile.");
      learningPathways.push("Advanced SQL & Window Functions");
      learningPathways.push("Python Pandas & Matplotlib for Data Analysis");
    } else if (roleLower.includes("devops") || roleLower.includes("cloud")) {
      if (!text.includes("docker"))
        gapAnalysis.push("Docker knowledge is foundational for DevOps — not detected.");
      if (!text.includes("kubernetes") && !text.includes("k8s"))
        gapAnalysis.push("Kubernetes orchestration skills are highly preferred for senior DevOps roles.");
      if (!text.includes("aws") && !text.includes("azure") && !text.includes("gcp"))
        gapAnalysis.push("No cloud platform detected (AWS / Azure / GCP) — critical for Cloud roles.");
      learningPathways.push("Kubernetes Administration & Helm Charts");
      learningPathways.push("CI/CD Pipeline Design with GitHub Actions / Jenkins");
    } else if (roleLower.includes("ai") || roleLower.includes("ml") || roleLower.includes("machine")) {
      if (!text.includes("python"))
        gapAnalysis.push("Python is the primary language for AI/ML roles — not detected.");
      if (!text.includes("tensorflow") && !text.includes("pytorch") && !text.includes("sklearn"))
        gapAnalysis.push("ML libraries (TensorFlow / PyTorch / scikit-learn) not found — add them.");
      learningPathways.push("Deep Learning with PyTorch or TensorFlow");
      learningPathways.push("LLM Fine-tuning & Prompt Engineering");
    } else if (roleLower.includes("design") || roleLower.includes("ui") || roleLower.includes("ux")) {
      if (!text.includes("figma")) gapAnalysis.push("Figma mastery is essential for modern UI/UX roles.");
      learningPathways.push("User Psychology & Interaction Design");
      learningPathways.push("Advanced Prototyping in Figma");
    } else if (roleLower.includes("security") || roleLower.includes("cyber")) {
      if (!text.includes("security")) gapAnalysis.push("Foundational security certifications or experience not detected.");
      learningPathways.push("Ethical Hacking & Penetration Testing");
      learningPathways.push("Network Security & Cloud Hardening");
    } else {
      if (!text.includes("docker") && !text.includes("aws"))
        gapAnalysis.push(`Cloud/DevOps skills (Docker, AWS) are valuable additions for ${targetRole} roles.`);
      learningPathways.push(`Advanced concepts in ${targetRole} domain`);
      learningPathways.push("System Design & Scalability Principles");
    }
  } else {
    // Generic gaps
    if (!text.includes("cloud") && !text.includes("aws"))
      gapAnalysis.push("Cloud skills (AWS / Azure / GCP) are increasingly expected in all developer roles.");
    if (!text.includes("docker"))
      gapAnalysis.push("Docker knowledge improves deployability and is widely required in modern teams.");
    if (!text.includes("typescript"))
      gapAnalysis.push("TypeScript adoption is rising rapidly — consider adding it to your skill set.");
    if (!text.includes("python"))
      learningPathways.push("Python — for scripting, automation and AI integrations");
    if (!text.includes("react"))
      learningPathways.push("Modern Frontend with React and TypeScript");
    if (!text.includes("docker"))
      learningPathways.push("Docker & Container fundamentals for DevOps readiness");
    learningPathways.push("System Design Interview Preparation");
  }

  // ── Recommended roles ────────────────────────────────────────────────────────
  const roleRulesScored = ROLE_RULES.map(rule => ({
    role: rule.role,
    matches: rule.keywords.filter(kw => text.includes(kw)).length
  }));

  if (targetRole) {
    roleRulesScored.push({ role: targetRole, matches: Math.max(2, matchedKeywords.length) });
  }

  const recommendedRoles = roleRulesScored
    .filter(item => item.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 4)
    .map(item => item.role);

  // Dynamic Fallback based on text heuristics
  if (!recommendedRoles.length) {
    if (text.includes("design") || text.includes("creative") || text.includes("art")) {
      recommendedRoles.push("UI/UX Designer", "Product Designer");
    } else if (text.includes("manage") || text.includes("lead") || text.includes("agile")) {
      recommendedRoles.push("Project Manager", "Scrum Master");
    } else if (text.includes("data") || text.includes("analy") || text.includes("excel")) {
      recommendedRoles.push("Data Analyst", "Business Analyst");
    } else if (text.includes("market") || text.includes("seo") || text.includes("content")) {
      recommendedRoles.push("Digital Marketer", "Content Strategist");
    } else {
      recommendedRoles.push("Software Engineer", "IT Specialist");
    }
  }

  // ── Interview questions (Expanded to at least 12 for each) ─────────────────
  const questionBank = {
    "Frontend Developer": [
      "How do you optimize React component performance in a large application?",
      "Explain the difference between controlled and uncontrolled components in React.",
      "What is the Virtual DOM and how does React use it for efficient updates?",
      "How do you handle state management in complex React apps (Context, Redux, Zustand)?",
      "What is the difference between UseMemo and UseCallback? Provide use cases.",
      "How do you implement code-splitting in a React application?",
      "Explain CSS-in-JS vs traditional CSS modules in modern frontend development.",
      "How would you handle cross-browser compatibility issues for a complex UI?",
      "What are Web Workers and how can they improve frontend performance?",
      "Explain the concept of 'Higher Order Components' (HOC) and their alternatives.",
      "How do you approach accessibility (ARIA labels, keyboard navigation) in web apps?",
      "What is the difference between SSR, CSR, and SSG in the context of Next.js?"
    ],
    "Backend Developer": [
      "How would you design a secure REST API for user authentication using JWT?",
      "Explain the difference between SQL and NoSQL — when would you choose each?",
      "How do you handle database indexing and query optimization in production?",
      "What are the key principles of microservices architecture?",
      "How do you handle race conditions in a distributed backend system?",
      "Explain the difference between horizontal and vertical scaling for servers.",
      "What is Redis and how do you use it for caching and session management?",
      "How do you implement rate limiting for a public-facing API?",
      "Explain the concept of 'Eventual Consistency' in distributed databases.",
      "How do you handle error logging and monitoring in a Node.js/Express production app?",
      "What is the difference between SOAP and REST architectures?",
      "How do you secure your backend against common attacks like SQL injection and XSS?"
    ],
    "Full Stack Developer": [
      "How do frontend and backend services communicate in a full-stack application?",
      "How would you structure a MERN app for maintainability and scalability?",
      "Explain how you would implement JWT-based authentication end-to-end.",
      "How do you approach API versioning and backward compatibility?",
      "What is CORS and how do you handle it in a production environment?",
      "How do you ensure data synchronization between the UI and the Backend database?",
      "Explain the benefits of using TypeScript across both Frontend and Backend.",
      "How would you implement a real-time notification system using WebSockets?",
      "What is Docker and how does it simplify the deployment of full-stack apps?",
      "How do you approach unit and integration testing across the entire stack?",
      "Explain the 'BFF' (Backend for Frontend) pattern and its advantages.",
      "How do you optimize the end-to-end performance of a web application?"
    ],
    "Data Analyst": [
      "How do you clean and prepare raw data before analysis?",
      "Explain the difference between descriptive, diagnostic, and predictive analytics.",
      "Walk me through a time you used SQL to solve a business problem.",
      "How would you create a dashboard to track KPIs for a business stakeholder?",
      "What is the difference between JOIN and UNION in SQL?",
      "Explain the concept of 'p-value' in statistical significance tests.",
      "How do you handle missing or duplicate data in a large dataset using Python/Pandas?",
      "What is the difference between a Dimension and a Measure in data modeling?",
      "How would you present complex data findings to a non-technical audience?",
      "What visualization chart would you use to show correlations between two variables?",
      "Explain the difference between Correlation and Causation in data analysis.",
      "How do you ensure data privacy and security when handling sensitive datasets?"
    ],
    "QA Engineer": [
      "What is the difference between manual testing and automated testing?",
      "How do you decide which test cases to automate vs. test manually?",
      "Describe your approach to building a regression test suite from scratch.",
      "How do you handle flaky tests in a CI/CD pipeline?",
      "What is the Pyramid of Testing and why is it important?",
      "Explain the difference between Black Box, White Box, and Grey Box testing.",
      "How do you write effective bug reports that help developers fix issues quickly?",
      "What is 'TDD' (Test Driven Development) and what are its pros and cons?",
      "How do you use Selenium or Cypress to test dynamic web components?",
      "Explain the importance of 'Load Testing' and 'Stress Testing' for a system.",
      "How do you handle environment-specific configurations in automation scripts?",
      "What are the key elements of a comprehensive Test Plan for a new feature?"
    ],
    "AI/ML Engineer": [
      "How do you evaluate the performance of a classification machine learning model?",
      "What is overfitting and how can you reduce it (regularization, dropout, etc.)?",
      "Explain the difference between supervised, unsupervised, and reinforcement learning.",
      "How would you approach fine-tuning an LLM for a domain-specific task?",
      "What is the difference between Gradient Descent and Stochastic Gradient Descent?",
      "Explain the concept and architecture of a 'Transformer' model.",
      "How do you handle imbalanced datasets in training a machine learning model?",
      "What are 'Embeddings' and how are they used in NLP tasks?",
      "Explain the difference between a CNN and an RNN — when do you use each?",
      "What is 'Transfer Learning' and why is it useful in deep learning?",
      "How do you deploy and monitor a machine learning model in production?",
      "Explain the concept of 'Feature Engineering' and its impact on model performance."
    ],
    "DevOps Engineer": [
      "How would you design a CI/CD pipeline for a microservices application?",
      "Explain the difference between Docker containers and virtual machines.",
      "How do you handle secrets management in a Kubernetes cluster?",
      "What monitoring tools and metrics would you set up for a production system?",
      "What is 'Infrastructure as Code' (IaC) and how do tools like Terraform work?",
      "How do you ensure zero-downtime deployments for a high-traffic app?",
      "Explain the concept of 'Blue-Green' deployment vs 'Canary' deployment.",
      "What is GitOps and how does it change the traditional DevOps workflow?",
      "How do you scale a Kubernetes cluster based on traffic patterns?",
      "Explain the importance of logging and log aggregation (ELK/Graylog).",
      "How do you secure a CI/CD pipeline from malicious injections?",
      "What is 'Site Reliability Engineering' (SRE) and how does it relate to DevOps?"
    ],
    "Cloud Engineer": [
      "How do you architect a highly available application on AWS?",
      "What is the difference between IaaS, PaaS, and SaaS? Give examples.",
      "How do you manage infrastructure as code using Terraform or CloudFormation?",
      "Explain auto-scaling groups and when you would use them.",
      "What is a 'Serverless' architecture and what are the benefits of AWS Lambda?",
      "How do you implement data encryption at rest and in transit in the cloud?",
      "Explain 'Identity and Access Management' (IAM) best practices.",
      "How do you optimize cloud costs for a growing startup?",
      "What is a 'VPC' (Virtual Private Cloud) and why is it important for security?",
      "Explain the difference between Multi-region and Multi-AZ strategies.",
      "How do you migrate a legacy on-premise database to the cloud?",
      "What are the benefits of using a Managed Service (like RDS) over self-hosting?"
    ],
    "Mobile Developer": [
      "What are the main differences between React Native and native development?",
      "How do you handle offline data storage and synchronization in mobile apps?",
      "Explain the mobile app lifecycle (iOS or Android).",
      "How do you optimize mobile app performance and battery usage?",
      "What is 'Deep Linking' and how do you implement it in a mobile app?",
      "Explain the difference between Push Notifications and Local Notifications.",
      "How do you handle different screen sizes and orientations in mobile UI?",
      "What is 'Redux' or 'Provider' in the context of mobile state management?",
      "How do you secure sensitive user data on a mobile device?",
      "Explain the process of publishing an app to the App Store or Google Play Store.",
      "What are 'Universal Links' (iOS) and 'App Links' (Android)?",
      "How do you debug performance bottlenecks in a mobile application?"
    ],
    "UI/UX Designer": [
      "Walk me through your design process from research to high-fidelity prototype.",
      "How do you decide between different UI patterns for a specific user problem?",
      "How do you ensure your designs are accessible (WCAG standards)?",
      "What is your approach to gathering and implementing user feedback?",
      "Explain the importance of 'Design Systems' for large-scale products.",
      "What is 'User Journey Mapping' and how does it benefit the design process?",
      "How do you handle conflicting feedback from different stakeholders?",
      "Explain the difference between 'UI' (User Interface) and 'UX' (User Experience).",
      "What tools do you use for prototyping and why (Figma, Adobe XD, etc.)?",
      "How do you approach mobile-first design vs desktop-first design?",
      "What is 'A/B Testing' in the context of design validation?",
      "Explain the 'Gestalt Principles' and how they apply to UI design."
    ],
    "Cybersecurity Analyst": [
      "How would you respond to a suspected data breach in real-time?",
      "Explain the difference between Symmetric and Asymmetric encryption.",
      "What are the most common web application vulnerabilities (OWASP Top 10)?",
      "How do you perform a security audit on a cloud-based infrastructure?",
      "What is 'Zero Trust' architecture and why is it gaining popularity?",
      "Explain the difference between Port Scanning and Vulnerability Scanning.",
      "How do you implement Multi-Factor Authentication (MFA) securely?",
      "What is 'Phishing' and how can organizations protect their employees?",
      "Explain the concept of 'Social Engineering' in the context of security.",
      "How do you use a 'SIEM' (Security Information and Event Management) tool?",
      "What is 'Incident Response' and what are its key phases?",
      "How do you secure a corporate network against unauthorized Wi-Fi access?"
    ]
  };

  // ── Career Suggestion Enhancements ──────────────────────────────────────────
  const nextLevelSkills = [];
  extractedSkills.forEach(s => {
    if (SKILL_PROGRESSION[s]) {
      SKILL_PROGRESSION[s].forEach(ns => {
        if (!extractedSkills.includes(ns.toLowerCase()) && !nextLevelSkills.includes(ns)) {
          nextLevelSkills.push(ns);
        }
      });
    }
  });

  // Track Derivation (Enhanced to avoid Full Stack bias)
  let careerTrack = "fullstack";
  const trackScores = {
    frontend: (matchedKeywords.filter(k => ["react","html","css","javascript","typescript","vue","angular"].includes(k)).length),
    backend: (matchedKeywords.filter(k => ["node","express","mongodb","sql","python","java","api"].includes(k)).length),
    data: (matchedKeywords.filter(k => ["sql","python","analysis","power bi","tableau"].includes(k)).length),
    ai: (matchedKeywords.filter(k => ["machine learning","tensorflow","python","keras","sklearn"].includes(k)).length),
    cloud: (matchedKeywords.filter(k => ["docker","kubernetes","aws","cloud","terraform"].includes(k)).length),
    mobile: (matchedKeywords.filter(k => ["react native","flutter","ios","android","swift","kotlin"].includes(k)).length),
    design: (matchedKeywords.filter(k => ["figma","adobe xd","ui","ux","design"].includes(k)).length),
    security: (matchedKeywords.filter(k => ["security","cybersecurity","encryption","firewall"].includes(k)).length),
    qa: (matchedKeywords.filter(k => ["testing","selenium","cypress","qa","automation"].includes(k)).length)
  };

  const sortedTracks = Object.entries(trackScores).sort((a,b) => b[1] - a[1]);
  const [topTrackName, topTrackScore] = sortedTracks[0] || ["fullstack", 0];
  const secondTrack = sortedTracks[1];
  
  if (topTrackScore > 0) {
    careerTrack = topTrackName;
    
    // Only default to fullstack if frontend and backend are both very strong and well-balanced
    if ((topTrackName === "frontend" && secondTrack?.[0] === "backend") || 
        (topTrackName === "backend" && secondTrack?.[0] === "frontend")) {
      
      const front = trackScores.frontend;
      const back = trackScores.backend;
      
      // If one is clearly dominant (e.g., 8 vs 3), don't force fullstack
      // Require the trailing one to be at least 70% of the top one to be "Full Stack"
      if (Math.min(front, back) >= Math.max(front, back) * 0.7 && Math.max(front, back) >= 4) {
        careerTrack = "fullstack";
      }
    }
  }

  const suggestedResources = TRACK_RESOURCES[careerTrack] || TRACK_RESOURCES.fullstack;

  // Derive exactly 10 interview questions
  const primaryRole = recommendedRoles[0] || "Full Stack Developer";
  let pool = ExpandedData.questionBank[primaryRole] || ExpandedData.questionBank["Full Stack Developer"];
  
  // Shuffle and pick 10
  const interviewQuestions = pool
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  // ── Role Specific Insights ──────────────────────────────────────────────────
  const ROLE_TO_TRACK = ExpandedData.ROLE_TO_TRACK;

  const roleSpecificInsights = recommendedRoles.map(role => {
    const trackKey = ROLE_TO_TRACK[role] || "fullstack";
    const recommendedResources = TRACK_RESOURCES[trackKey] || TRACK_RESOURCES.fullstack;
    
    const roleRule = ROLE_RULES.find(r => r.role === role);
    let missingRoleSkills = [];
    if (roleRule) {
      missingRoleSkills = roleRule.keywords.filter(kw => !extractedSkills.includes(kw));
    }
    
    let extraSkills = [];
    extractedSkills.forEach(s => {
      if (SKILL_PROGRESSION[s]) {
        SKILL_PROGRESSION[s].forEach(ns => {
          if (!extractedSkills.includes(ns.toLowerCase()) && !extraSkills.includes(ns)) {
             extraSkills.push(ns);
          }
        });
      }
    });

    const roleSkillsToLearn = [...new Set([...missingRoleSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)), ...extraSkills])].slice(0, 8);

    const rolePool = ExpandedData.questionBank[role] || ExpandedData.questionBank["Full Stack Developer"];
    const roleQuestions = [...rolePool].sort(() => 0.5 - Math.random()).slice(0, 10);

    return {
      role,
      trackKey,
      nextLevelSkills: roleSkillsToLearn.length > 0 ? roleSkillsToLearn : ["System Design", "Advanced Architecture", "Performance Optimization", "Leadership & Mentoring", "Agile Methodologies"],
      suggestedResources: recommendedResources,
      interviewQuestions: roleQuestions
    };
  });

  return {
    atsScore: Math.round(Math.min(score, 100)),
    sectionScores,
    matchedKeywords,
    extractedSkills,
    feedback,
    missingGaps,
    recommendedRoles,
    interviewQuestions,
    timelineGaps,
    gapMessage,
    yearsSinceEducation,
    skillReadinessIndex,
    gapAnalysis,
    certifications,
    learningPathways,
    careerTrack,
    nextLevelSkills: nextLevelSkills.slice(0, 6),
    suggestedResources,
    roleSpecificInsights
  };
};
