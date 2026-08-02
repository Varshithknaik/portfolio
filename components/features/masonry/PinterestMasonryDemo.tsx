'use client'

import { useCallback, useMemo, useRef } from 'react'
import { calculateMasonryLayout } from './helper/MasonryLayoutEngine'
import { useFeedController } from './hooks/useFeedController'
import { useContainerMetrics } from './hooks/useContainerMetrics'
import { PRELOAD_DISTANCE, useAutoFill } from './hooks/useAutoFill'
import { MasonryPinComponent } from './component/MasonryPin.component'
import { useFeedOrderReveal } from './hooks/useFeedOrderReveal'
import { useInfiniteScrollTrigger } from './hooks/useInfiniteScrollTrigger'
import { useVirtualization } from './hooks/useVirtualization'

const GAP = 12

function deduplicateById<T extends { id: number }>(pins: T[]) {
  const seenIds = new Set<number>()

  return pins.filter((pin) => {
    if (seenIds.has(pin.id)) return false

    seenIds.add(pin.id)
    return true
  })
}

type PinterestMasonryDemoProps = {
  variant?: 'card' | 'full'
}

export function PinterestMasonryDemo({
  variant = 'card',
}: PinterestMasonryDemoProps) {
  const isFull = variant === 'full'

  const containerRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const { colCount, colWidth, hasMeasured } = useContainerMetrics({
    containerRef,
  })

  const { pins, currentBatchIds, phase, hasMore, loadBatch } =
    useFeedController()

  const { pins: layoutPins, totalHeight } = useMemo(() => {
    return calculateMasonryLayout(pins, {
      columnWidth: colWidth,
      columnCount: colCount,
      gap: GAP,
    })
  }, [pins, colWidth, colCount])

  const { scrolledPins, scrollDirection, activeIds } = useVirtualization({
    totalHeight,
    containerRef,
    layoutPins,
  })

  const currentBatchIdSet = useMemo(
    () => new Set(currentBatchIds),
    [currentBatchIds]
  )

  const renderPins = useMemo(() => {
    const frontierPins = layoutPins.filter((pin) =>
      currentBatchIdSet.has(pin.id)
    )

    return deduplicateById([...scrolledPins, ...frontierPins])
  }, [currentBatchIdSet, layoutPins, scrolledPins])

  const orderedPinIds = useMemo(() => pins.map((pin) => pin.id), [pins])

  const { isPinRevealed, onImageSettled, allSettled } = useFeedOrderReveal({
    pins: orderedPinIds,
    activeIds,
    scrollDirection,
  })

  const canRequestNextPage = phase === 'idle' && hasMore && allSettled

  const requestNextPage = useCallback(() => {
    if (allSettled) loadBatch()
  }, [allSettled, loadBatch])

  useAutoFill({
    enabled: isFull,
    totalHeight,
    hasMeasured,
    phase,
    hasMore,
    loadBatch: requestNextPage,
  })

  useInfiniteScrollTrigger({
    targetRef: sentinelRef,
    enabled: isFull && hasMeasured,
    canTrigger: canRequestNextPage,
    rootMargin: `0px 0px ${PRELOAD_DISTANCE}px 0px`,
    onIntersect: requestNextPage,
  })

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
          onClick={() => void requestNextPage()}
          type="button"
        >
          Load batch
        </button>
      </div>

      <div
        className="relative w-full rounded-ui bg-[var(--color-bg)]"
        ref={containerRef}
        style={{
          height: isFull ? totalHeight : Math.min(totalHeight, 1200),
        }}
      >
        {renderPins.map((pin) => (
          <MasonryPinComponent
            key={pin.id}
            pin={pin}
            isRevealed={isPinRevealed(pin.id)}
            shouldLoadEagerly={currentBatchIdSet.has(pin.id)}
            onImageSettled={() => onImageSettled(pin.id)}
          />
        ))}
        {hasMeasured && (
          <div className="absolute bottom-0 h-px w-full" ref={sentinelRef} />
        )}
      </div>
    </div>
  )
}
