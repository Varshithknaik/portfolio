import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PinterestMasonryDemo } from "@/components/PinterestMasonryDemo";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/site";

type CaseStudyDemoPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyDemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  return {
    title: study ? `${study.title} Demo` : "Case Study Demo",
    description: study?.problem,
  };
}

export default async function CaseStudyDemoPage({ params }: CaseStudyDemoPageProps) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) {
    notFound();
  }

  return (
    <main>
      <section className="mx-auto w-[min(1600px,calc(100vw-28px))] py-6 md:py-8">
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
              P-interest Feed Demo
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted">
            API-backed masonry feed with ResizeObserver layout, image preloading, shortest-column placement, skeletons, and IntersectionObserver pagination.
          </p>
        </div>

        <PinterestMasonryDemo variant="full" />
      </section>
    </main>
  );
}
