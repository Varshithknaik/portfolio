"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { notes } from "@/lib/site";

export function NotesIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(notes.map((note) => note.category)))];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesCategory = category === "All" || note.category === category;
      const matchesQuery =
        !normalized ||
        [note.title, note.summary, note.category, ...note.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="surface-card h-fit p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={16} />
          <input
            className="h-11 w-full rounded-ui border border-line bg-[var(--color-bg)] pl-10 pr-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-subtle focus:border-accent"
            placeholder="Search notes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="mt-4 grid gap-1">
          {categories.map((item) => (
            <button
              className={`rounded-ui px-3 py-2 text-left text-sm transition ${
                item === category
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-text)]"
                  : "text-muted hover:bg-[var(--color-accent-soft)]"
              }`}
              key={item}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((note) => (
          <Link className="surface-card block p-6 transition hover:border-accent" href={`/notes/${note.slug}`} key={note.slug}>
            <div className="flex flex-wrap gap-2">
              <span className="chip">{note.category}</span>
              <span className="chip">{note.readingTime}</span>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-normal">
              {note.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">{note.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
