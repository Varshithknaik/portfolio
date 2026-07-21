import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MasonrySystemPreview } from "@/components/features/masonry/MasonrySystemPreview";
import { PageHeader } from "@/components/layout/PageHeader";
import { caseStudies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Implementation case studies covering real frontend systems, algorithms, tradeoffs, edge cases, and lessons learned.",
};

export default function CaseStudiesPage() {
  return (
    <main>
      <PageHeader
        kicker="Case Studies"
        title="Implementation notes for real frontend systems."
        copy="Each case study starts as a high-signal preview, then opens into the implementation decisions, code model, edge cases, and lessons."
      />

      <section className="site-section pt-0">
        <div className="site-container grid gap-5">
          {caseStudies.map((study) => (
            <Link
              className="surface-card group block p-5 transition hover:border-accent md:p-8"
              href={`/case-studies/${study.slug}`}
              key={study.slug}
            >
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">{study.category}</span>
                    <span className="chip">{study.readingTime}</span>
                  </div>
                  <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                    P-interest Feed
                  </h2>
                  <p className="mt-5 text-base leading-7 text-muted">{study.preview}</p>
                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Open implementation
                    <ArrowRight className="transition group-hover:translate-x-1" size={16} />
                  </div>
                </div>
                <MasonrySystemPreview />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
