import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { experience, profile } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: "Frontend engineering resume for enterprise SaaS, React, TypeScript, and frontend architecture.",
};

const stack = [
  "React",
  "TypeScript",
  "Next.js",
  "TailwindCSS",
  "Micro Frontends",
  "Webpack Module Federation",
  "Design Systems",
  "Storybook",
  "API Contract Design",
  "Feature Flags",
  "RBAC",
  "Multi Tenant Applications",
  "Performance Optimization",
];

export default function ResumePage() {
  return (
    <main>
      <PageHeader
        kicker="Resume"
        title="Frontend Engineer for enterprise SaaS systems."
        copy="4 years of experience building React, TypeScript, Next.js, micro frontend, and design-system architecture."
        actions={
          <>
            <Button asChild>
              <a href="/VarshithK.pdf" download>
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
          <aside className="surface-card h-fit p-6">
            <h2 className="font-display text-2xl font-semibold tracking-normal">Core Stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </aside>

          <div className="grid gap-4">
            {experience.map((job) => (
              <article className="surface-card p-6" key={job.company}>
                <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                  <div>
                    <p className="font-mono text-xs text-subtle">{job.period}</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-normal">
                      {job.company}
                    </h2>
                  </div>
                  <div>
                    <p className="font-semibold">{job.role}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{job.scope}</p>
                    <ul className="mt-5 grid gap-3">
                      {job.responsibilities.slice(0, 3).map((item) => (
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
  );
}
