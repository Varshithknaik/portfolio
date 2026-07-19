import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notes } from "@/lib/site";

type NotePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export function generateMetadata({ params }: NotePageProps): Metadata {
  const note = notes.find((item) => item.slug === params.slug);
  return {
    title: note?.title ?? "Engineering Note",
    description: note?.summary,
  };
}

export default function NotePage({ params }: NotePageProps) {
  const note = notes.find((item) => item.slug === params.slug);

  if (!note) {
    notFound();
  }

  const related = notes.filter((item) => item.slug !== note.slug && item.category === note.category).slice(0, 3);

  return (
    <main>
      <article className="site-container py-16 md:py-24">
        <Button asChild variant="ghost" className="mb-10">
          <Link href="/notes">
            <ArrowLeft size={16} /> Notes
          </Link>
        </Button>
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <span className="chip">{note.category}</span>
            <span className="chip">{note.readingTime}</span>
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.98] tracking-normal">
            {note.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">{note.summary}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="prose-surface surface-card p-6 md:p-8">
            <h2>Problem</h2>
            <p>
              Enterprise interfaces fail when implementation details leak into product behavior. This note frames the concept as a set of boundaries, signals, and tradeoffs.
            </p>

            <div className="my-6 rounded-ui border border-line bg-[var(--color-accent-soft)] p-5">
              <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-accent">Callout</p>
              <p className="mb-0 mt-3">
                The useful question is not whether the technique is advanced. The useful question is what product state it makes easier to reason about.
              </p>
            </div>

            <h2>Implementation Shape</h2>
            <pre>
              <code>{`type Boundary<TState, TEvent> = {
  read(state: TState): ViewModel;
  transition(state: TState, event: TEvent): TState;
  recover(error: unknown): ViewModel;
};`}</code>
            </pre>

            <h2>Diagram</h2>
            <div className="grid gap-3 rounded-ui border border-line bg-[var(--color-bg)] p-4">
              {["Input", "State Boundary", "View Model", "Interface"].map((item) => (
                <div className="rounded-ui border border-line bg-panel p-4 font-mono text-sm" key={item}>
                  {item}
                </div>
              ))}
            </div>

            <h2>Interactive Demo Slot</h2>
            <div className="flex items-center gap-3 rounded-ui border border-line bg-[var(--color-bg)] p-5">
              <PlayCircle className="text-accent" size={22} />
              <p className="m-0 text-sm">
                This slot is reserved for playground embeds such as rendering timelines, observers, cache state, or federation graphs.
              </p>
            </div>
          </div>

          <aside className="grid h-fit gap-4">
            <div className="surface-card p-5">
              <h2 className="font-display text-xl font-semibold tracking-normal">Tags</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="surface-card p-5">
              <h2 className="font-display text-xl font-semibold tracking-normal">Related</h2>
              <div className="mt-4 grid gap-3">
                {(related.length ? related : notes.filter((item) => item.slug !== note.slug).slice(0, 3)).map((item) => (
                  <Link className="text-sm leading-5 text-muted hover:text-[var(--color-text)]" href={`/notes/${item.slug}`} key={item.slug}>
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
