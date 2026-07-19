import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Code2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Varshith K for frontend engineering roles and enterprise SaaS opportunities.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="site-container py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="section-kicker">Contact</p>
          <h1 className="section-title">Let’s talk about frontend systems.</h1>
          <p className="section-copy">
            Open to frontend engineering roles where product quality, architecture, performance, and platform thinking matter.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Button asChild variant="secondary" className="h-24 justify-start px-5">
            <Link href={`mailto:${profile.email}`}>
              <Mail size={18} /> Email
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-24 justify-start px-5">
            <a href={profile.linkedin}>
              <ArrowUpRight size={18} /> LinkedIn
            </a>
          </Button>
          <Button asChild variant="secondary" className="h-24 justify-start px-5">
            <a href={profile.github}>
              <Code2 size={18} /> GitHub
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
