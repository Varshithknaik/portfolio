import { useCallback, useRef, useState } from 'react'
import { Pin } from '../helper/MasonryLayoutEngine'

export type FeedPhase = 'idle' | 'fetching' | 'error' | 'exhausted'

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
  const pinIdsRef = useRef(new Set<number>())

  const [pins, setPins] = useState<Pin[]>([])
  const [currentBatchIds, setCurrentBatchIds] = useState<number[]>([])
  const [phase, setPhase] = useState<FeedPhase>('idle')
  const [hasMore, setHasMore] = useState<boolean>(true)

  const loadBatch = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    loadingRef.current = true
    setPhase('fetching')

    try {
      const response = await fetch(`/api/pins?page=${pageRef.current}`)
      const { pins: nextPins } = (await response.json()) as { pins: Pin[] }

      const batchIds = new Set<number>()
      const acceptedPins: Pin[] = []

      for (const pin of nextPins) {
        const validHeight = Number.isFinite(pin.height) && pin.height > 0

        if (!validHeight) throw new Error('Invalid pin height')

        if (pinIdsRef.current.has(pin.id) || batchIds.has(pin.id)) {
          throw new Error(`Duplicate pin ID: ${pin.id}`)
        }

        batchIds.add(pin.id)
        acceptedPins.push(pin)
      }

      for (const id of batchIds) {
        pinIdsRef.current.add(id)
      }

      if (!acceptedPins.length) {
        hasMoreRef.current = false
        loadingRef.current = false
        setPhase('exhausted')
        setHasMore(false)
        return
      }

      setHasMore(true)
      setCurrentBatchIds(acceptedPins.map((pin) => pin.id))
      setPins((prev) => [...prev, ...acceptedPins])

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
    currentBatchIds,
    phase,
    hasMore,
    loadBatch,
  }
}
