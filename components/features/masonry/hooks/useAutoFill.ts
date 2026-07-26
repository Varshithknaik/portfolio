import { useEffect } from 'react'
import { FeedPhase } from './useFeedController'

export const PRELOAD_DISTANCE = 1000

interface UseAutoFillProps {
  totalHeight: number
  hasMeasured: boolean
  phase: FeedPhase
  hasMore: boolean
  enabled: boolean
  loadBatch: () => void
}

export const useAutoFill = ({
  totalHeight,
  hasMeasured,
  phase,
  hasMore,
  enabled,
  loadBatch,
}: UseAutoFillProps) => {
  useEffect(() => {
    if (!hasMeasured || phase !== 'idle' || !hasMore || !enabled) return

    const fillTarget = window.innerHeight + PRELOAD_DISTANCE
    if (totalHeight >= fillTarget) return

    const frame = requestAnimationFrame(() => {
      void loadBatch()
    })

    return () => cancelAnimationFrame(frame)
  }, [enabled, hasMeasured, hasMore, loadBatch, phase, totalHeight])
}
