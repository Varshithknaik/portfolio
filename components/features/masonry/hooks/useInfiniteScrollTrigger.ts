import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollTriggerProps {
  enabled: boolean
  targetRef: React.RefObject<Element>
  canTrigger: boolean
  rootMargin?: string
  onIntersect: () => void
}

export const useInfiniteScrollTrigger = ({
  targetRef,
  enabled,
  rootMargin = '0px',
  canTrigger,
  onIntersect,
}: UseInfiniteScrollTriggerProps) => {
  const isIntersectingRef = useRef(false)
  const canTriggerRef = useRef(canTrigger)
  const onTriggerRef = useRef(onIntersect)

  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    onTriggerRef.current = onIntersect
  }, [onIntersect])

  const attemptTrigger = useCallback(() => {
    if (!canTriggerRef.current) return
    if (!isIntersectingRef.current) return
    if (hasTriggeredRef.current) return

    void onTriggerRef.current()
  }, [])

  //
  useEffect(() => {
    canTriggerRef.current = canTrigger

    if (!enabled || !canTrigger) {
      hasTriggeredRef.current = false
      return
    }

    void attemptTrigger()
  }, [attemptTrigger, canTrigger, enabled])

  useEffect(() => {
    if (!enabled) return

    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting

        if (!entry.isIntersecting) {
          hasTriggeredRef.current = false
          return
        }

        void attemptTrigger()
      },
      { rootMargin }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
      isIntersectingRef.current = false
      hasTriggeredRef.current = false
    }
  }, [attemptTrigger, enabled, rootMargin, targetRef])
}
