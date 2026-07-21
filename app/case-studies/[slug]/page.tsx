import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  extractMarkdownHeadings,
  SafeMarkdown,
  stripMdxMetadata,
} from "@/components/mdx/SafeMarkdown";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/site";

type CaseStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getCaseStudyMarkdown(slug: string) {
  const filePath = path.join(process.cwd(), "content", "case-studies", `${slug}.mdx`);
  const source = await readFile(filePath, "utf8");
  return stripMdxMetadata(source);
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  return {
    title: study?.title ?? "Case Study",
    description: study?.problem,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) {
    notFound();
  }

  const markdown = await getCaseStudyMarkdown(slug);
  const headings = extractMarkdownHeadings(markdown);

  return (
    <main>
      <article className="site-container py-16 md:py-24">
        <Button asChild variant="ghost" className="mb-10">
          <Link href="/case-studies">
            <ArrowLeft size={16} /> Case Studies
          </Link>
        </Button>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start lg:justify-between">
          <div>
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="chip">{study.category}</span>
              <span className="chip">{study.readingTime}</span>
              <span className="chip">Markdown notes</span>
            </div>

            <SafeMarkdown source={markdown} />
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-ui border border-line bg-panel p-4">
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                On this page
              </p>
              <nav className="mt-4 grid gap-1">
                {headings.map((heading) => (
                  <a
                    className="rounded-ui px-3 py-2 text-sm text-muted transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]"
                    href={`#${heading.id}`}
                    key={heading.id}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
              <Button asChild variant="secondary" className="mt-5 w-full">
                <Link href={`/case-studies/${study.slug}/demo`}>
                  Demo <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
