export type Pin = {
  id: number
  alt: string
  height: number
  url: string
  isSkeleton?: boolean
}

export type LayoutPin = Pin & {
  left: number
  top: number
  width: number
}

type ContainerMetrics = {
  columnCount: number
  columnWidth: number
  gap: number
}

export function calculateMasonryLayout(
  items: readonly Pin[],
  metrics: ContainerMetrics
) {
  const { columnCount, columnWidth, gap } = metrics
  const columnHeights = new Array(columnCount).fill(0)

  const layoutPins: LayoutPin[] = []

  for (const item of items) {
    const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))
    const left = shortestColumn * (columnWidth + gap)
    const top = columnHeights[shortestColumn]

    layoutPins.push({
      ...item,
      left,
      top,
      width: columnWidth,
    })

    columnHeights[shortestColumn] += item.height + gap
  }

  const totalHeight = Math.max(...columnHeights) - gap

  return { pins: layoutPins, columnHeights, totalHeight }
}
