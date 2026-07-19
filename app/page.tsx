import Link from "next/link";
import { ArrowRight, BookOpen, CircuitBoard, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableWork } from "@/components/ExpandableWork";
import { MotionSection } from "@/components/MotionSection";
import { SectionHeader } from "@/components/SectionHeader";
import { capabilities, designPlan, notes } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <section className="site-container py-20 md:py-28">
        <div className="max-w-5xl">
          <p className="section-kicker">Frontend Engineer / Enterprise SaaS / Architecture</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.92] tracking-normal text-[var(--color-text)]">
            Building Enterprise Frontends that scale.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted md:text-xl">
            Building scalable products, frontend platforms and reusable systems for enterprise SaaS.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
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
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            ["4 years", "Frontend engineering across enterprise products."],
            ["Avathon", "Owning frontend architecture for Global Trade Management."],
            ["Platform", "Micro frontends, design systems, flags, contracts, RBAC."],
          ].map(([label, copy]) => (
            <div className="surface-card p-5" key={label}>
              <p className="font-display text-2xl font-semibold tracking-normal">{label}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <MotionSection className="site-section">
        <div className="site-container">
          <SectionHeader
            kicker="Phase 1 / Design System"
            title="The site is designed as an engineering product surface."
            copy="Dark mode first, content-first layouts, precise spacing, reusable cards, typed content, and one quiet accent color."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {designPlan.informationArchitecture.slice(0, 6).map((item) => (
              <div className="surface-card p-5" key={item.route}>
                <p className="font-mono text-sm text-accent">{item.route}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{item.intent}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="site-section">
        <div className="site-container">
          <SectionHeader
            kicker="Featured Work"
            title="Systems, not screenshots."
            copy="Each card expands into architecture, constraints, and implementation decisions so recruiters can see product ownership."
          />
          <div className="mt-12">
            <ExpandableWork />
          </div>
        </div>
      </MotionSection>

      <MotionSection className="site-section">
        <div className="site-container">
          <SectionHeader
            kicker="Architecture Signals"
            title="The work sits at the boundary of product, platform, and interface engineering."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div className="surface-card p-6" key={item.label}>
                  <Icon className="text-accent" size={22} />
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-normal">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
                </div>
              );
            })}
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
              <Layers3 className="text-accent" size={24} />
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-normal md:text-5xl">
                Built for recruiters who care about architecture.
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                The website frames frontend work as product systems, platform boundaries, and technical education.
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
