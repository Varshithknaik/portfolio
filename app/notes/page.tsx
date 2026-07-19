import type { Metadata } from "next";
import { NotesIndex } from "@/components/NotesIndex";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Engineering Notes",
  description:
    "Frontend engineering knowledge base covering React, Next.js, browser internals, Webpack, performance, and architecture.",
};

export default function NotesPage() {
  return (
    <main>
      <section className="site-container py-20 md:py-28">
        <SectionHeader
          kicker="Engineering Notes"
          title="A technical knowledge base, not a blog roll."
          copy="Searchable, categorized, MDX-ready notes for code, diagrams, callouts, videos, interactive demos, related posts, and reading time."
        />
      </section>
      <section className="site-section pt-0">
        <div className="site-container">
          <NotesIndex />
        </div>
      </section>
    </main>
  );
}
