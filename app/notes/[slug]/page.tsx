import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ArrowLeft } from "lucide-react";
import {
  extractMarkdownHeadings,
  SafeMarkdown,
  stripMdxMetadata,
} from "@/components/mdx/SafeMarkdown";
import { Button } from "@/components/ui/button";
import { notes } from "@/lib/site";

type NotePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getNoteMarkdown(slug: string) {
  const filePath = path.join(process.cwd(), "content", "notes", `${slug}.mdx`);
  const source = await readFile(filePath, "utf8");
  return stripMdxMetadata(source);
}

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);

  return {
    title: note?.title ?? "Engineering Note",
    description: note?.summary,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);

  if (!note) {
    notFound();
  }

  const markdown = await getNoteMarkdown(slug);
  const headings = extractMarkdownHeadings(markdown);
  const related = notes
    .filter((item) => item.slug !== note.slug && item.category === note.category)
    .slice(0, 3);
  const fallbackRelated = notes.filter((item) => item.slug !== note.slug).slice(0, 3);

  return (
    <main>
      <article className="site-container py-16 md:py-24">
        <Button asChild variant="ghost" className="mb-10">
          <Link href="/notes">
            <ArrowLeft size={16} /> Notes
          </Link>
        </Button>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start lg:justify-between">
          <div>
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="chip">{note.category}</span>
              <span className="chip">{note.readingTime}</span>
              {note.tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
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

            <div className="mt-4 rounded-ui border border-line bg-panel p-4">
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                Related
              </p>
              <div className="mt-4 grid gap-3">
                {(related.length ? related : fallbackRelated).map((item) => (
                  <Link
                    className="text-sm leading-5 text-muted transition hover:text-[var(--color-text)]"
                    href={`/notes/${item.slug}`}
                    key={item.slug}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
