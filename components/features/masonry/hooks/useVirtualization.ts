import { useEffect, useMemo, useRef, useState } from 'react'
import type { LayoutPin } from '../helper/MasonryLayoutEngine'

interface UseVirtualizationProps {
  totalHeight: number
  containerRef: React.RefObject<HTMLDivElement | null>
  layoutPins: LayoutPin[]
  overscan?: number
}

export type ScrollDirection = 'forward' | 'backward'

export const useVirtualization = ({
  totalHeight,
  containerRef,
  layoutPins,
  overscan = 300,
}: UseVirtualizationProps) => {
  const [viewPort, setViewPort] = useState<{
    top: number
    bottom: number
  }>({
    top: 0,
    bottom: 0,
  })
  const [scrollDirection, setScrollDirection] =
    useState<ScrollDirection>('forward')
  const lastScrollRef = useRef<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const scrollY = rect.top

      setScrollDirection(
        scrollY > lastScrollRef.current ? 'backward' : 'forward'
      )
      lastScrollRef.current = scrollY

      setViewPort({
        top: Math.max(0, Math.min(totalHeight, -rect.top)),
        bottom: Math.min(
          totalHeight,
          Math.max(0, window.innerHeight - rect.top)
        ),
      })
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, totalHeight])

  return useMemo(() => {
    const top = viewPort.top - overscan
    const bottom = viewPort.bottom + overscan

    const scrolledPins = layoutPins.filter((pin) => {
      const pinBottom = pin.top + pin.height
      return pinBottom >= top && pin.top <= bottom
    })

    return {
      scrolledPins,
      scrollDirection,
      activeIds: scrolledPins.map((pin) => pin.id),
    }
  }, [layoutPins, viewPort, scrollDirection, overscan])
}
