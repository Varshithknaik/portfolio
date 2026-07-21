'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { navigation } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/layout/ThemeProvider'
import { cn } from '@/lib/utils'

export default function Nav() {
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-xl">
      <div className="site-container flex min-h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-sm font-semibold tracking-normal"
        >
          <span className="grid h-7 w-7 place-items-center rounded-ui border border-line bg-panel font-mono text-[11px] text-accent">
            VK
          </span>
          <span>Varshith K</span>
        </Link>
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-ui px-3 py-2 text-sm transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]',
                  active
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-text)] shadow-[inset_0_0_0_1px_rgba(138,180,255,0.18)]'
                    : 'text-muted'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            variant="secondary"
            size="icon"
            aria-label="Toggle theme"
          >
            <Moon className="theme-icon-light" size={17} aria-hidden="true" />
            <Sun className="theme-icon-dark" size={17} aria-hidden="true" />
          </Button>
          <Button
            asChild
            variant="secondary"
            className={cn(
              'hidden sm:inline-flex',
              isActive('/contact') &&
                'border-accent bg-[var(--color-accent-soft)] text-[var(--color-text)]'
            )}
          >
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
          {navigation.map((item) => {
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-ui px-3 py-3 text-sm hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]',
                  active
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-text)]'
                    : 'text-muted'
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            aria-current={isActive('/contact') ? 'page' : undefined}
            className={cn(
              'rounded-ui px-3 py-3 text-sm hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]',
              isActive('/contact')
                ? 'bg-[var(--color-accent-soft)] text-[var(--color-text)]'
                : 'text-muted'
            )}
          >
            Contact
          </Link>
        </div>
      ) : null}
    </header>
  )
}
