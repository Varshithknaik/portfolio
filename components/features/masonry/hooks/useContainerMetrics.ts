import { useLayoutEffect, useState } from 'react'

const GAP = 12
const PAGE_SIZE = 20
const DEFAULT_COL_WIDTH = 300

export const useContainerMetrics = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>
}) => {
  const [colCount, setColCount] = useState(3)
  const [colWidth, setColWidth] = useState(DEFAULT_COL_WIDTH)
  const [hasMeasured, setHasMeasured] = useState<boolean>(false)

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
      setHasMeasured(true)
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef])

  return {
    colCount,
    colWidth,
    hasMeasured,
  }
}
