const columns = [
  [
    { height: 128, src: 'https://picsum.photos/240/256?random=101' },
    { height: 176, src: 'https://picsum.photos/240/340?random=102' },
    { height: 112, src: 'https://picsum.photos/240/284?random=103' },
  ],
  [
    { height: 152, src: 'https://picsum.photos/240/410?random=104' },
    { height: 104, src: 'https://picsum.photos/240/312?random=105' },
    { height: 188, src: 'https://picsum.photos/240/468?random=106' },
  ],
  [
    { height: 96, src: 'https://picsum.photos/240/376?random=107' },
    { height: 164, src: 'https://picsum.photos/240/292?random=108' },
    { height: 132, src: 'https://picsum.photos/240/430?random=109' },
  ],
  [
    { height: 180, src: 'https://picsum.photos/240/350?random=110' },
    { height: 118, src: 'https://picsum.photos/240/390?random=111' },
    { height: 154, src: 'https://picsum.photos/240/448?random=112' },
  ],
]

const steps = [
  'ResizeObserver reads container width',
  'Column count and width are recalculated',
  'Pins are assigned to the shortest column',
  'Images decode off-thread and reveal in feed order',
  'IntersectionObserver requests the next page',
]

export function MasonrySystemPreview() {
  return (
    <div className="surface-card work-feature-preview p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <div className="work-feature-inset rounded-ui border border-line bg-[var(--color-bg)] p-3">
          <div className="grid grid-cols-4 gap-3">
            {columns.map((column, columnIndex) => (
              <div className="grid content-start gap-3" key={columnIndex}>
                {column.map((pin, pinIndex) => (
                  <div
                    className="overflow-hidden rounded-[14px] bg-panel"
                    key={`${columnIndex}-${pinIndex}`}
                    style={{ height: pin.height }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="h-full w-full object-cover opacity-80"
                      src={pin.src}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          {steps.map((step, index) => (
            <div
              className="work-feature-inset rounded-ui border border-line bg-[var(--color-bg)] p-3"
              key={step}
            >
              <p className="font-mono text-[11px] text-accent">0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
