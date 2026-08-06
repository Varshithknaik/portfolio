import { useLayoutEffect, useState } from 'react'

export const useContainerMetrics = ({
  containerRef,
  gap,
  defaultColWidth = 250,
}: {
  containerRef: React.RefObject<HTMLDivElement>
  gap: number
  defaultColWidth?: number
}) => {
  const [colCount, setColCount] = useState(3)
  const [colWidth, setColWidth] = useState(defaultColWidth)
  const [hasMeasured, setHasMeasured] = useState<boolean>(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width
      const count = Math.max(
        1,
        Math.floor((containerWidth + gap) / (defaultColWidth + gap))
      )
      const width = (containerWidth - (count - 1) * gap) / count

      setColCount(count)
      setColWidth(width)
      setHasMeasured(true)
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, gap, defaultColWidth])

  return {
    colCount,
    colWidth,
    hasMeasured,
  }
}
