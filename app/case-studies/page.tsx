import type { Metadata } from 'next'
import { CaseStudyCard } from '@/components/features/case-studies/CaseStudyCard'
import { MasonrySystemPreview } from '@/components/features/masonry/MasonrySystemPreview'
import { PageHeader } from '@/components/layout/PageHeader'
import { caseStudies } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Implementation case studies covering product-facing systems, algorithms, data flow, tradeoffs, edge cases, and lessons learned.',
}

export default function CaseStudiesPage() {
  return (
    <main className="work-page work-index-page">
      <PageHeader
        className="work-index-page-header"
        kicker="Case Studies"
        title="Implementation notes for product-facing systems."
        copy="Each case study starts as a high-signal preview, then opens into the implementation decisions, code model, edge cases, and lessons."
      />

      <section className="site-section work-index-page-list">
        <div className="site-container grid gap-5">
          {caseStudies.map((study) => (
            <CaseStudyCard
              category={study.category}
              href={`/case-studies/${study.slug}`}
              key={study.slug}
              preview={study.preview}
              readingTime={study.readingTime}
              title={study.title}
            >
              <MasonrySystemPreview />
            </CaseStudyCard>
          ))}
        </div>
      </section>
    </main>
  )
}
