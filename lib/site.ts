import {
  Blocks,
  Flag,
  Layers3,
  LockKeyhole,
  ServerCog,
  TimerReset,
} from 'lucide-react'

export const profile = {
  name: 'Varshith K',
  role: 'Frontend Engineer',
  company: 'Avathon',
  location: 'Bengaluru, India',
  email: 'varshithknaik@gmail.com',
  linkedin: 'https://linkedin.com/in/varshith-k-76b644172',
  github: 'https://github.com/Varshithknaik',
}

export const navigation = [
  { href: '/experience', label: 'Experience' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/notes', label: 'Notes' },
  { href: '/projects', label: 'Projects' },
  { href: '/resume', label: 'Resume' },
]

export const designPlan = {
  informationArchitecture: [
    {
      route: '/',
      intent:
        'Executive overview of product ownership, architecture judgment, and featured systems.',
    },
    {
      route: '/experience',
      intent:
        'Expandable career timeline focused on responsibility, decisions, constraints, and lessons.',
    },
    {
      route: '/case-studies',
      intent:
        'Implementation case studies that explain real UI systems, algorithms, tradeoffs, and edge cases.',
    },
    {
      route: '/notes',
      intent:
        'MDX-ready engineering knowledge base with search, tags, code, diagrams, and related reading.',
    },
    {
      route: '/projects',
      intent:
        'Professional and personal systems framed by architecture, tradeoffs, and outcomes.',
    },
    {
      route: '/resume',
      intent:
        'Scannable recruiter view with timeline, capabilities, education, and PDF affordance.',
    },
    {
      route: '/contact',
      intent: 'Minimal conversion surface for GitHub, LinkedIn, and email.',
    },
  ],
  wireframes: [
    'Home: nav / typography hero / architecture signal strip / expandable featured work / notes preview / contact CTA.',
    'Experience: page header / company timeline / expandable decision panels / responsibility matrix.',
    'Case Studies: implementation narrative / working model / algorithm steps / code decisions / edge cases / lessons.',
    'Notes: category rail / search input / dense article grid / featured note / related clusters.',
    'Projects: filters / project cards / architecture details / links.',
    'Resume: profile header / metrics / timeline / stack / download CTA.',
    'Contact: direct links / availability / concise working style.',
  ],
  animationSystem: [
    'Page sections reveal once to communicate progression.',
    'Cards lift only on hover/focus to signal interactivity.',
    'Expandable rows animate height/opacity to preserve context.',
    'Diagrams animate edges/nodes only when they explain flow or state.',
  ],
}

export const capabilities = [
  {
    icon: Layers3,
    label: 'Micro Frontends',
    detail: 'Webpack Module Federation and shared shell contracts.',
  },
  {
    icon: Blocks,
    label: 'Design Systems',
    detail: 'Storybook-driven reusable components and review standards.',
  },
  {
    icon: Flag,
    label: 'Feature Flags',
    detail: 'Progressive delivery, customer-specific workflows, compatibility.',
  },
  {
    icon: LockKeyhole,
    label: 'Enterprise UX',
    detail: 'RBAC, multi-tenant state, audit-ready flows, configuration.',
  },
  {
    icon: ServerCog,
    label: 'API Contracts',
    detail: 'Frontend-owned request models, validation, and data boundaries.',
  },
  {
    icon: TimerReset,
    label: 'Performance',
    detail: 'Rendering, lazy loading, large tables, and measurable UX health.',
  },
]

export const featuredWork = [
  {
    title: 'Global Trade Management',
    eyebrow: 'Enterprise SaaS',
    summary:
      'A multi-module compliance platform for Product Master, Tariff Classification, Bulk Classification, BOM Management, Reporting, and Settings.',
    details:
      'Built scalable, configurable workflows and data-intensive screens with Ag Grid, including bulk operations, complex filtering, validation, business-rule-driven flows, and frontend architecture that can absorb rapid business change.',
    stack: [
      'React',
      'TypeScript',
      'Ag Grid',
      'Configurable Workflows',
      'Enterprise SaaS',
    ],
  },
  {
    title: 'VisualSense',
    eyebrow: 'AI-assisted Analytics',
    summary:
      'An analytics platform that transforms uploaded datasets into interactive dashboards and conversational insights.',
    details:
      'Developed real-time visualizations, optimized frontend responsiveness, and implemented scalable state management for dataset exploration, dashboard interaction, and AI-assisted analysis workflows.',
    stack: [
      'React',
      'TypeScript',
      'Redux',
      'Data Visualization',
      'AI-assisted UX',
    ],
  },
]

export const experience = [
  {
    company: 'Avathon',
    role: 'Frontend Engineer',
    period: 'Jan 2025 - Present',
    scope: 'Global Trade Management platform',
    responsibilities: [
      'Build the application from scratch and own frontend architecture.',
      'Design API contracts with product, design, and backend partners.',
      'Create configurable workflows and feature-flag driven experiences.',
      'Maintain Storybook design-system components and review shared component PRs.',
    ],
    architecture: [
      'Feature-based modules with shared hooks, validation schemas, data adapters, and UI primitives.',
      'Micro frontend platform patterns using Webpack Module Federation.',
      'RBAC and tenant-aware UI composition for enterprise compliance workflows.',
    ],
    challenges: [
      'High configuration needs without fragmenting the product into customer forks.',
      'Data-heavy workflows requiring predictable table, validation, and bulk-action behavior.',
      'Evolving API contracts while the product surface is still being formed.',
    ],
    lessons: [
      'Enterprise frontend architecture is mostly about boundaries and defaults.',
      'Feature flags need product semantics, not just boolean conditionals.',
      'Design systems work best when examples encode real product constraints.',
    ],
    tags: ['React', 'TypeScript', 'Module Federation', 'Storybook', 'RBAC'],
  },
  {
    company: 'PwC India',
    role: 'Frontend Developer',
    period: 'Jul 2022 - Dec 2024',
    scope: 'Enterprise client applications',
    responsibilities: [
      'Built React and Next.js applications for client-facing digital solutions.',
      'Created reusable UI components and frontend utilities.',
      'Improved rendering performance with workers, lazy loading, and memoization.',
    ],
    architecture: [
      'Feature-focused React modules with shared UI foundations.',
      'Reusable frontend utilities for consistency across delivery teams.',
    ],
    challenges: [
      'Balancing client timelines with reusable platform-quality implementation.',
      'Keeping performance predictable in data-rich enterprise interfaces.',
    ],
    lessons: [
      'A small component library can improve delivery speed when ownership is clear.',
      'Performance work is strongest when it starts with measurement.',
    ],
    tags: ['React', 'Next.js', 'TailwindCSS', 'Web Workers'],
  },
]

export const caseStudies = [
  {
    slug: 'responsive-pinterest-feed',
    title: 'Responsive Masonry Feed',
    category: 'Frontend Systems',
    readingTime: '12 min read',
    problem:
      'Build a production-style Pinterest feed that lays out variable-height cards, adapts to container width, loads more content at the right time, and avoids painting broken or unloaded images.',
    preview:
      'A masonry feed built as a layout engine: measurement, shortest-column placement, preloaded rendering, sentinel pagination, and resize recalculation.',
    implementation: [
      {
        title: 'Measure the container, not the browser',
        body: 'The layout uses ResizeObserver on the feed container so column count responds to sidebars, panels, and container changes that window resize would miss.',
      },
      {
        title: 'Calculate columns from minimum viable width',
        body: 'Column count is derived from available width, minimum column width, and gap. Leftover space is distributed back into each column so the grid uses the full container.',
      },
      {
        title: 'Place each pin in the shortest column',
        body: 'A columnHeights array tracks vertical height per column. Each incoming pin is assigned to the shortest column, then that column height is incremented.',
      },
      {
        title: 'Preload before painting',
        body: 'Images are loaded into memory before being added to painted pins. This prevents a feed full of empty absolute-positioned boxes and keeps reveal order predictable.',
      },
      {
        title: 'Use a sentinel for infinite loading',
        body: 'IntersectionObserver watches a one-pixel sentinel at the bottom of the absolute-positioned container and triggers the next batch with root margin.',
      },
      {
        title: 'Recalculate on responsive changes',
        body: 'When column count or width changes, existing pins are re-laid out from scratch so the layout remains coherent after resize.',
      },
    ],
    codeDecisions: [
      {
        label: 'ResizeObserver',
        detail:
          'Chosen over window resize because the feed should react to element-level layout changes, not just viewport changes.',
      },
      {
        label: 'useLayoutEffect',
        detail:
          'Used for measurement so the browser does not paint a visibly wrong first layout before dimensions are applied.',
      },
      {
        label: 'Refs for feed state',
        detail:
          'Pagination, loading guards, image-loaded flags, and column heights live in refs to avoid unnecessary render loops while async loading progresses.',
      },
      {
        label: 'Absolute positioning',
        detail:
          'Each pin receives left, top, width, and height values, giving precise masonry control without relying on CSS columns that break ordering and measurement.',
      },
    ],
    math: [
      'count = max(1, floor((containerWidth + gap) / (minColumnWidth + gap)))',
      'columnWidth = (containerWidth - (count - 1) * gap) / count',
      'left = shortestColumnIndex * (columnWidth + gap)',
      'top = columnHeights[shortestColumnIndex]',
    ],
    edgeCases: [
      'Container width changes without a viewport resize.',
      'Images resolve out of order.',
      'A network batch returns no more pins.',
      'A resize happens after several pages have already been positioned.',
      'Skeleton pins should occupy the same coordinate system as real pins.',
      'Image failures need a fallback path without infinite retry loops.',
    ],
    lessons: [
      'A mature masonry layout is a scheduling and measurement problem, not just a CSS layout problem.',
      'Responsive behavior should be tied to the container that owns the UI.',
      'Preloading and paint order matter when layout uses absolute positioning.',
      'The cleanest next step is extracting the masonry engine into a hook with a tiny render component.',
    ],
  },
]

export const notes = [
  {
    slug: 'browser-rendering-pipeline',
    title: 'Browser Rendering Pipeline',
    category: 'Browser',
    readingTime: '7 min read',
    tags: ['Rendering', 'Performance', 'Layout'],
    summary:
      'How parsing, style, layout, paint, and compositing shape the performance budget of frontend systems.',
  },
  {
    slug: 'understanding-use-layout-effect',
    title: 'Understanding useLayoutEffect',
    category: 'React',
    readingTime: '5 min read',
    tags: ['React', 'Hooks', 'Rendering'],
    summary:
      'When synchronous layout reads are necessary, what they block, and how to keep them contained.',
  },
  {
    slug: 'module-federation',
    title: 'Module Federation in Enterprise Frontends',
    category: 'Webpack',
    readingTime: '9 min read',
    tags: ['Webpack', 'Architecture', 'Micro Frontends'],
    summary:
      'Runtime composition, shared dependency strategy, host/remote contracts, and failure boundaries.',
  },
  {
    slug: 'feature-flags',
    title: 'Feature Flags as Product Architecture',
    category: 'Architecture',
    readingTime: '6 min read',
    tags: ['Flags', 'RBAC', 'Release'],
    summary:
      'Designing flags around product capabilities, migrations, and customer rollout strategy.',
  },
  {
    slug: 'intersection-observer',
    title: 'Intersection Observer for Infinite Interfaces',
    category: 'Browser',
    readingTime: '4 min read',
    tags: ['Browser', 'Scrolling', 'UX'],
    summary:
      'Visibility-driven loading patterns for feeds, lazy assets, telemetry, and progressive UI.',
  },
  {
    slug: 'react-query-cache',
    title: 'React Query Cache Mental Model',
    category: 'State Management',
    readingTime: '8 min read',
    tags: ['Caching', 'Server State', 'React'],
    summary:
      'How stale time, invalidation, optimistic updates, and background refresh change product behavior.',
  },
]

export const projects = [
  {
    slug: 'distributed-order-system',
    title: 'Distributed Order System',
    type: 'Work in progress',
    readingTime: '8 min read',
    overview:
      'A low-level systems build for an Order Management System with command services, query projections, inventory coordination, authentication, and real-time collaboration surfaces.',
    architecture:
      'CQRS architecture with REST at the API Gateway, gRPC between services, Kafka as the event bridge, PostgreSQL for write models, MongoDB for denormalized read models, and shared packages for proto and event contracts.',
    stack: [
      'Node.js',
      'TypeScript',
      'gRPC',
      'Kafka',
      'Prisma',
      'PostgreSQL',
      'MongoDB',
      'React',
    ],
    problems: [
      'Command/query separation',
      'Event contracts',
      'Read model projections',
      'Inventory reservation',
      'Kafka replay',
      'Service boundaries',
    ],
    github: 'https://github.com/Varshithknaik/distributed-oder-system-re',
    live: null,
  },
]
