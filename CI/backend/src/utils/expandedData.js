export const ROLE_RULES = [
  { role: "Frontend Developer", keywords: ["react","html","css","javascript","typescript","vue","angular","ui","frontend"] },
  { role: "Backend Developer", keywords: ["node","express","api","python","django","java","spring","sql","mongodb","backend"] },
  { role: "Full Stack Developer", keywords: ["react","node","mongodb","sql","api","full stack","full-stack","fullstack"] },
  { role: "Data Scientist", keywords: ["python","machine learning","tensorflow","data analysis","pandas","scikit-learn","jupyter"] },
  { role: "Cloud Engineer", keywords: ["aws","azure","gcp","cloud","infrastructure","terraform"] },
  { role: "Cybersecurity Analyst", keywords: ["security","firewall","penetration testing","ethical hacking","siem","network security"] },
  { role: "DevOps Engineer", keywords: ["docker","kubernetes","ci/cd","jenkins","aws","bash","linux"] },
  { role: "Artificial Intelligence Engineer", keywords: ["ai","neural networks","deep learning","nlp","opencv","keras"] },
  { role: "Machine Learning Engineer", keywords: ["machine learning","models","deployment","mlops","pytorch","tensorflow"] },
  { role: "UI/UX Designer", keywords: ["figma","adobe xd","wireframing","prototyping","user research","ux","ui"] },
  { role: "Mobile App Developer", keywords: ["react native","flutter","android","ios","swift","kotlin","mobile"] },
  { role: "Software Tester", keywords: ["testing","qa","quality assurance","manual testing","test cases","jira"] },
  { role: "QA Automation Engineer", keywords: ["selenium","cypress","jest","automation","ci/cd testing"] },
  { role: "Database Administrator", keywords: ["sql","oracle","postgresql","mysql","database tuning","backup"] },
  { role: "System Administrator", keywords: ["linux","windows server","active directory","bash","sysadmin","hardware"] },
  { role: "Network Engineer", keywords: ["cisco","ccna","routing","switching","wifi","lan","wan","protocols"] },
  { role: "Product Manager", keywords: ["agile","scrum","roadmap","user stories","stakeholder","strategy"] },
  { role: "Blockchain Developer", keywords: ["solidity","smart contracts","ethereum","web3","crypto","dapps"] },
  { role: "Game Developer", keywords: ["unity","unreal engine","c#","c++","3d","gameplay"] },
  { role: "Embedded Systems Engineer", keywords: ["c","c++","microcontrollers","rtos","firmware","arduino"] },
  { role: "Site Reliability Engineer", keywords: ["sre","monitoring","grafana","prometheus","incident response","slo"] },
  { role: "Data Analyst", keywords: ["excel","power bi","tableau","sql","reporting","visualization"] },
  { role: "Data Engineer", keywords: ["spark","hadoop","data warehouse","etl","snowflake","big data"] },
  { role: "Business Analyst", keywords: ["requirements gathering","business processes","modeling","bpmn","data analysis"] },
  { role: "IT Support Specialist", namespace: "helpdesk", keywords: ["troubleshooting","helpdesk","ticketing","hardware repair","os administration"] },
  { role: "Security Engineer", keywords: ["iam","cryptography","vulnerability management","incident response","soc"] },
  { role: "Penetration Tester", keywords: ["kali linux","metasploit","wireshark","nmap","burp suite","red team"] },
  { role: "React Developer", keywords: ["react","redux","hooks","next.js","frontend"] },
  { role: "Node.js Developer", keywords: ["node.js","express","npm","restful api","backend"] },
  { role: "Python Developer", keywords: ["python","django","flask","fastapi","scripting","automation"] }
];

// Helper to easily populate track resources dynamically
const makeRes = (websites, searches) => ({
  websites: websites.map(w => ({ name: w[0], url: w[1], focus: w[2] })),
  youtube: searches
});

export const TRACK_RESOURCES = {
  "frontend developer": makeRes([
    ["MDN Web Docs", "https://developer.mozilla.org", "Web Standards"], ["React Dev", "https://react.dev", "React Patterns"],
    ["CSS-Tricks", "https://css-tricks.com", "Advanced Styling"], ["Frontend Masters", "https://frontendmasters.com/guides/", "Engineering"],
    ["JavaScript.info", "https://javascript.info", "JS Concepts"]
  ], ["Frontend Developer Roadmap", "Advanced React Patterns", "Modern CSS Layouts", "Web Performance Optimization", "Frontend Interview Prep"]),
  
  "backend developer": makeRes([
    ["Node.js Docs", "https://nodejs.org", "Server Runtime"], ["Express Guide", "https://expressjs.com", "API Design"],
    ["System Design Primer", "https://github.com/donnemartin/system-design-primer", "Architecture"], ["OWASP", "https://owasp.org", "Security"],
    ["Postman Learning", "https://learning.postman.com", "API Testing"]
  ], ["Backend Developer Roadmap", "Microservices vs Monolith", "REST API Best Practices", "Database Design Patterns", "Backend Interview Questions"]),

  "full stack developer": makeRes([
    ["The Open Academy", "https://fullstackopen.com/en", "Deep Dive"], ["The Odin Project", "https://www.theodinproject.com", "Curriculum"],
    ["MERN Stack Guide", "https://www.mongodb.com/mern-stack", "Stack Tutorial"], ["Next.js Docs", "https://nextjs.org", "Modern Framework"],
    ["freeCodeCamp", "https://www.freecodecamp.org", "Interactive Practice"]
  ], ["Modern Developer Roadmap", "Building a MERN App from Scratch", "Next.js Full Course", "Web Security Essentials", "Project Ideas"]),

  "data scientist": makeRes([
    ["Kaggle", "https://www.kaggle.com", "ML Datasets"], ["Scikit-Learn", "https://scikit-learn.org", "ML Library"],
    ["Pandas Docs", "https://pandas.pydata.org", "Data Analysis"], ["Towards Data Science", "https://towardsdatascience.com", "Articles"],
    ["DataCamp", "https://www.datacamp.com", "Interactive Python"]
  ], ["Data Science Roadmap", "Python for Data Science", "Statistical Concepts for ML", "Data Cleaning Techniques", "Data Scientist Mock Interview"]),

  "cloud engineer": makeRes([
    ["AWS Training", "https://aws.amazon.com/training", "AWS Cloud"], ["Azure Learn", "https://learn.microsoft.com/azure", "Azure Docs"],
    ["GCP Docs", "https://cloud.google.com/docs", "Google Cloud"], ["A Cloud Guru", "https://acloudguru.com", "Certifications"],
    ["Terraform Registry", "https://registry.terraform.io", "IaC"]
  ], ["Cloud Engineer Roadmap", "AWS Certified Solutions Architect", "Terraform Crash Course", "Cloud Architecture Patterns", "Cloud Computing Basics"]),

  "cybersecurity analyst": makeRes([
    ["TryHackMe", "https://tryhackme.com", "Security Labs"], ["Cybrary", "https://www.cybrary.it", "Training"],
    ["PortSwigger", "https://portswigger.net/web-security", "Web Sec Academy"], ["NIST Guidelines", "https://csrc.nist.gov", "Standards"],
    ["Hack The Box", "https://www.hackthebox.com", "PenTesting"]
  ], ["Cybersecurity Roadmap", "SOC Analyst Training", "SIEM Tools Tutorial", "Network Security Fundamentals", "Cybersecurity Interview Questions"]),

  "devops engineer": makeRes([
    ["Docker Docs", "https://docs.docker.com", "Containers"], ["Kubernetes Docs", "https://kubernetes.io/docs", "Orchestration"],
    ["HashiCorp Learn", "https://developer.hashicorp.com/terraform/tutorials", "IaC"], ["GitLab CI/CD", "https://docs.gitlab.com/ee/ci/", "Pipelines"],
    ["DevOps Roadmap", "https://roadmap.sh/devops", "Guide"]
  ], ["DevOps Engineering Roadmap", "Docker and Kubernetes Tutorial", "Jenkins CI/CD Pipeline", "Infrastructure as Code", "DevOps Interview Prep"]),

  "artificial intelligence engineer": makeRes([
    ["DeepLearning.AI", "https://www.deeplearning.ai", "AI Courses"], ["OpenAI Cookbook", "https://github.com/openai/openai-cookbook", "LLMs"],
    ["Papers With Code", "https://paperswithcode.com", "Research"], ["Hugging Face", "https://huggingface.co", "Transformers"],
    ["Fast.ai", "https://course.fast.ai", "Deep Learning"]
  ], ["Artificial Intelligence Roadmap", "Neural Networks from Scratch", "Fine Tuning LLMs", "AI Engineering Concepts", "ChatGPT API Tutorial"]),

  "machine learning engineer": makeRes([
    ["TensorFlow", "https://www.tensorflow.org", "TF Framework"], ["PyTorch", "https://pytorch.org", "PT Framework"],
    ["Google ML Crash Course", "https://developers.google.com/machine-learning/crash-course", "Fundamentals"], ["MLOps", "https://ml-ops.org", "Deployment"],
    ["Kaggle Learn", "https://www.kaggle.com/learn", "Practice"]
  ], ["Machine Learning Roadmap", "Deep Learning with PyTorch", "Deploying ML Models", "MLOps Lifecycle", "Machine Learning Interview"]),

  "ui/ux designer": makeRes([
    ["Nielsen Norman Group", "https://www.nngroup.com", "UX Research"], ["Laws of UX", "https://lawsofux.com", "Principles"],
    ["Figma Learn", "https://www.figma.com/resources/learn-design", "Prototyping"], ["Mobbin", "https://mobbin.com", "UI Patterns"],
    ["Awwwards", "https://www.awwwards.com", "Inspiration"]
  ], ["UI/UX Design Roadmap", "Figma Auto Layout Tutorial", "User Research Methods", "Design Systems Guide", "UX Portfolio Review"]),

  "mobile app developer": makeRes([
    ["React Native Docs", "https://reactnative.dev", "Cross-Platform"], ["Flutter Docs", "https://docs.flutter.dev", "Widgets"],
    ["Android Developers", "https://developer.android.com", "Native Android"], ["Swift.org", "https://www.swift.org", "Native iOS"],
    ["Ray Wenderlich", "https://www.kodeco.com", "Mobile Tutorials"]
  ], ["Mobile Developer Roadmap", "Flutter vs React Native", "Advanced State Management", "Building Offline Apps", "Mobile Dev Interview"]),

  "software tester": makeRes([
    ["ISTQB", "https://www.istqb.org", "Certification"], ["Ministry of Testing", "https://www.ministryoftesting.com", "Community"],
    ["Guru99", "https://www.guru99.com/software-testing.html", "Testing Concepts"], ["Test Automation U", "https://testautomationu.applitools.com", "Courses"],
    ["Bugzilla", "https://www.bugzilla.org", "Defect Tracking"]
  ], ["Software Testing Roadmap", "Manual Testing Basics", "Writing Test Cases", "API Testing with Postman", "QA Interview Questions"]),

  "qa automation engineer": makeRes([
    ["Cypress Docs", "https://docs.cypress.io", "E2E Testing"], ["Selenium Dev", "https://www.selenium.dev", "Browser Automation"],
    ["Playwright Docs", "https://playwright.dev", "Modern Automation"], ["Katalon Learn", "https://academy.katalon.com", "Tools"],
    ["TestCafe", "https://testcafe.io", "UI Testing"]
  ], ["QA Automation Roadmap", "Cypress Full Course", "Selenium with Java/Python", "Playwright Tutorial", "Automation Framework Design"]),

  "database administrator": makeRes([
    ["SQL Server Docs", "https://learn.microsoft.com/sql", "SQL Server"], ["PostgreSQL Tutorial", "https://www.postgresqltutorial.com", "Postgres"],
    ["Oracle DBA", "https://www.oracle.com/database", "Oracle DB"], ["MongoDB University", "https://university.mongodb.com", "NoSQL Docs"],
    ["DBA StackExchange", "https://dba.stackexchange.com", "Community"]
  ], ["Database Administrator Roadmap", "Advanced SQL Queries", "Database Tuning and Optimization", "Backup and Recovery Strategies", "DBA Interview Questions"]),

  "system administrator": makeRes([
    ["Linux Journey", "https://linuxjourney.com", "Linux Basics"], ["Microsoft Learn", "https://learn.microsoft.com/en-us/windows-server", "Windows Server"],
    ["Red Hat Admin", "https://www.redhat.com/en/services/training", "RHEL"], ["SysAdmin Casts", "https://sysadmincasts.com", "Tutorials"],
    ["CompTIA A+", "https://www.comptia.org/certifications/a", "Certifications"]
  ], ["System Administrator Roadmap", "Linux Command Line Mastery", "Active Directory Setup", "Shell Scripting Tutorial", "SysAdmin Interview Questions"]),

  "network engineer": makeRes([
    ["Cisco NetAcad", "https://www.netacad.com", "Networking"], ["NetworkLessons", "https://networklessons.com", "Routing/Switching"],
    ["Wireshark Docs", "https://www.wireshark.org/docs", "Packet Analysis"], ["Juniper Learning", "https://learningportal.juniper.net", "Juniper"],
    ["GeeksforGeeks Net", "https://www.geeksforgeeks.org/computer-network-tutorials", "Concepts"]
  ], ["Network Engineering Roadmap", "CCNA Full Course", "OSI Model Explained", "BGP Protocol Tutorial", "Network Engineer Interview"]),

  "product manager": makeRes([
    ["Product School", "https://productschool.com", "PM Training"], ["Silicon Valley Product Group", "https://www.svpg.com", "Articles"],
    ["Mind the Product", "https://www.mindtheproduct.com", "Community"], ["Atlassian Agile", "https://www.atlassian.com/agile", "Agile Guide"],
    ["Pragmatic Institute", "https://www.pragmaticinstitute.com", "Frameworks"]
  ], ["Product Manager Roadmap", "How to Write PRDs", "Agile Scrum Methodology", "Product Strategy Explained", "Product Manager Mock Interview"]),

  "blockchain developer": makeRes([
    ["Solidity Docs", "https://docs.soliditylang.org", "Smart Contracts"], ["Ethereum Org", "https://ethereum.org/en/developers", "Web3"],
    ["Hardhat", "https://hardhat.org", "Dev Environment"], ["Alchemy Docs", "https://docs.alchemy.com", "Web3 API"],
    ["CryptoZombies", "https://cryptozombies.io", "Interactive Learning"]
  ], ["Blockchain Developer Roadmap", "Solidity Smart Contracts Tutorial", "Building a DApp", "Web3.js vs Ethers.js", "Blockchain Interview Questions"]),

  "game developer": makeRes([
    ["Unity Learn", "https://learn.unity.com", "Unity 3D"], ["Unreal Engine Docs", "https://docs.unrealengine.com", "UE5"],
    ["Game Programming Patterns", "https://gameprogrammingpatterns.com", "Architecture"], ["Godot Docs", "https://docs.godotengine.org", "Godot"],
    ["Kenney Assets", "https://kenney.nl", "Assets"]
  ], ["Game Developer Roadmap", "Unity Beginner to Pro", "Unreal Engine 5 Blueprints", "C# for Game Dev", "Game Development Portfolio Tips"]),

  "embedded systems engineer": makeRes([
    ["Arduino Docs", "https://docs.arduino.cc", "Prototyping"], ["FreeRTOS", "https://www.freertos.org", "Real Time OS"],
    ["ARM Developer", "https://developer.arm.com", "Processors"], ["Hackaday", "https://hackaday.com", "Hardware Projects"],
    ["C++ Reference", "https://en.cppreference.com", "C++ Language"]
  ], ["Embedded Systems Roadmap", "Microcontrollers Explained", "C Programming for Embedded", "RTOS Fundamentals", "Embedded Engineer Interview"]),

  "site reliability engineer": makeRes([
    ["Google SRE Book", "https://sre.google/sre-book/table-of-contents/", "SRE Bible"], ["Prometheus Docs", "https://prometheus.io/docs", "Monitoring"],
    ["Grafana Learn", "https://grafana.com/tutorials", "Dashboards"], ["Datadog HQ", "https://www.datadoghq.com/blog", "Observability"],
    ["SRE Weekly", "https://sreweekly.com/", "Newsletter"]
  ], ["Site Reliability Engineer Roadmap", "SLAs, SLOs, and SLIs", "Prometheus & Grafana Tutorial", "Incident Management Best Practices", "SRE Interview Preperation"]),

  "data engineer": makeRes([
    ["Apache Spark", "https://spark.apache.org/docs/latest/", "Big Data"], ["Snowflake Docs", "https://docs.snowflake.com", "Data Warehouse"],
    ["Apache Airflow", "https://airflow.apache.org", "Orchestration"], ["dbt Learn", "https://courses.getdbt.com", "Transformations"],
    ["Data Engineering Zoomcamp", "https://github.com/DataTalksClub/data-engineering-zoomcamp", "Open Course"]
  ], ["Data Engineer Roadmap", "ETL Pipelines Explained", "Apache Spark Tutorial", "Data Warehousing Basics", "Data Engineer Interview"]),

  "business analyst": makeRes([
    ["IIBA", "https://www.iiba.org", "Certification"], ["BPMN Quick Guide", "https://www.bpmnquickguide.com", "Process Modeling"],
    ["BA Times", "https://www.batimes.com", "Articles"], ["Lucidchart Resources", "https://www.lucidchart.com/pages", "Diagramming"],
    ["MindTools", "https://www.mindtools.com", "Strategy Tools"]
  ], ["Business Analyst Roadmap", "Requirements Gathering Techniques", "Process Mapping Tutorial", "Agile for Business Analysts", "Business Analyst Interview"]),

  "it support specialist": makeRes([
    ["Google IT Cert", "https://grow.google/certificates/it-support", "Certification"], ["Microsoft Learn IT", "https://learn.microsoft.com", "Troubleshooting"],
    ["Spiceworks Community", "https://community.spiceworks.com", "IT Community"], ["Cisco Meraki", "https://meraki.cisco.com/resources", "Networking Support"],
    ["Prof Messer", "https://www.professormesser.com", "A+ Training"]
  ], ["IT Support Roadmap", "Helpdesk Ticketing Best Practices", "Windows Active Directory Concepts", "Hardware Troubleshooting", "IT Support Interview Questions"]),

  "security engineer": makeRes([
    ["SANS Institute", "https://www.sans.org", "Research"], ["MITRE ATT&CK", "https://attack.mitre.org", "Threat Framework"],
    ["AWS Security", "https://aws.amazon.com/security", "Cloud Sec"], ["Krebs on Security", "https://krebsonsecurity.com", "News"],
    ["Blue Team Labs", "https://blueteamlabs.online", "Defense Labs"]
  ], ["Security Engineer Roadmap", "IAM Best Practices", "Vulnerability Management Lifecycle", "Cloud Security Posture", "Security Engineer Interview"]),

  "penetration tester": makeRes([
    ["Offensive Security", "https://www.offensive-security.com", "Certifications"], ["Hack The Box", "https://www.hackthebox.com", "Labs"],
    ["Burp Suite Academy", "https://portswigger.net/web-security", "Web Vulnerabilities"], ["Nmap Manual", "https://nmap.org/book/man.html", "Discovery"],
    ["VulnHub", "https://www.vulnhub.com", "Practice VMs"]
  ], ["Penetration Testing Roadmap", "Kali Linux Basics", "Burp Suite Tutorial", "Privilege Escalation Techniques", "Pentester Interview Prep"]),

  "react developer": makeRes([
    ["React Dev", "https://react.dev", "Docs"], ["Redux Toolkit", "https://redux-toolkit.js.org", "State"],
    ["Tailwind CSS", "https://tailwindcss.com", "Styling"], ["Next.js", "https://nextjs.org", "Framework"],
    ["Testing Library", "https://testing-library.com", "Testing"]
  ], ["React Roadmap", "React Hooks Deep Dive", "Performance Optimization in React", "Next.js 14 Tutorial", "React Interview Questions"]),

  "node.js developer": makeRes([
    ["Node.js", "https://nodejs.org", "Docs"], ["Express", "https://expressjs.com", "Framework"],
    ["NestJS", "https://nestjs.com", "Enterprise Architecture"], ["Prisma", "https://www.prisma.io", "ORM"],
    ["Passport.js", "https://www.passportjs.org", "Auth"]
  ], ["Node.js Roadmap", "Node.js Event Loop Explained", "Building REST APIs with Express", "NestJS Crash Course", "Node.js Interview Questions"]),

  "python developer": makeRes([
    ["Python Docs", "https://docs.python.org", "Docs"], ["Django", "https://www.djangoproject.com", "Web Framework"],
    ["FastAPI", "https://fastapi.tiangolo.com", "Modern APIs"], ["Real Python", "https://realpython.com", "Tutorials"],
    ["PyPy", "https://www.pypy.org", "Performance"]
  ], ["Python Developer Roadmap", "Django vs FastAPI", "Advanced Python Decorators", "Python Automation Scripting", "Python Interview Questions"])
};

// Aliases for retro-compatibility with atsScorer.js manual track scores
TRACK_RESOURCES["frontend"] = TRACK_RESOURCES["frontend developer"];
TRACK_RESOURCES["backend"] = TRACK_RESOURCES["backend developer"];
TRACK_RESOURCES["fullstack"] = TRACK_RESOURCES["full stack developer"];
TRACK_RESOURCES["data"] = TRACK_RESOURCES["data analyst"];
TRACK_RESOURCES["ai"] = TRACK_RESOURCES["artificial intelligence engineer"];
TRACK_RESOURCES["cloud"] = TRACK_RESOURCES["cloud engineer"];
TRACK_RESOURCES["mobile"] = TRACK_RESOURCES["mobile app developer"];
TRACK_RESOURCES["design"] = TRACK_RESOURCES["ui/ux designer"];
TRACK_RESOURCES["security"] = TRACK_RESOURCES["cybersecurity analyst"];
TRACK_RESOURCES["qa"] = TRACK_RESOURCES["software tester"];

export const ROLE_TO_TRACK = {};
ROLE_RULES.forEach(r => {
  ROLE_TO_TRACK[r.role] = r.role.toLowerCase();
});

// A robust list of 10 relevant questions for each of the 30 roles.
export const questionBank = {};

ROLE_RULES.forEach(r => {
  const roleName = r.role;
  questionBank[roleName] = [
    `Can you describe your experience and core expertise relevant to a ${roleName} position?`,
    `What is the most complex project you have worked on as a ${roleName}, and how did you overcome its challenges?`,
    `How do you stay updated with the latest trends and toolchains specific to this field?`,
    `Describe a time when you had to debug a critical issue in your domain. What was your systematic approach?`,
    `If you had to mentor a junior ${roleName}, what three fundamental concepts would you teach them first?`,
    `Tell me about a time you had to compromise on a technical decision to meet a strict deadline.`,
    `How do you ensure the quality, scalability, and security of your work in this role?`,
    `Can you explain a highly technical concept from your work to a non-technical stakeholder?`,
    `What tools or libraries do you consider indispensable for a ${roleName}, and why?`,
    `Where do you see the future of this specific specialization heading in the next 3-5 years?`
  ];
});

// Default fallback Full Stack
questionBank["Full Stack Developer"] = [
  "Explain the difference between SQL and NoSQL databases.",
  "How do you handle state management in complex frontend applications?",
  "Describe your process for securing a RESTful API.",
  "How do you approach optimizing the performance of a slow web application?",
  "Explain the principles of CI/CD and your experience with it.",
  "How do you manage authentication and authorization across the stack?",
  "What is your approach to handling database migrations without downtime?",
  "Describe the pros and cons of microservices vs monolithic architecture.",
  "How do you ensure your application is accessible to all users?",
  "Can you write a scalable search endpoint that queries a database and returns paginated results?"
];
