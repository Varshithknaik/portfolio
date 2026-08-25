'use client'

import { useEffect, useRef, useState } from 'react'
import { createEmptyState, isElementNode } from './helper/nodeUtils'
import { EditorState } from './type/schema'
import { NodeRenderer } from './components/NodeRenderer'
import { normalizeDocument } from './helper/normalizer'
import { useSelection } from './hooks/useSelection'

export function RichTextEditorStarter() {
  const [state, setState] = useState<EditorState>(() =>
    normalizeDocument(createEmptyState())
  )

  const once = normalizeDocument(state)
  const twice = normalizeDocument(once)

  console.assert(
    JSON.stringify(once) === JSON.stringify(twice),
    'Normalization failed: the function is not idempotent!',
    { once, twice }
  )

  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleBeforeInput = (event: Event) => {
      console.log(event)
    }
    editor.addEventListener('beforeinput', handleBeforeInput, {
      passive: false,
    })

    return () => {
      editor.removeEventListener('beforeinput', handleBeforeInput)
    }
  }, [])

  useSelection({
    editorElement: editorRef,
    state,
    setState,
  })

  const root = state.nodeMap[state.rootKey]

  if (!isElementNode(root)) {
    throw new Error('Root is not an element node')
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onBeforeInput={(e) => {
        e.preventDefault()
      }}
      className="surface-card p-3 md:p-5  max-w-none text-black dark:text-white focus:outline-none"
    >
      {root.children.map((childKey) => {
        const node = state.nodeMap[childKey]
        if (!node) {
          throw new Error('Node not found in map')
        }
        return <NodeRenderer key={node.key} state={state} nodeKey={node.key} />
      })}
    </div>
  )
}
