import Link from "next/link";
import { navigation, profile } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="site-container grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-display text-lg font-semibold tracking-normal">Varshith K</p>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
            Software Engineer specializing in frontend engineering, enterprise SaaS, API contracts, Micro-Frontends, and product systems.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {navigation.map((item) => (
            <Link className="hover:text-[var(--color-text)]" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <a className="hover:text-[var(--color-text)]" href={`mailto:${profile.email}`}>
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
