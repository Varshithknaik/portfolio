'use client'

import { useEffect, useState } from 'react'
import { createEmptyState, isElementNode } from './helper/nodeUtils'
import { EditorState } from './type/schema'

export function RichTextEditorStarter() {
  const [state, setState] = useState<EditorState>(() => createEmptyState())
  useEffect(() => {
    const handleBeforeInput = (event: Event) => {
      console.log(event)
    }
    window.addEventListener('beforeinput', handleBeforeInput, {
      passive: false,
    })
    return () => {
      window.removeEventListener('beforeinput', handleBeforeInput)
    }
  }, [])

  const root = state.nodeMap[state.rootKey]

  if (!isElementNode(root)) {
    throw new Error('Root is not an element node')
  }

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="surface-card p-3 md:p-5 prose prose-invert max-w-none text-black dark:text-white focus:outline-none"
    >
      {root.children.map((childKey) => {
        const node = state.nodeMap[childKey]
        if (!node) {
          throw new Error('Node not found in map')
        }
        return <div key={node.key}>{node.type}</div>
      })}
    </div>
  )
}
