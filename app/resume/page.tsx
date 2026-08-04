import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, Mail } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { experience, profile } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Software Engineer specializing in frontend engineering, enterprise SaaS, Micro-Frontends, API contracts, and product systems.',
}

const skillGroups = [
  {
    label: 'Frontend',
    items: [
      'React 18',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Redux Toolkit',
      'React Query',
      'Tailwind CSS',
      'HTML5',
    ],
  },
  {
    label: 'Architecture',
    items: [
      'Micro-Frontends',
      'Webpack Module Federation',
      'Design Systems',
      'Storybook',
      'API Contract Design',
      'Feature-Based Architecture',
      'Multi-Tenant Applications',
      'Feature Flags',
      'RBAC',
    ],
  },
  {
    label: 'Backend & Data',
    items: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'Kafka',
      'PostgreSQL',
      'MongoDB',
      'Redis',
    ],
  },
  {
    label: 'Engineering Tools',
    items: [
      'Docker',
      'Git',
      'GitHub Actions',
      'Jest',
      'Playwright',
      'Postman',
      'Webpack',
      'Vite',
    ],
  },
]

export default function ResumePage() {
  return (
    <main>
      <PageHeader
        kicker="Resume"
        title="Software Engineer — Frontend"
        copy="4 years building enterprise SaaS products with React, TypeScript, and Next.js, owning frontend architecture, API contract design, configurable workflows, and production delivery."
        actions={
          <>
            <Button asChild>
              <a href="/VarshithK_FE_SWE.pdf" download>
                Download PDF <Download size={16} />
              </a>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`mailto:${profile.email}`}>
                Email <Mail size={16} />
              </Link>
            </Button>
          </>
        }
      />

      <section className="site-section pt-0">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="grid h-fit gap-4">
            <div className="surface-card p-6">
              <h2 className="font-display text-2xl font-semibold tracking-normal">
                Technical Skills
              </h2>
              <div className="mt-6 grid gap-5">
                {skillGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                      {group.label}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span className="chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                Education
              </p>
              <h2 className="mt-3 font-display text-xl font-semibold tracking-normal">
                National Institute of Technology Karnataka
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Bachelor of Technology in Electrical and Electronics Engineering
              </p>
              <p className="mt-3 font-mono text-xs text-subtle">
                Jul 2018 – Apr 2022 · Surathkal
              </p>
            </div>
          </aside>

          <div className="grid gap-4">
            {experience.map((job) => (
              <article className="surface-card p-6" key={job.company}>
                <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                  <div>
                    <p className="font-mono text-xs text-subtle">
                      {job.period}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-normal">
                      {job.company}
                    </h2>
                  </div>
                  <div>
                    <p className="font-semibold">{job.role}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {job.scope}
                    </p>
                    <ul className="mt-5 grid gap-3">
                      {job.responsibilities.map((item) => (
                        <li className="text-sm leading-6 text-muted" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
