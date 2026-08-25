import { Dispatch, SetStateAction, useEffect } from 'react'
import { EditorState } from '../type/schema'

interface UseSelectionInterface {
  editorElement: React.RefObject<HTMLDivElement>
  state: EditorState
  setState: Dispatch<SetStateAction<EditorState>>
}

const findNearestElementNode = (
  node: Node | null,
  editorElement: HTMLDivElement
): HTMLElement | null => {
  if (!node) return null
  if (node.parentElement === editorElement) return node.parentElement
  return findNearestElementNode(node.parentElement, editorElement)
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

  const nearestAnchoreNode = findNearestElementNode(
    selection?.anchorNode,
    editorElement
  )
  const nearestFocusNode = findNearestElementNode(
    selection?.focusNode,
    editorElement
  )

  console.log(selection?.anchorNode, editorElement, 'near element')

  if (!nearestAnchoreNode || !nearestFocusNode) return

  return state.selection
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
