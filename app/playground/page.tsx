import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { playgroundDemos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Interactive frontend engineering demos for rendering, event loop, virtualization, infinite scroll, module federation, and cache behavior.",
};

export default function PlaygroundPage() {
  return (
    <main>
      <section className="site-container py-20 md:py-28">
        <SectionHeader
          kicker="Playground"
          title="Interactive engineering demos for product-grade frontend concepts."
          copy="Small, purposeful simulations for concepts that matter in enterprise applications: rendering, scheduling, scrolling, caching, and runtime composition."
        />
      </section>
      <section className="site-section pt-0">
        <div className="site-container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {playgroundDemos.map((demo) => {
            const Icon = demo.icon;
            return (
              <article className="surface-card p-6" key={demo.title}>
                <div className="flex items-center justify-between gap-4">
                  <Icon className="text-accent" size={22} />
                  <span className="chip">{demo.state}</span>
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-normal">
                  {demo.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">{demo.summary}</p>
                <div className="mt-6 h-24 rounded-ui border border-line bg-[var(--color-bg)] p-3">
                  <div className="h-full rounded border border-dashed border-[var(--color-line-strong)]" />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
