import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollDirection } from './useVirtualization'

interface FeedOrderRevealProps {
  pins: number[]
  activeIds: number[]
  scrollDirection: ScrollDirection
}

export const useFeedOrderReveal = ({
  pins,
  scrollDirection,
  activeIds,
}: FeedOrderRevealProps) => {
  const [revealedIds, setRevealedIds] = useState<Set<number>>(() => new Set())

  const settledIdsRef = useRef<Set<number>>(new Set())
  const [settledCount, setSettledCount] = useState(0)

  const markSettled = useCallback(() => {
    const newlyPainted: number[] = []

    const orderedIds =
      scrollDirection === 'forward' ? activeIds : [...activeIds].reverse()

    for (const pinId of orderedIds) {
      if (!settledIdsRef.current.has(pinId)) break
      newlyPainted.push(pinId)
    }

    if (newlyPainted.length === 0) return

    setRevealedIds((prev) => {
      const next = new Set(prev)
      let hasChanged = false
      for (const id of newlyPainted) {
        if (!next.has(id)) {
          next.add(id)
          hasChanged = true
        }
      }
      return hasChanged ? next : prev
    })
  }, [activeIds, scrollDirection])

  const onImageSettled = useCallback(
    (pinId: number) => {
      if (settledIdsRef.current.has(pinId)) return

      settledIdsRef.current.add(pinId)
      setSettledCount(settledIdsRef.current.size)

      markSettled()
    },
    [markSettled]
  )

  const isPinRevealed = useCallback(
    (id: number) => {
      return revealedIds.has(id)
    },
    [revealedIds]
  )

  useEffect(() => {
    queueMicrotask(() => markSettled())
  }, [activeIds, scrollDirection, settledCount, markSettled])

  const allSettled = settledCount === pins.length

  return {
    allSettled,
    onImageSettled,
    isPinRevealed,
  }
}
