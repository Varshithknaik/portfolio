// All site copy lives here. Edit this file to update the site —
// components just render whatever is in these objects/arrays.

export const profile = {
  name: "Varshith K",
  role: "Frontend Engineer",
  focus: "Enterprise SaaS & Micro-Frontends",
  email: "varshithknaik@gmail.com",
  phone: "+91-9880798144",
  location: "Bengaluru, India",
  linkedin: "https://linkedin.com/in/varshith-k-76b644172",
  github: "https://github.com/varshith", // Placeholder if unknown
};

export const hero = {
  eyebrow: "FRONTEND ENGINEER · MICRO-FRONTEND ARCHITECTURE",
  headline: ["Building scalable", "frontend systems", "for enterprise", "."],
  lede: "Frontend Engineer with 4 years of experience building Enterprise SaaS applications using React, TypeScript, and Next.js. I specialize in designing scalable user interfaces and configurable architectures for multi-tenant platforms.",
};

export const shellModules = [
  { name: "Product Master", tag: "Core Data" },
  { name: "Tariff Classification", tag: "AI-assisted" },
  { name: "ECCN Classification", tag: "Compliance" },
  { name: "BOM & Reports", tag: "Analytics" },
];

export const stats = [
  { num: "4", label: "years in frontend engineering" },
  { num: "Enterprise", label: "SaaS platforms built" },
  { num: "Micro", label: "frontend architecture" },
  { num: "React", label: "Next.js & TypeScript" },
];

export const about = {
  paragraphs: [
    "I am a Frontend Engineer experienced in owning end-to-end frontend development, defining API contracts, and building configurable, reusable architectures for multi-tenant platforms.",
    "I am passionate about creating maintainable frontend systems through Micro-Frontend architecture, Design Systems, and feature-based engineering while collaborating closely with Product, Design, and Backend teams.",
  ],
  focusList: [
    { k: "Architecture", v: "Micro Frontends, Design Systems" },
    { k: "Core Stack", v: "React, Next.js, TypeScript" },
    { k: "Location", v: "Bengaluru, India" },
  ],
};

export type Job = {
  dates: string;
  company: string;
  location: string;
  role: string;
  bullets: string[];
  tags: string[];
};

export const experience: Job[] = [
  {
    dates: "Jan 2025 – Present",
    company: "Avathon",
    location: "Bengaluru, India",
    role: "Frontend Developer",
    bullets: [
      "Own the end-to-end frontend development of the Global Trade Management (GTM) platform, building the product from the ground up and leading implementation across Product Master, Tariff Classification, Bulk Classification, BOM, Reports, and Settings modules.",
      "Design scalable trade compliance workflows while driving new capabilities including AI-assisted Product Classification and ECCN Classification.",
      "Partner with Product Managers, UX Designers, and Backend Engineers to define frontend architecture, design API contracts, and deliver configurable solutions for evolving business requirements.",
      "Contribute to the organization's Micro-Frontend platform using Webpack Module Federation, defining scalable module integration patterns and shared application architecture.",
      "Architect and maintain a feature-based frontend architecture using custom hooks, API abstraction layers, validation schemas, shared utilities, and centralized state management.",
      "Build configuration-drive and feature-flag-based workflows that enable customer-specific customization, backward compatibility, and rapid feature delivery with minimal code changes.",
      "Maintain and extend the Storybook-based Design System, review shared UI component pull requests, and collaborate on frontend engineering standards and production issue resolution across React and Node.js services.",
    ],
    tags: ["React 18", "TypeScript", "Module Federation", "Webpack", "Storybook"],
  },
  {
    dates: "Jul 2022 – Dec 2024",
    company: "PwC India",
    location: "Bengaluru, India",
    role: "Frontend Developer",
    bullets: [
      "Developed enterprise web applications using React, Next.js, and Tailwind CSS for client-facing digital solutions.",
      "Built reusable UI components and frontend utilities that improved consistency and accelerated feature development across applications.",
      "Improved application performance using Web Workers, lazy loading, memoization, and optimized React rendering strategies.",
      "Collaborated with cross-functional teams throughout design, implementation, testing, deployment, and participated in code reviews and frontend architecture discussions.",
    ],
    tags: ["React", "Next.js", "Tailwind CSS", "Web Workers"],
  },
];

export type Project = {
  tag: string;
  title: string;
  description: string;
  stack: string[];
  status: "Live" | "In progress" | "Source available" | "Enterprise Product";
  link?: string;
  bullets?: string[];
};

export const projects: Project[] = [
  {
    tag: "SAAS PLATFORM",
    title: "Global Trade Management Platform",
    description: "Enterprise SaaS platform supporting Product Master, Tariff Classification, Bulk Classification, BOM Management, Reporting, and Settings through scalable, configurable workflows.",
    stack: ["React", "TypeScript", "Module Federation", "Tailwind CSS", "Ag-Grid"],
    status: "Enterprise Product",
    bullets: [
      "Built an Enterprise SaaS platform supporting Product Master, Tariff Classification, Bulk Classification, BOM Management, Reporting, and Settings through scalable, configurable workflows.",
      "Developed data-intensive interfaces using Ag Grid, implementing bulk operations, complex filtering, validation, and business-rule-driven workflows.",
      "Designed frontend architecture to support rapid business changes, configurable workflows, and AI-assisted compliance experiences."
    ]
  },
  {
    tag: "ANALYTICS PLATFORM",
    title: "Omnichannel Platform",
    description: "AI-assisted analytics platform that transformed uploaded datasets into interactive dashboards and conversational insights.",
    stack: ["ReactJS", "Redux", "TypeScript"],
    status: "Enterprise Product",
    bullets: [
      "Developed an AI-assisted analytics platform that transformed uploaded datasets into interactive dashboards and conversational insights.",
      "Built real-time visualizations, optimized frontend responsiveness, and implemented scalable state management using Redux."
    ]
  }
];

export const stack = {
  languages: ["TypeScript", "JavaScript (ES6+)", "Python"],
  frontend: ["React 18", "Next.js", "Redux Toolkit", "React Query", "Tailwind CSS", "Ag Grid", "Webpack", "Module Federation", "Vite"],
  architecture: ["Micro Frontends", "Design Systems", "Component Libraries", "REST APIs", "Feature-Based Architecture", "Multi-Tenant Applications"],
  backend: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Redis"],
  tooling: ["Docker", "Git", "Storybook", "Jest", "Playwright", "Postman", "GitHub Actions"],
};

export const education = [
  {
    institution: "National Institute of Technology Karnataka (NITK), Surathkal",
    degree: "Bachelor's in Electrical and Electronics Engineering",
    dates: "Jul 2018 – Apr 2022"
  }
];

export const contact = {
  heading: "Let's build something.",
  sub: "Open to frontend and full-cycle engineering roles.",
};
