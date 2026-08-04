import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Code2, Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Varshith K for software engineering roles and enterprise product opportunities.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        kicker="Contact"
        title="Let’s talk about product systems."
        copy="Open to Software Engineer roles with deep frontend ownership, API collaboration, product architecture, performance, and platform thinking."
      >
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Button asChild variant="secondary" className="h-24 justify-start px-5">
            <Link href={`mailto:${profile.email}`}>
              <Mail size={18} /> Email
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-24 justify-start px-5">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <ArrowUpRight size={18} /> LinkedIn
            </a>
          </Button>
          <Button asChild variant="secondary" className="h-24 justify-start px-5">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Code2 size={18} /> GitHub
            </a>
          </Button>
        </div>
      </PageHeader>
    </main>
  );
}
