import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Database,
  MapPin,
  ServerCog,
} from 'lucide-react'
import { MasonrySystemPreview } from '@/components/features/masonry/MasonrySystemPreview'
import { ExperienceTimeline } from '@/components/features/timeline/ExperienceTimeline'
import { MotionSection } from '@/components/layout/MotionSection'
import {
  capabilities,
  caseStudies,
  featuredWork,
  profile,
  projects,
} from '@/lib/site'

function GtmOwnershipSummary() {
  const modules = [
    'Product Master',
    'Tariff Classification',
    'Bulk Classification',
    'BOM Management',
    'Reports',
    'Settings',
  ]

  return (
    <div className="home-gtm-summary">
      <div className="home-gtm-summary-header">
        <span>Resume highlight</span>
        <span>Avathon · 2025—Present</span>
      </div>
      <div className="home-gtm-summary-intro">
        <p>Platform ownership</p>
        <h4>Six product modules built from the ground up.</h4>
      </div>
      <ol>
        {modules.map((module, index) => (
          <li key={module}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{module}</strong>
          </li>
        ))}
      </ol>
      <div className="home-gtm-summary-footer">
        <span>Architecture</span>
        <p>
          Micro-Frontends · API contracts · Storybook · Feature flags · RBAC
        </p>
      </div>
    </div>
  )
}

function AnalyticsStory() {
  const steps = [
    {
      label: '01',
      title: 'Bring data in',
      detail: 'Uploaded datasets become a structured analytics workspace.',
    },
    {
      label: '02',
      title: 'Explore visually',
      detail: 'Reusable dashboards turn complex records into clear signals.',
    },
    {
      label: '03',
      title: 'Ask in context',
      detail: 'Conversational insights make the same data easier to navigate.',
    },
  ]

  return (
    <div className="home-analytics-story">
      <div className="home-analytics-story-header">
        <span>Product flow</span>
        <span>Visual Sense</span>
      </div>
      <ol>
        {steps.map((step) => (
          <li key={step.label}>
            <span>{step.label}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="home-analytics-story-footer">
        <span>Engineering focus</span>
        <strong>State, APIs, reusable UI, and rendering performance</strong>
      </div>
    </div>
  )
}

function ArchitectureMap() {
  return (
    <div className="home-architecture-map">
      <div className="home-architecture-node home-architecture-node--client">
        <Braces size={18} />
        <span>React client</span>
      </div>
      <span className="home-architecture-connector">REST</span>
      <div className="home-architecture-node">
        <ServerCog size={18} />
        <span>API Gateway</span>
      </div>
      <span className="home-architecture-connector">gRPC</span>
      <div className="home-service-grid">
        <span>Order</span>
        <span>Inventory</span>
        <span>Payment</span>
      </div>
      <span className="home-architecture-connector">Kafka events</span>
      <div className="home-architecture-node home-architecture-node--data">
        <Database size={18} />
        <span>Read models</span>
      </div>
    </div>
  )
}

export default function Home() {
  const masonryStudy = caseStudies[0]
  const systemsProject = projects[0]

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="site-container">
          <div className="home-hero-frame">
            <div className="home-hero-copy">
              <div className="home-hero-meta">
                <span>
                  <span className="home-status-dot" />
                  Software Engineer
                </span>
                <span className="home-location">
                  <MapPin size={14} /> {profile.location}
                </span>
              </div>

              <h1>
                <span>Building product systems</span>
                <span className="home-hero-accent">from interface</span>
                <span>to infrastructure.</span>
              </h1>

              <div className="home-hero-bottom">
                <p>
                  Frontend-led software engineer building enterprise SaaS across
                  UI architecture, API contracts, configurable workflows, and
                  production delivery—with hands-on Node.js experience.
                </p>
                <Link className="home-primary-link" href="/case-studies">
                  View Frontend Case Study <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          <dl className="home-proof-strip">
            <div>
              <dt>Experience</dt>
              <dd>4 years</dd>
            </div>
            <div>
              <dt>Current team</dt>
              <dd>Avathon</dd>
            </div>
            <div>
              <dt>Core stack</dt>
              <dd>React + TypeScript</dd>
            </div>
            <div>
              <dt>Broader scope</dt>
              <dd>APIs + Node.js</dd>
            </div>
          </dl>
        </div>
      </section>

      <MotionSection className="home-section home-products">
        <div className="site-container">
          <div className="home-section-heading">
            <div>
              <p className="home-index-label">01 / Selected products</p>
              <h2>Complex workflows, made usable.</h2>
            </div>
            <p>
              Enterprise products where interface decisions meet business rules,
              backend contracts, performance constraints, and real production
              ownership.
            </p>
          </div>

          <div className="home-capability-rail" aria-label="Core capabilities">
            {capabilities.map(({ icon: Icon, label }) => (
              <span key={label}>
                <Icon size={16} /> {label}
              </span>
            ))}
          </div>

          <div className="home-product-list">
            <article className="home-product-card home-product-card--trade">
              <div className="home-product-copy">
                <p className="home-product-number">01</p>
                <p className="home-product-type">{featuredWork[0].eyebrow}</p>
                <h3>{featuredWork[0].title}</h3>
                <p className="home-product-summary">
                  {featuredWork[0].summary}
                </p>
                <p className="home-product-detail">{featuredWork[0].details}</p>
                <div className="home-product-stack">
                  {featuredWork[0].stack.slice(0, 5).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <Link className="home-text-link" href="/experience">
                  View role and ownership <ArrowRight size={16} />
                </Link>
              </div>
              <GtmOwnershipSummary />
            </article>

            <article className="home-product-card home-product-card--analytics">
              <AnalyticsStory />
              <div className="home-product-copy">
                <p className="home-product-number">02</p>
                <p className="home-product-type">{featuredWork[1].eyebrow}</p>
                <h3>{featuredWork[1].title}</h3>
                <p className="home-product-summary">
                  {featuredWork[1].summary}
                </p>
                <p className="home-product-detail">{featuredWork[1].details}</p>
                <div className="home-product-stack">
                  {featuredWork[1].stack.slice(0, 5).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="home-section home-experience-section">
        <div className="site-container home-experience-layout">
          <div className="home-experience-intro">
            <p className="home-index-label">02 / Experience</p>
            <h2>
              Four years.
              <span>One consistent thread:</span>
              ownership.
            </h2>
            <p>
              From reusable interfaces at PwC to owning frontend architecture
              and API contracts for a multi-module trade platform at Avathon.
            </p>
            <Link
              className="home-primary-link home-primary-link--dark"
              href="/experience"
            >
              Explore full experience <ArrowRight size={18} />
            </Link>
          </div>

          <ExperienceTimeline variant="compact" />
        </div>
      </MotionSection>

      <MotionSection className="home-section home-depth-section">
        <div className="site-container">
          <div className="home-section-heading home-section-heading--depth">
            <div>
              <p className="home-index-label">03 / Engineering depth</p>
              <h2>Deep in the browser. Curious beyond it.</h2>
            </div>
            <p>
              One implementation demonstrates production frontend judgment; the
              other explores the service boundaries behind a distributed
              product.
            </p>
          </div>

          <div className="home-depth-grid">
            <article className="home-case-study-panel">
              <div className="home-panel-heading">
                <div>
                  <span>{masonryStudy.category}</span>
                  <span>{masonryStudy.readingTime}</span>
                </div>
                <BookOpen size={20} />
              </div>
              <h3>{masonryStudy.title}</h3>
              <p>{masonryStudy.preview}</p>
              <div className="home-masonry-preview">
                <MasonrySystemPreview />
              </div>
              <Link
                className="home-text-link"
                href={`/case-studies/${masonryStudy.slug}`}
              >
                Read implementation <ArrowRight size={16} />
              </Link>
            </article>

            <article className="home-system-project-panel">
              <div className="home-panel-heading">
                <div>
                  <span>System design</span>
                  <span>{systemsProject.type}</span>
                </div>
                <ServerCog size={20} />
              </div>
              <h3>{systemsProject.title}</h3>
              <p>{systemsProject.overview}</p>
              <ArchitectureMap />
              <Link
                className="home-text-link home-text-link--light"
                href={`/projects/${systemsProject.slug}`}
              >
                Open project notes <ArrowRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </MotionSection>

      <section className="home-contact-section">
        <div className="site-container">
          <div className="home-contact-panel">
            <p className="home-index-label">04 / Let’s work together</p>
            <h2>Building something complex?</h2>
            <div className="home-contact-bottom">
              <p>
                I’m interested in software engineering roles where frontend
                judgment, product ownership, and systems thinking all matter.
              </p>
              <div>
                <Link className="home-contact-link" href="/contact">
                  Start a conversation <ArrowUpRight size={20} />
                </Link>
                <a
                  className="home-contact-email"
                  href={`mailto:${profile.email}`}
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
