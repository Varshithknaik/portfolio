'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navigation } from '@/lib/site';
import { Button } from '@/components/ui/button';

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-xl">
      <div className="site-container flex min-h-16 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 font-display text-sm font-semibold tracking-normal">
          <span className="grid h-7 w-7 place-items-center rounded-ui border border-line bg-panel font-mono text-[11px] text-accent">
            VK
          </span>
          <span>Varshith K</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-ui px-3 py-2 text-sm text-muted transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            variant="secondary"
            size="icon"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />
            ) : (
              <span className="h-4 w-4" />
            )}
          </Button>
          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="/contact">Contact</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="site-container grid gap-1 border-t border-line py-3 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-ui px-3 py-3 text-sm text-muted hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="rounded-ui px-3 py-3 text-sm text-muted hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]"
          >
            Contact
          </Link>
        </div>
      ) : null}
    </header>
  );
}
