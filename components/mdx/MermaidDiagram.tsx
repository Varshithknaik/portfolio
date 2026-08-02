'use client'

import { useEffect, useId, useState } from 'react'

type MermaidDiagramProps = {
  chart: string
}

function readThemeColor(styles: CSSStyleDeclaration, name: string) {
  return styles.getPropertyValue(name).trim()
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId()
  const diagramId = reactId.replace(/[^a-zA-Z0-9_-]/g, '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    let renderVersion = 0

    async function renderDiagram() {
      const version = ++renderVersion

      try {
        const { default: mermaid } = await import('mermaid')
        const rootStyles = getComputedStyle(document.documentElement)
        const background = readThemeColor(rootStyles, '--color-bg')
        const panel = readThemeColor(rootStyles, '--color-panel')
        const elevated = readThemeColor(rootStyles, '--color-elevated')
        const line = readThemeColor(rootStyles, '--color-line-strong')
        const text = readThemeColor(rootStyles, '--color-text')
        const muted = readThemeColor(rootStyles, '--color-muted')
        const accent = readThemeColor(rootStyles, '--color-accent')

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          suppressErrorRendering: true,
          theme: 'base',
          themeVariables: {
            background,
            primaryColor: panel,
            primaryTextColor: text,
            primaryBorderColor: accent,
            secondaryColor: elevated,
            secondaryTextColor: text,
            secondaryBorderColor: line,
            tertiaryColor: background,
            tertiaryTextColor: text,
            tertiaryBorderColor: line,
            lineColor: muted,
            textColor: text,
            actorBkg: panel,
            actorBorder: accent,
            actorTextColor: text,
            actorLineColor: line,
            signalColor: text,
            signalTextColor: muted,
            labelBoxBkgColor: panel,
            labelBoxBorderColor: line,
            labelTextColor: text,
            noteBkgColor: elevated,
            noteBorderColor: accent,
            noteTextColor: text,
            activationBkgColor: elevated,
            activationBorderColor: accent,
            fontFamily: readThemeColor(rootStyles, '--font-body'),
          },
        })

        const result = await mermaid.render(
          `mermaid-${diagramId}-${version}`,
          chart
        )

        if (!cancelled && version === renderVersion) {
          setSvg(result.svg)
          setError(false)
        }
      } catch {
        if (!cancelled && version === renderVersion) {
          setSvg('')
          setError(true)
        }
      }
    }

    void renderDiagram()

    const themeObserver = new MutationObserver(() => {
      void renderDiagram()
    })

    themeObserver.observe(document.documentElement, {
      attributeFilter: ['data-theme'],
      attributes: true,
    })

    return () => {
      cancelled = true
      themeObserver.disconnect()
    }
  }, [chart, diagramId])

  if (error) {
    return (
      <div
        className="my-6 rounded-ui border border-line bg-panel px-4 py-3 text-sm text-muted"
        role="alert"
      >
        This diagram could not be rendered.
      </div>
    )
  }

  return (
    <div
      aria-busy={!svg}
      aria-label="Architecture diagram"
      className="my-6 min-h-40 overflow-x-auto rounded-ui border border-line bg-[var(--color-bg)] p-4 md:p-5"
      role="img"
    >
      {svg ? (
        <div
          className="min-w-[680px] [&_svg]:h-auto [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="grid min-h-32 place-items-center font-mono text-xs text-subtle">
          Rendering diagram…
        </div>
      )}
    </div>
  )
}
