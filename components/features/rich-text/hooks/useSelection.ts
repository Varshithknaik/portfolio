import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { EditorState } from '../type/schema'
import {
  domToEditorSelection,
  editorSelectionToDom,
  sameEditorSelection,
} from '../helper/selectionUtils'

interface UseSelectionInterface {
  editorElement: React.RefObject<HTMLDivElement>
  state: EditorState
  setState: Dispatch<SetStateAction<EditorState>>
}

export const useSelection = ({
  editorElement,
  state,
  setState,
}: UseSelectionInterface) => {
  const editorState = useRef<EditorState>(state)

  useLayoutEffect(() => {
    editorState.current = state
  }, [state])

  useEffect(() => {
    const editor = editorElement?.current
    if (!editor) return

    const handleSelection = () => {
      const nextSelection = domToEditorSelection(editor, editorState.current)

      if (!nextSelection) return

      setState((prev) => {
        if (sameEditorSelection(prev.selection, nextSelection)) return prev
        return { ...prev, selection: nextSelection }
      })
    }

    document.addEventListener('selectionchange', handleSelection)

    return () => {
      document.removeEventListener('selectionchange', handleSelection)
    }
  }, [editorElement, setState])

  useLayoutEffect(() => {
    const editor = editorElement?.current
    if (!editor) return

    editorSelectionToDom(editor, editorState.current.selection)
  }, [editorElement, state.selection])
}
