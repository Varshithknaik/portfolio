import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PinterestMasonryDemo } from '@/components/features/masonry/PinterestMasonryDemo'
import { Button } from '@/components/ui/button'
import { caseStudies } from '@/lib/site'
import { RichTextEditorStarter } from '@/components/features/rich-text/RichTextEditorStarter'

type CaseStudyDemoPageProps = {
  params: Promise<{
    slug: string
  }>
}

type DemoConfig = {
  Component: ComponentType
  description: string
  title: string
}

const demoRegistry: Partial<Record<string, DemoConfig>> = {
  'responsive-pinterest-feed': {
    Component: () => <PinterestMasonryDemo variant="full" />,
    title: 'Masonry Feed Demo',
    description:
      'API-backed masonry feed with ResizeObserver layout, ordered image reveal, shortest-column placement, skeletons, and IntersectionObserver pagination.',
  },
  'rich-text-editor': {
    Component: RichTextEditorStarter,
    title: 'Rich Text Editor Demo',
    description:
      'A dedicated playground for learning the editor command, state, and DOM reconciliation flow.',
  },
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({
  params,
}: CaseStudyDemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const study = caseStudies.find((item) => item.slug === slug)

  return {
    title: study ? `${study.title} Demo` : 'Case Study Demo',
    description: study?.problem,
  }
}

export default async function CaseStudyDemoPage({
  params,
}: CaseStudyDemoPageProps) {
  const { slug } = await params
  const study = caseStudies.find((item) => item.slug === slug)

  if (!study) {
    notFound()
  }

  const demo = demoRegistry[study.slug]

  if (!demo) {
    notFound()
  }

  const Demo = demo.Component

  return (
    <main>
      <section className="mx-auto w-[90vw] py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Button asChild variant="ghost" className="mb-5">
              <Link href={`/case-studies/${study.slug}`}>
                <ArrowLeft size={16} /> Implementation notes
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              <span className="chip">{study.category}</span>
              <span className="chip">Standalone demo</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.96] tracking-normal">
              {demo.title}
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted">
            {demo.description}
          </p>
        </div>
        <Demo />
      </section>
    </main>
  )
}
