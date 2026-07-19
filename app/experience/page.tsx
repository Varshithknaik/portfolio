import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Experience timeline focused on frontend architecture, enterprise SaaS ownership, and product engineering lessons.",
};

export default function ExperiencePage() {
  return (
    <main>
      <PageHeader
        kicker="Experience"
        title="Ownership across products, architecture, and delivery."
        copy="This is intentionally not a resume dump. Each role opens into responsibilities, architecture, constraints, and lessons learned."
      />
      <section className="site-section pt-0">
        <div className="site-container">
          <ExperienceTimeline />
        </div>
      </section>
    </main>
  );
}
