import { useCallback, useRef, useState } from 'react'
import { Pin } from '../helper/MasonryLayoutEngine'

type FeedPhase = 'unmeasured' | 'idle' | 'fetching' | 'error' | 'exhausted'

function preloadImage(url: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = reject
    image.src = url
  })
}

export function useFeedController() {
  const pageRef = useRef(0)
  const hasMoreRef = useRef(true)
  const loadingRef = useRef(false)

  const loadedPinsRef = useRef<boolean[]>([])
  const allPinsRef = useRef<Pin[]>([])
  const paintPointerRef = useRef(0)

  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const schedulePaint = useCallback(() => {
    let newlyPaintedCount = 0

    while (
      paintPointerRef.current < loadedPinsRef.current.length &&
      loadedPinsRef.current[paintPointerRef.current]
    ) {
      allPinsRef.current[paintPointerRef.current] = {
        ...allPinsRef.current[paintPointerRef.current],
        isSkeleton: false,
      }
      paintPointerRef.current++
      newlyPaintedCount++
    }
    if (newlyPaintedCount > 0) {
      setPins([...allPinsRef.current])
    }
  }, [])

  const loadBatch = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    loadingRef.current = true
    setLoading(true)

    try {
      const response = await fetch(`/api/pins?page=${pageRef.current}`)
      const { pins: nextPins } = (await response.json()) as { pins: Pin[] }

      if (!nextPins.length) {
        hasMoreRef.current = false
        setLoading(false)
        loadingRef.current = false
        return
      }

      const offset = allPinsRef.current.length

      allPinsRef.current = [
        ...allPinsRef.current,
        ...nextPins.map((item) => ({ ...item, isSkeleton: true })),
      ]

      loadedPinsRef.current = [
        ...loadedPinsRef.current,
        ...new Array(nextPins.length).fill(false),
      ]

      setPins([...allPinsRef.current])

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
  }, [schedulePaint])

  return {
    pins,
    loading,
    loadBatch,
  }
}
