import { Dispatch, SetStateAction, useEffect, useLayoutEffect } from 'react'
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
  useEffect(() => {
    const editor = editorElement?.current
    if (!editor) return

    const handleSelection = () => {
      const nextSelection = domToEditorSelection(editor, state)

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
  }, [editorElement, setState, state])

  useLayoutEffect(() => {
    const editor = editorElement?.current
    if (!editor) return

    editorSelectionToDom(editor, state.selection)
  }, [editorElement, state.selection])
}
