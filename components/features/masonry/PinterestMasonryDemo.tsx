'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { calculateMasonryLayout } from './helper/MasonryLayoutEngine'
import { useFeedController } from './hooks/useFeedController'
import { useContainerMetrics } from './hooks/useContainerMetrics'
import { PRELOAD_DISTANCE, useAutoFill } from './hooks/useAutoFill'
import { MasonryPinComponent } from './component/MasonryPin.component'
import { useFeedOrderReveal } from './hooks/useFeedOrderReveal'

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

  const orderedPinIds = useMemo(() => pins.map((pin) => pin.id), [pins])

  const { isPinRevealed, onImageSettled, allSettled } = useFeedOrderReveal({
    pins: orderedPinIds,
  })

  const {
    pins: layoutPins,
    columnHeights,
    totalHeight,
  } = calculateMasonryLayout(pins, {
    columnWidth: colWidth,
    columnCount: colCount,
    gap: GAP,
  })

  const loadNextBatch = useCallback(async () => {
    if (!allSettled) return

    await loadBatch()
  }, [allSettled, loadBatch])

  useAutoFill({
    enabled: isFull,
    totalHeight,
    hasMeasured,
    phase,
    hasMore,
    loadBatch: loadNextBatch,
  })

  const canLoadMore = phase === 'idle' && allSettled && hasMore

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !isFull || !canLoadMore) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadNextBatch()
        }
      },
      { rootMargin: `0px 0px ${PRELOAD_DISTANCE}px 0px` }
    )

    observerRef.current.observe(sentinel)

    return () => observerRef.current?.disconnect()
  }, [canLoadMore, colWidth, isFull, phase, totalHeight, loadNextBatch])

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
          onClick={() => void loadNextBatch()}
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
        {layoutPins.map((pin, idx) => (
          <MasonryPinComponent
            key={pin.id}
            pin={pin}
            isRevealed={isPinRevealed(pin.id)}
            onImageSettled={() => onImageSettled(idx)}
          />
        ))}
        {hasMeasured && (
          <div className="absolute bottom-0 h-px w-full" ref={sentinelRef} />
        )}
      </div>
    </div>
  )
}
