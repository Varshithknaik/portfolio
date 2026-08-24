'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createEmptyState,
  isElementNode,
  normalizeTextChildren,
} from './helper/nodeUtils'
import { EditorState, NodeMap } from './type/schema'
import { NodeRenderer } from './components/NodeRenderer'

const mockNodeMap: NodeMap = {
  // The root node (just for context, though we won't pass this as parentKey)
  'root-1': {
    type: 'root',
    key: 'root-1',
    parent: null,
    children: ['p-1'],
  },

  // The element node we will test as the parentKey
  'p-1': {
    type: 'paragraph',
    key: 'p-1',
    parent: 'root-1',
    children: ['t-empty', 't-1', 't-2', 't-3'],
  },

  // 1. An empty text node (should be deleted by your logic)
  't-empty': {
    type: 'text',
    key: 't-empty',
    parent: 'p-1',
    text: '',
    marks: [],
  },

  // 2. A valid text node with a mark
  't-1': {
    type: 'text',
    key: 't-1',
    parent: 'p-1',
    text: 'Hello ',
    marks: ['bold'],
  },

  // 3. Another valid text node with the same mark (eventually you'll merge these!)
  't-2': {
    type: 'text',
    key: 't-2',
    parent: 'p-1',
    text: 'world',
    marks: ['bold'],
  },
  't-3': {
    type: 'text',
    key: 't-3',
    parent: 'p-1',
    text: 'varshith',
    marks: ['italic', 'underline'],
  },
}

const mockParentKey = 'p-1'

const mockState: EditorState = {
  nodeMap: mockNodeMap,
  rootKey: 'root-1',
  selection: null,
}

export function RichTextEditorStarter() {
  const [state, setState] = useState<EditorState>(() => {
    // We can directly initialize the state with the normalized map!
    const updatedMap = normalizeTextChildren(mockNodeMap, mockParentKey)
    return {
      ...mockState,
      nodeMap: updatedMap,
    }
  })

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
        console.log(e)
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
