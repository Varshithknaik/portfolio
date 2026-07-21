'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  calculateMasonryLayout,
  LayoutPin,
  Pin,
} from './helper/MasonryLayoutEngine'

const GAP = 12
const PAGE_SIZE = 20
const DEFAULT_COL_WIDTH = 300

function preloadImage(url: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = reject
    image.src = url
  })
}

type PinterestMasonryDemoProps = {
  variant?: 'card' | 'full'
}

export function PinterestMasonryDemo({
  variant = 'card',
}: PinterestMasonryDemoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadedPinsRef = useRef<boolean[]>([])
  const allPinsRef = useRef<LayoutPin[]>([])
  const columnHeightsRef = useRef<number[]>([0, 0, 0])
  const pageRef = useRef(0)
  const hasMoreRef = useRef(true)
  const loadingRef = useRef(false)

  const paintPointerRef = useRef(0)

  const [colCount, setColCount] = useState(3)
  const [colWidth, setColWidth] = useState(DEFAULT_COL_WIDTH)
  const [paintedPins, setPaintedPins] = useState<LayoutPin[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMeasured, setHasMeasured] = useState(false)

  const schedulePaint = useCallback(() => {
    const newlyPainted: LayoutPin[] = []
    console.log(newlyPainted)
    while (
      paintPointerRef.current < loadedPinsRef.current.length &&
      loadedPinsRef.current[paintPointerRef.current]
    ) {
      newlyPainted.push(allPinsRef.current[paintPointerRef.current])
      paintPointerRef.current++
    }

    if (newlyPainted.length > 0) {
      setPaintedPins((prev) => [...prev, ...newlyPainted])
    }
  }, [])

  const relayoutPins = useCallback(
    (nextColCount = colCount, nextColWidth = colWidth) => {
      const { pins: layoutPins, columnHeights } = calculateMasonryLayout(
        allPinsRef.current,
        {
          columnWidth: nextColWidth,
          columnCount: nextColCount,
          gap: GAP,
        }
      )

      allPinsRef.current = layoutPins
      columnHeightsRef.current = columnHeights
      setPaintedPins(layoutPins.slice(0, paintPointerRef.current))

      schedulePaint()
    },
    [colCount, colWidth, schedulePaint]
  )

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width
      const count = Math.max(
        1,
        Math.floor((containerWidth + GAP) / (DEFAULT_COL_WIDTH + GAP))
      )
      const width = (containerWidth - (count - 1) * GAP) / count

      setColCount(count)
      setColWidth(width)
      relayoutPins(count, width)

      setHasMeasured(true)
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [relayoutPins])

  const loadBatch = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    loadingRef.current = true
    setLoading(true)

    try {
      const response = await fetch(`/api/pins?page=${pageRef.current}`)
      const { pins: nextPins } = (await response.json()) as { pins: Pin[] }

      if (!nextPins.length) {
        hasMoreRef.current = false
        observerRef.current?.disconnect()
        setLoading(false)
        loadingRef.current = false
        return
      }

      const combinedPins = [...allPinsRef.current, ...nextPins]

      const { pins: layoutPins } = calculateMasonryLayout(combinedPins, {
        columnWidth: colWidth,
        columnCount: colCount,
        gap: GAP,
      })

      const offset = allPinsRef.current.length
      allPinsRef.current = layoutPins

      loadedPinsRef.current = [
        ...loadedPinsRef.current,
        ...new Array(nextPins.length).fill(false),
      ]

      nextPins.forEach((pin, index) => {
        const globalIndex = offset + index

        preloadImage(pin.url)
          .catch(() => console.log('fail to load the image'))
          .finally(() => {
            loadedPinsRef.current[globalIndex] = true
            schedulePaint()
          })
      })
      pageRef.current++
    } catch {
      //
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [colCount, colWidth, schedulePaint])

  useEffect(() => {
    if (!hasMeasured) return
    void loadBatch()
  }, [hasMeasured, loadBatch])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadBatch()
        }
      },
      { rootMargin: '220px' }
    )

    observerRef.current.observe(sentinel)

    return () => observerRef.current?.disconnect()
  }, [loadBatch])

  // const visiblePins = useMemo(() => {
  //   if (!loading) return []

  //   const placeholders: Pin[] = Array.from(
  //     { length: Math.min(PAGE_SIZE, colCount * 2) },
  //     (_, index) => ({
  //       id: -index - 1,
  //       alt: 'Loading image',
  //       height: [180, 236, 150, 270][index % 4],
  //       url: '',
  //     })
  //   )

  //   const { pins: layoutPins } = calculateMasonryLayout(
  //     [...placeholders, ...allPinsRef.current],
  //     {
  //       columnWidth: colWidth,
  //       columnCount: colCount,
  //       gap: GAP,
  //     }
  //   )

  //   return layoutPins.map((pin) => ({
  //     ...pin,
  //     isSkeleton: true,
  //   }))
  // }, [colCount, colWidth, loading])

  console.log(paintedPins)

  const containerHeight = Math.max(
    480,
    ...columnHeightsRef.current,
    ...paintedPins.map((pin) => pin.top + pin.height)
  )

  const isFull = variant === 'full'

  return (
    <div className={isFull ? 'p-0' : 'surface-card p-3 md:p-4'}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Live API-backed feed
          </p>
          <p className="mt-1 text-sm text-muted">
            {paintedPins.length} pins / {colCount} columns /{' '}
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
        {paintedPins.map((pin) => (
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
