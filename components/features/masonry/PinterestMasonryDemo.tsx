'use client'

import { useEffect, useRef } from 'react'
import { calculateMasonryLayout } from './helper/MasonryLayoutEngine'
import { useFeedController } from './hooks/useFeedController'
import { useContainerMetrics } from './hooks/useContainerMetrics'
import { PRELOAD_DISTANCE, useAutoFill } from './hooks/useAutoFill'

const GAP = 12

type PinterestMasonryDemoProps = {
  variant?: 'card' | 'full'
}

export function PinterestMasonryDemo({
  variant = 'card',
}: PinterestMasonryDemoProps) {
  const isFull = variant === 'full'

  const containerRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const { colCount, colWidth, hasMeasured } = useContainerMetrics({
    containerRef,
  })

  const { pins, phase, hasMore, loadBatch } = useFeedController()

  const {
    pins: layoutPins,
    columnHeights,
    totalHeight,
  } = calculateMasonryLayout(pins, {
    columnWidth: colWidth,
    columnCount: colCount,
    gap: GAP,
  })

  useAutoFill({
    enabled: isFull,
    totalHeight,
    hasMeasured,
    phase,
    hasMore,
    loadBatch,
  })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !isFull) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadBatch()
        }
      },
      { rootMargin: `0px 0px ${PRELOAD_DISTANCE}px 0px` }
    )

    observerRef.current.observe(sentinel)

    return () => observerRef.current?.disconnect()
  }, [colWidth, isFull, loadBatch, totalHeight])

  const containerHeight = totalHeight

  return (
    <div className={isFull ? 'p-0' : 'surface-card p-3 md:p-4'}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Live API-backed feed
          </p>
          <p className="mt-1 text-sm text-muted">
            {layoutPins.length} pins / {colCount} columns /{' '}
            {Math.round(colWidth)}px width
          </p>
        </div>
        <button
          className="button button-secondary min-h-9 px-3 text-xs"
          onClick={() => void loadBatch()}
          type="button"
        >
          Load batch
        </button>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-ui bg-[var(--color-bg)]"
        ref={containerRef}
        style={{
          height: isFull ? containerHeight : Math.min(containerHeight, 1200),
        }}
      >
        {layoutPins.map((pin) => (
          <div
            className="absolute overflow-hidden rounded-[16px] bg-panel transition-[left,top,width] duration-300"
            key={pin.id}
            style={{
              height: pin.height,
              left: pin.left,
              top: pin.top,
              width: pin.width,
            }}
          >
            {pin.isSkeleton ? (
              <div className="h-full w-full animate-pulse bg-[#cbd5e1]" />
            ) : (
              <>
                <img
                  alt={pin.alt}
                  className="h-full w-full object-cover"
                  src={pin.url}
                />
              </>
            )}
          </div>
        ))}

        <div className="absolute bottom-0 h-px w-full" ref={sentinelRef} />
      </div>
    </div>
  )
}
