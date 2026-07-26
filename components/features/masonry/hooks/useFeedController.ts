import { useCallback, useRef, useState } from 'react'
import { Pin } from '../helper/MasonryLayoutEngine'

export type FeedPhase =
  | 'unmeasured'
  | 'idle'
  | 'fetching'
  | 'error'
  | 'exhausted'

//@deprecated
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

  const [pins, setPins] = useState<Pin[]>([])
  const [phase, setPhase] = useState<FeedPhase>('idle')
  const [hasMore, setHasMore] = useState<boolean>(true)

  const loadBatch = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    loadingRef.current = true
    setPhase('fetching')

    try {
      const response = await fetch(`/api/pins?page=${pageRef.current}`)
      const { pins: nextPins } = (await response.json()) as { pins: Pin[] }

      if (!nextPins.length) {
        hasMoreRef.current = false
        loadingRef.current = false
        setPhase('exhausted')
        setHasMore(false)
        return
      }

      setHasMore(true)
      setPins((prev) => [...prev, ...nextPins])

      pageRef.current++
      setPhase('idle')
    } catch {
      //
      setPhase('error')
    } finally {
      loadingRef.current = false
    }
  }, [])

  return {
    pins,
    phase,
    hasMore,
    loadBatch,
  }
}
