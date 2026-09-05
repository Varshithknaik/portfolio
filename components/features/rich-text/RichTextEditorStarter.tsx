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
  const periodKeyPressed = useRef<boolean>(false)

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    console.log({
      key: JSON.stringify(event.key),
      code: event.code,
    })
    const isModifier = event.metaKey || event.ctrlKey
    const key = event.key.toLowerCase()

    if (event.code.toLowerCase() === 'period') {
      periodKeyPressed.current = true
    }

    if (isModifier && ['b', 'i', 'u', 'z', 'k', 'd', 'x', 'v'].includes(key)) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleBeforeInput = (event: InputEvent) => {
      console.log({
        inputType: event.inputType,
        data: JSON.stringify(event.data),
        isComposing: event.isComposing,
      })

      const isDoubleSpacePeriod =
        (event.inputType === 'insertText' ||
          event.inputType === 'insertReplacementText') &&
        (event.data === '. ' ||
          (event.data?.trim() === '.' && !periodKeyPressed.current))

      if (
        event.inputType !== 'insertText' &&
        event.inputType !== 'deleteContentBackward' &&
        event.inputType !== 'insertReplacementText'
      ) {
        return
      }

      event.preventDefault()

      periodKeyPressed.current = false

      const insertData = isDoubleSpacePeriod ? ' ' : (event.data ?? '')

      const transaction: Transaction = {
        type:
          event.inputType === 'deleteContentBackward'
            ? 'deleteText'
            : 'insertText',
        text: event.inputType === 'deleteContentBackward' ? '' : insertData,
        origin: 'keyboard',
      }

      const result = applyTransaction(state, transaction)

      if (!result) {
        event.preventDefault()
        return
      }

      setState((prev) => ({
        ...prev,
        nodeMap: result.nodeMap,
        selection: result.selection,
      }))
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
      autoCorrect="off"
      spellCheck={false}
      autoCapitalize="off"
      data-gramm="false"
      onKeyDown={handleKeyDown}
      className="surface-card p-3 md:p-5  max-w-none text-black dark:text-white focus:outline-none whitespace-pre-wrap"
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
