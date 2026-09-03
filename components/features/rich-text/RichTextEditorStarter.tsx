'use client'

import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { createInitState, isElementNode } from './helper/nodeUtils'
import { EditorState, Transaction } from './type/schema'
import { NodeRenderer } from './components/NodeRenderer'
import { normalizeDocument } from './helper/normalizer'
import { useSelection } from './hooks/useSelection'
import { applyTransaction } from './helper/transaction'

export function RichTextEditorStarter() {
  const [state, setState] = useState<EditorState>(() =>
    normalizeDocument(createInitState())
  )
  const editorRef = useRef<HTMLDivElement>(null)

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const isModifier = event.metaKey || event.ctrlKey
    const key = event.key.toLowerCase()

    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      (isModifier && ['b', 'i', 'u', 'z', 'k', 'd', 'x', 'v'].includes(key))
    ) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleBeforeInput = (event: InputEvent) => {
      if (event.inputType === 'insertText') {
        const transaction: Transaction = {
          type: 'insertText',
          text: event.data ?? '',
          origin: 'keyboard',
        }

        const result = applyTransaction(state, transaction)
        if (!result) {
          event.preventDefault()
          return
        }

        setState((prev) => ({
          ...prev,
          nodeMap: result?.nodeMap ?? prev.nodeMap,
          selection: result?.selection ?? prev.selection,
        }))
      } else {
        return
      }

      event.stopPropagation()
    }
    editor.addEventListener('beforeinput', handleBeforeInput, {
      passive: false,
    })

    return () => {
      editor.removeEventListener('beforeinput', handleBeforeInput)
    }
  }, [state])

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
      onKeyDown={handleKeyDown}
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
