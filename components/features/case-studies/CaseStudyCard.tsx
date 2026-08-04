import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CaseStudyCardProps = {
  category: string
  children?: ReactNode
  href: string
  preview: string
  readingTime: string
  title: string
  actionLabel?: string
}

export function CaseStudyCard({
  actionLabel = 'Open implementation',
  category,
  children,
  href,
  preview,
  readingTime,
  title,
}: CaseStudyCardProps) {
  return (
    <article>
      <Link
        aria-label={`${actionLabel}: ${title}`}
        className="surface-card group block p-5 transition hover:border-accent md:p-8"
        href={href}
      >
        <div
          className={cn(
            'grid gap-8',
            children && 'lg:grid-cols-[0.85fr_1.15fr] lg:items-center',
          )}
        >
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="chip">{category}</span>
              <span className="chip">{readingTime}</span>
            </div>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              {title}
            </h2>
            <p className="mt-5 text-base leading-7 text-muted">{preview}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              {actionLabel}
              <ArrowRight
                aria-hidden="true"
                className="transition group-hover:translate-x-1"
                size={16}
              />
            </span>
          </div>

          {children}
        </div>
      </Link>
    </article>
  )
}
