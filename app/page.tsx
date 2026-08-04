import Link from "next/link";
import { ArrowRight, BookOpen, CircuitBoard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableWork } from "@/components/features/work/ExpandableWork";
import { MotionSection } from "@/components/layout/MotionSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { notes, projects } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <PageHeader
        kicker="Software Engineer — Frontend / Enterprise SaaS / Systems"
        title="Building product systems from interface to infrastructure."
        copy="4 years building enterprise SaaS with React, TypeScript, and Next.js—owning frontend architecture, API contracts, configurable workflows, and production delivery, with hands-on Node.js and distributed-systems work."
        headingClassName="max-w-5xl"
        titleClassName="max-w-4xl text-[clamp(3rem,9vw,8rem)] leading-[0.92]"
        copyClassName="max-w-2xl text-lg leading-8 md:text-xl"
        footer={
          <>
            <Button asChild>
              <Link href="/projects">
                Explore Systems Work <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/case-studies">
                View Frontend Case Study <BookOpen size={16} />
              </Link>
            </Button>
          </>
        }
      />

      <MotionSection className="site-section">
        <div className="site-container">
          <SectionHeader
            kicker="Key Products"
            title="Product experiences shaped by systems thinking."
            copy="Enterprise products where frontend architecture meets workflow design, data contracts, state, performance, and backend constraints."
          />
          <div className="mt-12">
            <ExpandableWork />
          </div>
        </div>
      </MotionSection>

      <MotionSection className="site-section">
        <div className="site-container">
          <SectionHeader
            kicker="Systems Project"
            title="Engineering beyond the browser boundary."
            copy="A hands-on system design project exploring commands, queries, service communication, event propagation, persistence, and the product surfaces built on top."
          />

          <Link
            className="surface-card group mt-12 block p-6 transition hover:border-accent md:p-8"
            href={`/projects/${projects[0].slug}`}
          >
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="chip">{projects[0].type}</span>
                  <span className="chip">Full-stack systems</span>
                </div>
                <h3 className="mt-5 font-display text-3xl font-semibold tracking-normal md:text-5xl">
                  {projects[0].title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {projects[0].overview}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Open system design
                  <ArrowRight
                    className="transition group-hover:translate-x-1"
                    size={16}
                  />
                </span>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                  Architecture
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {projects[0].architecture}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {projects[0].stack.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </MotionSection>

      <MotionSection className="site-section">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-kicker">Engineering Notes</p>
            <h2 className="section-title">A knowledge base for product systems.</h2>
            <p className="section-copy">
              Notes across browser internals, React architecture, delivery patterns, performance, APIs, and system design—structured with code, diagrams, demos, and related reading.
            </p>
            <Button asChild variant="secondary" className="mt-8">
              <Link href="/notes">
                Browse Notes <CircuitBoard size={16} />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {notes.slice(0, 4).map((note) => (
              <Link className="surface-card block p-5 transition hover:border-accent" href={`/notes/${note.slug}`} key={note.slug}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip">{note.category}</span>
                  <span className="chip">{note.readingTime}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-normal">{note.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{note.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </MotionSection>

      <section className="site-section">
        <div className="site-container">
          <div className="surface-card grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-normal md:text-5xl">
                Let’s build durable product systems.
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                Open to software engineering roles where strong frontend judgment and end-to-end systems thinking both matter.
              </p>
            </div>
            <Button asChild>
              <Link href="/contact">
                Get in touch <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
