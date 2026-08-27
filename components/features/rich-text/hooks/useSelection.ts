import { Dispatch, SetStateAction, useEffect } from 'react'
import { EditorState } from '../type/schema'

interface UseSelectionInterface {
  editorElement: React.RefObject<HTMLDivElement>
  state: EditorState
  setState: Dispatch<SetStateAction<EditorState>>
}

const getEditorLeaf = (node: Node | null): HTMLElement | null => {
  if (!node) return null

  const element: Node | null =
    node.nodeType === Node.TEXT_NODE ? node.parentElement : node

  if (!element || !(element instanceof HTMLElement)) return null
  return element.closest<HTMLElement>('[data-editor-leaf]')
}

const domToEditorSelection = (
  editorElement: HTMLDivElement,
  state: EditorState
) => {
  const selection = window.getSelection()

  if (!selection) return

  const isInsidetheEditor =
    editorElement.contains(selection?.anchorNode) &&
    editorElement.contains(selection?.focusNode)
  if (!isInsidetheEditor) return

  const nearestAnchoreNode = getEditorLeaf(selection?.anchorNode)
  const nearestFocusNode = getEditorLeaf(selection?.focusNode)

  const anchorNodeKey = nearestAnchoreNode?.getAttribute('data-node-key')
  const focusNodeKey = nearestFocusNode?.getAttribute('data-node-key')

  return {
    anchorNode: anchorNodeKey ? state.nodeMap[anchorNodeKey] : null,
    anchorOffset: selection.anchorOffset,
    focusNode: focusNodeKey ? state.nodeMap[focusNodeKey] : null,
    focusOffset: selection.focusOffset,
    type: (selection.type as 'caret' | 'range') ?? 'caret',
  }
}

export const useSelection = ({
  editorElement,
  state,
  setState,
}: UseSelectionInterface) => {
  useEffect(() => {
    const editor = editorElement?.current
    if (!editor) return

    const handleSelection = () => {
      const nextSelection = domToEditorSelection(editor, state)

      if (!nextSelection) return

      setState((prev) => ({ ...prev, selection: nextSelection }))
    }

    document.addEventListener('selectionchange', handleSelection)

    return () => {
      document.removeEventListener('selectionchange', handleSelection)
    }
  }, [editorElement, setState, state])
}
