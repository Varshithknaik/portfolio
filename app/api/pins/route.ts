type Pin = {
  id: number
  url: string
  alt: string
  height: number
}

const PAGE_SIZE = 20
const heights = [256, 340, 284, 410, 312, 468, 376, 292, 430, 350]

const pins: Pin[] = Array.from({ length: 1000 }, (_, index) => {
  const height = heights[index % heights.length] + ((index * 17) % 46)

  return {
    id: index,
    url: `https://picsum.photos/400/${height}?random=${index}`,
    alt: `Pinterest feed image ${index}`,
    height,
  }
})

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get('page') ?? '0', 10)
  const start = page * PAGE_SIZE
  const end = start + PAGE_SIZE

  return Response.json({
    pins: pins.slice(start, end),
  })
}
