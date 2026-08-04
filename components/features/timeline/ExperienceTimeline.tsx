import { experience } from '@/lib/site'
import { cn } from '@/lib/utils'

type ExperienceTimelineProps = {
  variant?: 'compact' | 'detailed' | 'resume'
}

const summaries = [
  'End-to-end product development, Micro-Frontends, configurable workflows, design systems, and frontend–backend contracts.',
  'Responsive enterprise applications, reusable React foundations, data experiences, and rendering performance.',
]

export function ExperienceTimeline({
  variant = 'detailed',
}: ExperienceTimelineProps) {
  const showDetails = variant !== 'compact'
  const showArchitecture = variant === 'detailed'

  return (
    <div
      className={cn(
        'home-timeline-card career-timeline-card',
        `career-timeline-card--${variant}`,
      )}
    >
      <div className="home-timeline-header">
        <span>Career timeline</span>
        <span className="home-timeline-status">Present</span>
      </div>

      <ol>
        {experience.map((job, index) => (
          <li key={job.company}>
            <span className="home-timeline-dot" aria-hidden="true" />
            <div className="career-timeline-date">
              <p className="home-timeline-period">{job.period}</p>
            </div>

            <div className="career-timeline-role">
              <h3>{job.role}</h3>
              <p className="home-timeline-company">
                {job.company} · {job.scope}
              </p>
              <p className="home-timeline-detail">{summaries[index]}</p>

              <div className="home-timeline-tags">
                {job.tags.slice(0, 4).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              {showDetails ? (
                <div className="career-timeline-details">
                  <section>
                    <p className="career-timeline-label">Selected ownership</p>
                    <ul>
                      {job.responsibilities
                        .slice(0, variant === 'resume' ? 3 : 4)
                        .map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                    </ul>
                  </section>

                  {showArchitecture ? (
                    <section>
                      <p className="career-timeline-label">Architecture</p>
                      <ul>
                        {job.architecture.slice(0, 3).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
