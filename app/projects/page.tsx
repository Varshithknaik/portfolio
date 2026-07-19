import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Professional, personal, and architecture-study projects framed by overview, architecture, tech stack, interesting problems, and lessons.",
};

export default function ProjectsPage() {
  return (
    <main>
      <section className="site-container py-20 md:py-28">
        <SectionHeader
          kicker="Projects"
          title="Projects framed by systems, tradeoffs, and product behavior."
          copy="Professional work, personal builds, and architecture studies. Each entry is written for engineering review, not portfolio decoration."
        />
      </section>
      <section className="site-section pt-0">
        <div className="site-container grid gap-5">
          {projects.map((project) => (
            <article className="surface-card p-6 md:p-8" key={project.title}>
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <span className="chip">{project.type}</span>
                  <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
                    {project.title}
                  </h2>
                  <p className="mt-5 text-base leading-7 text-muted">{project.overview}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.github ? (
                      <a className="button button-secondary" href={project.github}>
                        GitHub <ArrowUpRight size={15} />
                      </a>
                    ) : null}
                    {project.live ? (
                      <a className="button button-secondary" href={project.live}>
                        Live Demo <ArrowUpRight size={15} />
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-ui border border-line bg-[var(--color-bg)] p-5">
                    <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                      Architecture
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted">{project.architecture}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-ui border border-line bg-[var(--color-bg)] p-5">
                      <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                        Tech Stack
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.stack.map((item) => (
                          <span className="chip" key={item}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-ui border border-line bg-[var(--color-bg)] p-5">
                      <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                        Interesting Problems
                      </h3>
                      <ul className="mt-4 grid gap-2">
                        {project.problems.map((item) => (
                          <li className="text-sm text-muted" key={item}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
