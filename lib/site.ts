import {
  Blocks,
  Braces,
  CircuitBoard,
  FileCode2,
  Flag,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Radar,
  Rows3,
  ServerCog,
  Sparkles,
  TimerReset,
} from "lucide-react";

export const profile = {
  name: "Varshith K",
  role: "Frontend Engineer",
  company: "Avathon",
  location: "Bengaluru, India",
  email: "varshithknaik@gmail.com",
  linkedin: "https://linkedin.com/in/varshith-k-76b644172",
  github: "https://github.com/varshith",
};

export const navigation = [
  { href: "/experience", label: "Experience" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/notes", label: "Notes" },
  { href: "/projects", label: "Projects" },
  { href: "/playground", label: "Playground" },
  { href: "/resume", label: "Resume" },
];

export const designPlan = {
  informationArchitecture: [
    {
      route: "/",
      intent: "Executive overview of product ownership, architecture judgment, and featured systems.",
    },
    {
      route: "/experience",
      intent: "Expandable career timeline focused on responsibility, decisions, constraints, and lessons.",
    },
    {
      route: "/case-studies",
      intent: "Deep dives into enterprise frontend problems with architecture diagrams instead of screenshots.",
    },
    {
      route: "/notes",
      intent: "MDX-ready engineering knowledge base with search, tags, code, diagrams, and related reading.",
    },
    {
      route: "/projects",
      intent: "Professional and personal systems framed by architecture, tradeoffs, and outcomes.",
    },
    {
      route: "/playground",
      intent: "Interactive demos that teach rendering, scheduling, caching, scrolling, and federation concepts.",
    },
    {
      route: "/resume",
      intent: "Scannable recruiter view with timeline, capabilities, education, and PDF affordance.",
    },
    {
      route: "/contact",
      intent: "Minimal conversion surface for GitHub, LinkedIn, and email.",
    },
  ],
  wireframes: [
    "Home: nav / typography hero / architecture signal strip / expandable featured work / notes preview / contact CTA.",
    "Experience: page header / company timeline / expandable decision panels / responsibility matrix.",
    "Case Studies: index cards / problem-constraint-architecture framework / diagram block / lessons.",
    "Notes: category rail / search input / dense article grid / featured note / related clusters.",
    "Projects: filters / project cards / architecture details / links.",
    "Playground: demo grid / interactive surface / concept timeline.",
    "Resume: profile header / metrics / timeline / stack / download CTA.",
    "Contact: direct links / availability / concise working style.",
  ],
  animationSystem: [
    "Page sections reveal once to communicate progression.",
    "Cards lift only on hover/focus to signal interactivity.",
    "Expandable rows animate height/opacity to preserve context.",
    "Diagrams animate edges/nodes only when they explain flow or state.",
  ],
};

export const capabilities = [
  { icon: Layers3, label: "Micro Frontends", detail: "Webpack Module Federation and shared shell contracts." },
  { icon: Blocks, label: "Design Systems", detail: "Storybook-driven reusable components and review standards." },
  { icon: Flag, label: "Feature Flags", detail: "Progressive delivery, customer-specific workflows, compatibility." },
  { icon: LockKeyhole, label: "Enterprise UX", detail: "RBAC, multi-tenant state, audit-ready flows, configuration." },
  { icon: ServerCog, label: "API Contracts", detail: "Frontend-owned request models, validation, and data boundaries." },
  { icon: TimerReset, label: "Performance", detail: "Rendering, lazy loading, large tables, and measurable UX health." },
];

export const featuredWork = [
  {
    title: "Global Trade Management",
    eyebrow: "Enterprise SaaS",
    summary:
      "Frontend architecture for a multi-module trade compliance platform built from scratch at Avathon.",
    details:
      "Own product-facing frontend architecture, API contract design, feature-flag driven UI, configurable workflows, Storybook components, and module boundaries across Product Master, Classification, BOM, Reports, and Settings.",
    stack: ["React", "TypeScript", "Module Federation", "Storybook", "RBAC"],
  },
  {
    title: "Pinterest Clone",
    eyebrow: "Product System",
    summary:
      "A visual discovery product used to demonstrate feed architecture, infinite scroll, and media-first UI decisions.",
    details:
      "Focuses on resilient masonry layouts, interaction states, routing, optimistic saves, content filtering, and image delivery constraints.",
    stack: ["Next.js", "React", "Intersection Observer", "Caching"],
  },
  {
    title: "Distributed Order System",
    eyebrow: "Architecture Study",
    summary:
      "A systems-oriented case study for order workflows, status transitions, and cross-service UI boundaries.",
    details:
      "Explores domain event views, contract-driven UI, failure states, operational dashboards, and permission-aware actions.",
    stack: ["TypeScript", "State Machines", "API Contracts", "Event Views"],
  },
];

export const experience = [
  {
    company: "Avathon",
    role: "Frontend Engineer",
    period: "Jan 2025 - Present",
    scope: "Global Trade Management platform",
    responsibilities: [
      "Build the application from scratch and own frontend architecture.",
      "Design API contracts with product, design, and backend partners.",
      "Create configurable workflows and feature-flag driven experiences.",
      "Maintain Storybook design-system components and review shared component PRs.",
    ],
    architecture: [
      "Feature-based modules with shared hooks, validation schemas, data adapters, and UI primitives.",
      "Micro frontend platform patterns using Webpack Module Federation.",
      "RBAC and tenant-aware UI composition for enterprise compliance workflows.",
    ],
    challenges: [
      "High configuration needs without fragmenting the product into customer forks.",
      "Data-heavy workflows requiring predictable table, validation, and bulk-action behavior.",
      "Evolving API contracts while the product surface is still being formed.",
    ],
    lessons: [
      "Enterprise frontend architecture is mostly about boundaries and defaults.",
      "Feature flags need product semantics, not just boolean conditionals.",
      "Design systems work best when examples encode real product constraints.",
    ],
    tags: ["React", "TypeScript", "Module Federation", "Storybook", "RBAC"],
  },
  {
    company: "PwC India",
    role: "Frontend Developer",
    period: "Jul 2022 - Dec 2024",
    scope: "Enterprise client applications",
    responsibilities: [
      "Built React and Next.js applications for client-facing digital solutions.",
      "Created reusable UI components and frontend utilities.",
      "Improved rendering performance with workers, lazy loading, and memoization.",
    ],
    architecture: [
      "Feature-focused React modules with shared UI foundations.",
      "Reusable frontend utilities for consistency across delivery teams.",
    ],
    challenges: [
      "Balancing client timelines with reusable platform-quality implementation.",
      "Keeping performance predictable in data-rich enterprise interfaces.",
    ],
    lessons: [
      "A small component library can improve delivery speed when ownership is clear.",
      "Performance work is strongest when it starts with measurement.",
    ],
    tags: ["React", "Next.js", "TailwindCSS", "Web Workers"],
  },
];

export const caseStudies = [
  {
    slug: "global-trade-management",
    title: "Global Trade Management Frontend",
    category: "Enterprise SaaS",
    readingTime: "8 min read",
    problem:
      "Build a configurable frontend for trade compliance teams that need product data, classification workflows, BOM analysis, reporting, and settings in one coherent product.",
    constraints: [
      "Multi-tenant behavior with customer-specific workflows.",
      "RBAC-sensitive actions and audit-friendly user journeys.",
      "Rapidly evolving modules while API contracts are still forming.",
      "Large data tables with validation, bulk actions, and operational states.",
    ],
    architecture:
      "A shell-driven feature architecture with shared UI primitives, domain hooks, API adapters, validation schemas, and feature flag gates at workflow boundaries.",
    decisions: [
      "Model feature flags around product capabilities instead of component visibility.",
      "Keep API transformations outside views so table and form components remain durable.",
      "Use Storybook as a product-state catalog, not just a component gallery.",
    ],
    lessons: [
      "The frontend can reduce backend churn when contracts are explicit.",
      "Configurability needs naming discipline as much as abstraction.",
      "Enterprise UX quality comes from edge states: loading, denied, partial, stale, invalid.",
    ],
  },
  {
    slug: "module-federation-platform",
    title: "Module Federation Platform Patterns",
    category: "Architecture",
    readingTime: "6 min read",
    problem:
      "Enable independently shipped frontend modules while keeping navigation, permissions, dependencies, and user experience consistent.",
    constraints: [
      "Shared dependencies must remain predictable.",
      "Teams need autonomy without breaking global shell behavior.",
      "Runtime failures need graceful isolation.",
    ],
    architecture:
      "A host shell owns navigation, auth context, shared routes, and design tokens while remote modules expose bounded product capabilities.",
    decisions: [
      "Define integration contracts before component contracts.",
      "Expose coarse feature entries instead of many tiny shared internals.",
      "Keep shell-owned concerns out of remote implementation details.",
    ],
    lessons: [
      "Federation is an organizational architecture as much as a bundling technique.",
      "The hardest shared dependency is usually product behavior.",
    ],
  },
];

export const notes = [
  {
    slug: "browser-rendering-pipeline",
    title: "Browser Rendering Pipeline",
    category: "Browser",
    readingTime: "7 min read",
    tags: ["Rendering", "Performance", "Layout"],
    summary:
      "How parsing, style, layout, paint, and compositing shape the performance budget of frontend systems.",
  },
  {
    slug: "understanding-use-layout-effect",
    title: "Understanding useLayoutEffect",
    category: "React",
    readingTime: "5 min read",
    tags: ["React", "Hooks", "Rendering"],
    summary:
      "When synchronous layout reads are necessary, what they block, and how to keep them contained.",
  },
  {
    slug: "module-federation",
    title: "Module Federation in Enterprise Frontends",
    category: "Webpack",
    readingTime: "9 min read",
    tags: ["Webpack", "Architecture", "Micro Frontends"],
    summary:
      "Runtime composition, shared dependency strategy, host/remote contracts, and failure boundaries.",
  },
  {
    slug: "feature-flags",
    title: "Feature Flags as Product Architecture",
    category: "Architecture",
    readingTime: "6 min read",
    tags: ["Flags", "RBAC", "Release"],
    summary:
      "Designing flags around product capabilities, migrations, and customer rollout strategy.",
  },
  {
    slug: "intersection-observer",
    title: "Intersection Observer for Infinite Interfaces",
    category: "Browser",
    readingTime: "4 min read",
    tags: ["Browser", "Scrolling", "UX"],
    summary:
      "Visibility-driven loading patterns for feeds, lazy assets, telemetry, and progressive UI.",
  },
  {
    slug: "react-query-cache",
    title: "React Query Cache Mental Model",
    category: "State Management",
    readingTime: "8 min read",
    tags: ["Caching", "Server State", "React"],
    summary:
      "How stale time, invalidation, optimistic updates, and background refresh change product behavior.",
  },
];

export const projects = [
  {
    title: "Global Trade Management Platform",
    type: "Professional",
    overview:
      "Enterprise SaaS product for trade compliance workflows, product data, classification, BOM, reports, and configuration.",
    architecture:
      "Feature modules, API adapters, Storybook primitives, feature flags, RBAC gates, and table-heavy workflow surfaces.",
    stack: ["React", "TypeScript", "Module Federation", "TailwindCSS", "Storybook"],
    problems: ["Bulk operations", "Configurable workflows", "Contract design", "Tenant-aware UI"],
    github: null,
    live: null,
  },
  {
    title: "Pinterest Clone",
    type: "Personal",
    overview:
      "Visual discovery interface for media grids, content saving, route transitions, and feed loading behavior.",
    architecture:
      "Masonry feed, intersection-driven pagination, optimistic save states, and cached image metadata.",
    stack: ["Next.js", "React", "TypeScript", "Intersection Observer"],
    problems: ["Infinite scroll", "Masonry layout", "Image loading", "Optimistic UI"],
    github: profile.github,
    live: null,
  },
  {
    title: "Distributed Order System",
    type: "Architecture Study",
    overview:
      "Order lifecycle UI exploring status transitions, domain event views, and operational dashboards.",
    architecture:
      "Contract-first event models, state transition tables, permission-aware actions, and failure-state dashboards.",
    stack: ["TypeScript", "React", "State Modeling", "API Contracts"],
    problems: ["Workflow states", "Operational UX", "Domain events", "RBAC"],
    github: null,
    live: null,
  },
];

export const playgroundDemos = [
  {
    icon: CircuitBoard,
    title: "React Rendering Timeline",
    summary: "Step through render, commit, layout effects, paint, and passive effects.",
    state: "Interactive",
  },
  {
    icon: GitBranch,
    title: "Event Loop",
    summary: "Visualize call stack, microtasks, macrotasks, and rendering opportunities.",
    state: "Prototype",
  },
  {
    icon: Rows3,
    title: "Large Table Virtualization",
    summary: "Compare visible rows, overscan, and scroll budget in a data-heavy grid.",
    state: "Interactive",
  },
  {
    icon: Network,
    title: "Module Federation Demo",
    summary: "Inspect host, remotes, exposed entries, shared dependencies, and fallback states.",
    state: "Planned",
  },
  {
    icon: Radar,
    title: "Intersection Observer",
    summary: "Tune thresholds and root margins for infinite loading and analytics events.",
    state: "Interactive",
  },
  {
    icon: FileCode2,
    title: "React Query Cache",
    summary: "Watch stale, fetching, invalidated, and optimistic states move over time.",
    state: "Prototype",
  },
  {
    icon: Braces,
    title: "Suspense Boundaries",
    summary: "Model nested loading states and reveal order for product screens.",
    state: "Planned",
  },
  {
    icon: Sparkles,
    title: "Feature Flag Matrix",
    summary: "Explore release flags, permission flags, experiment flags, and kill switches.",
    state: "Interactive",
  },
];
