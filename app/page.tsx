import Link from "next/link";
import { ArrowRight, BookOpen, CircuitBoard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableWork } from "@/components/ExpandableWork";
import { MotionSection } from "@/components/MotionSection";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { notes } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <PageHeader
        kicker="Frontend Engineer / Enterprise SaaS / Architecture"
        title="Building Enterprise Frontends that scale."
        copy="Building scalable products, frontend platforms and reusable systems for enterprise SaaS."
        headingClassName="max-w-5xl"
        titleClassName="max-w-4xl text-[clamp(3rem,9vw,8rem)] leading-[0.92]"
        copyClassName="max-w-2xl text-lg leading-8 md:text-xl"
        footer={
          <>
            <Button asChild>
              <Link href="/case-studies">
                Explore My Work <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/notes">
                Read Engineering Notes <BookOpen size={16} />
              </Link>
            </Button>
          </>
        }
      />

      <MotionSection className="site-section">
        <div className="site-container">
          <SectionHeader
            kicker="Key Products"
            title="Product surfaces shaped by frontend architecture."
            copy="A focused view of enterprise products where the frontend work includes workflow design, data-heavy interfaces, state architecture, and platform-level decisions."
          />
          <div className="mt-12">
            <ExpandableWork />
          </div>
        </div>
      </MotionSection>

      <MotionSection className="site-section">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-kicker">Engineering Notes</p>
            <h2 className="section-title">A knowledge base for frontend systems.</h2>
            <p className="section-copy">
              Notes are structured for MDX: code, diagrams, callouts, videos, demos, tags, reading time, search, and related posts.
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
                Let’s build durable frontend systems.
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                Open to frontend roles focused on enterprise SaaS, platform architecture, and product-quality interfaces.
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
