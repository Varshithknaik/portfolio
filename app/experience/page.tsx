import type { Metadata } from 'next'
import { ExperienceTimeline } from '@/components/features/timeline/ExperienceTimeline'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Experience timeline focused on enterprise product ownership, frontend architecture, API boundaries, and engineering lessons.',
}

export default function ExperiencePage() {
  return (
    <main className="career-page">
      <section className="career-page-hero">
        <div className="site-container career-page-layout">
          <header className="career-page-intro">
            <p className="home-index-label">Experience</p>
            <h1>
              Four years.
              <span>One consistent thread:</span>
              ownership.
            </h1>
            <p className="career-page-copy">
              From reusable interfaces at PwC to owning frontend architecture,
              API contracts, and configurable workflows for a multi-module trade
              platform at Avathon.
            </p>

            <dl className="career-page-facts">
              <div>
                <dt>Started</dt>
                <dd>2022</dd>
              </div>
              <div>
                <dt>Current team</dt>
                <dd>Avathon</dd>
              </div>
              <div>
                <dt>Primary focus</dt>
                <dd>Product systems</dd>
              </div>
            </dl>
          </header>

          <ExperienceTimeline variant="detailed" />
        </div>
      </section>
    </main>
  )
}
