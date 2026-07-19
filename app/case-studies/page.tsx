import type { Metadata } from "next";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { SectionHeader } from "@/components/SectionHeader";
import { caseStudies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Enterprise frontend case studies covering problems, constraints, architecture, decisions, and lessons learned.",
};

export default function CaseStudiesPage() {
  return (
    <main>
      <section className="site-container py-20 md:py-28">
        <SectionHeader
          kicker="Case Studies"
          title="Architecture decisions under enterprise constraints."
          copy="No screenshot gallery. These are product and platform breakdowns: problem, constraints, architecture, decisions, and lessons."
        />
      </section>

      <section className="site-section pt-0">
        <div className="site-container grid gap-6">
          {caseStudies.map((study, index) => (
            <article className="surface-card p-6 md:p-8" key={study.slug}>
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">{study.category}</span>
                    <span className="chip">{study.readingTime}</span>
                  </div>
                  <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
                    {study.title}
                  </h2>
                  <p className="mt-5 text-base leading-7 text-muted">{study.problem}</p>
                </div>
                {index === 0 ? (
                  <ArchitectureFlow />
                ) : (
                  <div className="grid gap-3 rounded-ui border border-line bg-[var(--color-bg)] p-5">
                    {["Host Shell", "Remote Modules", "Shared Contracts", "Failure Boundaries"].map(
                      (item) => (
                        <div className="rounded-ui border border-line bg-panel p-4 font-mono text-sm text-muted" key={item}>
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["Constraints", study.constraints],
                  ["Interesting Decisions", study.decisions],
                  ["Lessons Learned", study.lessons],
                ].map(([title, items]) => (
                  <div className="rounded-ui border border-line bg-[var(--color-bg)] p-5" key={title as string}>
                    <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                      {title as string}
                    </h3>
                    <ul className="mt-4 grid gap-3">
                      {(items as string[]).map((item) => (
                        <li className="text-sm leading-6 text-muted" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-ui border border-line bg-[var(--color-bg)] p-5">
                <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                  Architecture
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted">{study.architecture}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
