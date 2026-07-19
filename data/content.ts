// All site copy lives here. Edit this file to update the site —
// components just render whatever is in these objects/arrays.

export const profile = {
  name: "Varshith K",
  role: "Frontend Engineer",
  focus: "Micro-Frontend Architecture",
  email: "varshithknaik@gmail.com",
  location: "Bengaluru, India",
  github: "https://github.com/varshith", // TODO: confirm this is your real GitHub URL
  linkedin: "https://linkedin.com/in/varshith", // TODO: confirm this is your real LinkedIn URL
};

export const hero = {
  eyebrow: "FRONTEND ENGINEER · MICRO-FRONTEND ARCHITECTURE",
  headline: ["Ships frontend systems", "that scale ", "solo", "."],
  lede: "I'm Varshith — sole frontend engineer on an enterprise Global Trade Management platform, building the micro-frontend shell it runs on and the modules that plug into it.",
};

// The shell diagram in the hero — kept separate so it's easy to relabel
// if your actual module set changes.
export const shellModules = [
  { name: "Tariff engine", tag: "HS/HTS classification" },
  { name: "Denied party screen", tag: "compliance checks" },
  { name: "ECCN classifier", tag: "export control" },
  { name: "Chatbot workflows", tag: "assisted review" },
];

export const stats = [
  { num: "4+", label: "years in production React" },
  { num: "1", label: "sole FE owner on GTM" },
  { num: "4", label: "live modules shipped" },
  { num: "15%", label: "retention lift at PwC" },
];

export const about = {
  paragraphs: [
    "I build the frontend layer of enterprise trade-compliance software — the part analysts touch every day to classify tariffs, screen denied parties, and clear export controls. That means owning architecture decisions, not just implementing tickets.",
    "At Avathon, I designed the micro-frontend container the whole product runs on, so every module can ship independently. I lead API contract discussions with backend, and I don't stay in my lane when a backend bug is blocking a release.",
    "Before this, I spent two and a half years at PwC India shipping client-facing interfaces and squeezing UI performance with Web Workers.",
  ],
  focusList: [
    { k: "Architecture", v: "module federation" },
    { k: "Ownership", v: "design → prod, solo" },
    { k: "Collaboration", v: "design + PM + backend" },
    { k: "Base", v: "bengaluru, india" },
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

// Note: GTM is listed here as work experience, not in the Projects section —
// it's company IP, so we describe your role/impact rather than showcasing it
// as a demo-able project.
export const experience: Job[] = [
  {
    dates: "Jan 2025 — Present",
    company: "Avathon",
    location: "Bengaluru, Karnataka",
    role: "Frontend Engineer",
    bullets: [
      "Sole frontend engineer on Global Trade Management — own tariff classification, denied party screening, and ECCN classification end to end.",
      "Architected the micro-frontend container app enabling independent module deployment and multi-tenant, hierarchy-based data visibility.",
      "Lead strict API contract enforcement with backend, and built the in-house component/theming system the team builds on.",
    ],
    tags: ["React 18", "TypeScript", "Module Federation", "Tailwind"],
  },
  {
    dates: "Jul 2022 — Dec 2024",
    company: "PwC India",
    location: "Bengaluru, Karnataka",
    role: "Frontend Engineer",
    bullets: [
      "Delivered responsive, accessible client-facing interfaces, improving user retention by 15%.",
      "Offloaded compute-heavy work to Web Workers, cutting UI delays by 30%.",
    ],
    tags: ["React", "Next.js", "Tailwind CSS"],
  },
];

export type Project = {
  tag: string;
  title: string;
  description: string;
  stack: string[];
  status: "Live" | "In progress" | "Source available";
  link?: string; // TODO: add real links once available
};

// TODO: this is placeholder content for your non-deployed GitHub projects
// and the Pinterest-style feed page — swap in real names, descriptions,
// stacks, and repo/demo links.
export const projects: Project[] = [
  {
    tag: "VISUAL SENSE",
    title: "GenAI dashboard platform",
    description:
      "End-to-end MERN platform turning uploaded datasets into GenAI-driven interactive dashboards, with a real-time chatbot for dataset queries.",
    stack: ["MongoDB", "Redux", "Redis", "GenAI"],
    status: "Source available",
  },
  {
    tag: "PERSONAL PROJECT",
    title: "Masonry feed UI", // TODO: rename to your actual project name
    description:
      "A Pinterest-style masonry feed — virtualized grid, infinite scroll, and responsive image loading. TODO: replace with your real description once the pages are further along.",
    stack: ["React", "Next.js", "Tailwind CSS"],
    status: "In progress",
  },
  {
    tag: "GITHUB",
    title: "Open-source experiments", // TODO: rename or split into individual cards per repo
    description:
      "A handful of smaller repos exploring component patterns, tooling, and UI experiments outside of work. TODO: list specific repos here with one-line descriptions.",
    stack: ["TypeScript", "React"],
    status: "Source available",
    link: "https://github.com/varshith", // TODO: confirm/replace
  },
];

export const stack = {
  languages: ["TypeScript", "JavaScript", "Python"],
  frontend: ["React", "Next.js", "Redux", "Module Federation", "Tailwind"],
  backend: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
  tooling: ["Docker", "Git", "Redis", "Ag-Grid"],
};

export const contact = {
  heading: "Let's build something.",
  sub: "Open to frontend and full-cycle engineering roles.",
};
