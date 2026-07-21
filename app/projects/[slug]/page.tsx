import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  extractMarkdownHeadings,
  SafeMarkdown,
  stripMdxMetadata,
} from "@/components/mdx/SafeMarkdown";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProjectMarkdown(slug: string) {
  const filePath = path.join(process.cwd(), "content", "projects", `${slug}.mdx`);
  const source = await readFile(filePath, "utf8");
  return stripMdxMetadata(source);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  return {
    title: project?.title ?? "Project",
    description: project?.overview,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const markdown = await getProjectMarkdown(slug);
  const headings = extractMarkdownHeadings(markdown);

  return (
    <main>
      <article className="site-container py-16 md:py-24">
        <Button asChild variant="ghost" className="mb-10">
          <Link href="/projects">
            <ArrowLeft size={16} /> Projects
          </Link>
        </Button>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start lg:justify-between">
          <div>
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="chip">{project.type}</span>
              <span className="chip">{project.readingTime}</span>
              {project.stack.slice(0, 5).map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
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
            </div>

            {project.github ? (
              <div className="mt-4 rounded-ui border border-line bg-panel p-4">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                  Repository
                </p>
                <Button asChild variant="secondary" className="mt-4 w-full">
                  <a href={project.github} rel="noopener noreferrer" target="_blank">
                    GitHub <ArrowUpRight size={16} />
                  </a>
                </Button>
              </div>
            ) : null}
          </aside>
        </div>
      </article>
    </main>
  );
}
