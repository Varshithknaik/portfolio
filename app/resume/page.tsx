import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, Mail, MapPin } from 'lucide-react'
import { ExperienceTimeline } from '@/components/features/timeline/ExperienceTimeline'
import { Button } from '@/components/ui/button'
import { profile } from '@/lib/site'

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
    ],
  },
  {
    label: 'Architecture',
    items: [
      'Micro-Frontends',
      'Module Federation',
      'Design Systems',
      'Storybook',
      'API Contracts',
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
    label: 'Engineering',
    items: [
      'Docker',
      'GitHub Actions',
      'Jest',
      'Playwright',
      'Webpack',
      'Vite',
    ],
  },
]

export default function ResumePage() {
  return (
    <main className="resume-editorial">
      <section className="resume-editorial-hero">
        <div className="site-container resume-editorial-layout">
          <header className="resume-editorial-intro">
            <p className="home-index-label">Resume</p>
            <h1>
              Software Engineer.
              <span>Frontend-led.</span>
              Systems-minded.
            </h1>
            <p>
              Four years building enterprise SaaS with React, TypeScript, and
              Next.js—owning frontend architecture, API contracts, configurable
              workflows, and production delivery.
            </p>

            <div className="resume-editorial-actions">
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
            </div>
          </header>

          <aside className="resume-profile-card">
            <div className="resume-profile-header">
              <span>Profile</span>
              <span>
                <MapPin size={13} /> {profile.location}
              </span>
            </div>
            <div className="resume-profile-title">
              <p>Current focus</p>
              <h2>Global Trade Management</h2>
              <span>Avathon · Jan 2025—Present</span>
            </div>
            <dl>
              <div>
                <dt>Experience</dt>
                <dd>4 years</dd>
              </div>
              <div>
                <dt>Core stack</dt>
                <dd>React + TypeScript</dd>
              </div>
              <div>
                <dt>Architecture</dt>
                <dd>Micro-Frontends</dd>
              </div>
              <div>
                <dt>Broader scope</dt>
                <dd>APIs + Node.js</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="resume-editorial-body">
        <div className="site-container">
          <div className="resume-section-heading">
            <p className="home-index-label">Experience & capabilities</p>
            <h2>Built for a fast, credible scan.</h2>
          </div>

          <div className="resume-editorial-content">
            <ExperienceTimeline variant="resume" />

            <aside className="resume-skills-panel">
              <div className="resume-skills-header">
                <span>Technical skills</span>
                <span>Current toolkit</span>
              </div>

              <div className="resume-skill-groups">
                {skillGroups.map((group) => (
                  <section key={group.label}>
                    <h3>{group.label}</h3>
                    <div>
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <section className="resume-education">
                <p>Education</p>
                <h3>National Institute of Technology Karnataka</h3>
                <span>
                  B.Tech, Electrical and Electronics Engineering · 2018—2022
                </span>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
