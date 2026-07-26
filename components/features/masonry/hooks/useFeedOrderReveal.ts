import { useCallback, useRef, useState } from 'react'

interface FeedOrderRevealProps {
  pins: number[]
}

export const useFeedOrderReveal = ({ pins }: FeedOrderRevealProps) => {
  const [revealedIds, setRevealedIds] = useState<Set<number>>(() => new Set())

  const paintPointerRef = useRef(0)
  const loadedPinsRef = useRef<boolean[]>([])

  const markSettled = useCallback(() => {
    const newlyPainted: number[] = []

    while (
      paintPointerRef.current < loadedPinsRef.current.length &&
      loadedPinsRef.current[paintPointerRef.current]
    ) {
      newlyPainted.push(pins[paintPointerRef.current])
      paintPointerRef.current++
    }
    if (newlyPainted.length > 0) {
      setRevealedIds((prev) => {
        const next = new Set(prev)
        for (const id of newlyPainted) {
          next.add(id)
        }
        return next
      })
    }
  }, [pins])

  const onImageSettled = useCallback(
    (idx: number) => {
      if (loadedPinsRef.current[idx]) return

      loadedPinsRef.current[idx] = true
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

  const allSettled = pins.length === 0 || revealedIds.size === pins.length

  return {
    onImageSettled,
    isPinRevealed,
    allSettled,
  }
}
