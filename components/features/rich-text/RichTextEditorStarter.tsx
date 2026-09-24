'use client'

import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { createInitState, isElementNode } from './helper/nodeUtils'
import { EditorState, Transaction } from './type/schema'
import { NodeRenderer } from './components/NodeRenderer'
import { normalizeDocument } from './helper/normalizer'
import { useSelection } from './hooks/useSelection'
import { applyTransaction } from './helper/transaction'
import { ToolBar } from './components/ToolBar.component'

export function RichTextEditorStarter() {
  const [state, setState] = useState<EditorState>(() =>
    normalizeDocument(createInitState())
  )
  const editorRef = useRef<HTMLDivElement>(null)
  const latestStateRef = useRef(state)

  useEffect(() => {
    latestStateRef.current = state
  }, [state])

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const isModifier = event.metaKey || event.ctrlKey
    const key = event.key.toLowerCase()

    if (isModifier && ['b', 'i', 'u', 'z', 'k', 'd', 'x', 'v'].includes(key)) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleBeforeInput = (event: InputEvent) => {
      if (
        event.inputType !== 'insertText' &&
        event.inputType !== 'deleteContentBackward' &&
        event.inputType !== 'insertReplacementText'
      ) {
        return
      }

      const insertData = event.data ?? ''

      const transaction: Transaction = {
        type:
          event.inputType === 'deleteContentBackward'
            ? 'deleteText'
            : 'insertText',
        text: event.inputType === 'deleteContentBackward' ? '' : insertData,
        origin: 'keyboard',
      }

      const newState = applyTransaction(latestStateRef.current, transaction)

      if (!newState) return

      event.preventDefault()

      setState(newState)
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
      onClick={() => editorRef.current?.focus()}
      className="surface-card rounded-ui flex flex-col transition-all duration-150 cursor-text overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-b border-line/50 px-2.5 py-1.5 flex items-center gap-1 bg-[var(--color-bg)]/50 backdrop-blur-sm"
      >
        <ToolBar />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        autoCorrect="off"
        spellCheck={false}
        autoCapitalize="off"
        data-gramm="false"
        onKeyDown={handleKeyDown}
        className="p-3 md:p-4 min-h-[7rem] max-w-none text-black dark:text-white focus:outline-none whitespace-pre-wrap flex-1"
      >
        {root.children.map((childKey) => {
          const node = state.nodeMap[childKey]
          if (!node) throw new Error('Node not found in map')
          return (
            <NodeRenderer key={node.key} state={state} nodeKey={node.key} />
          )
        })}
      </div>
    </div>
  )
}
