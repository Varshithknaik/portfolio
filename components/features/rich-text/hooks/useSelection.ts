import { Dispatch, SetStateAction, useEffect } from 'react'
import { EditorState } from '../type/schema'
import { domToEditorSelection } from '../helper/selectionUtils'

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

      setState((prev) => ({ ...prev, selection: nextSelection }))
    }

    document.addEventListener('selectionchange', handleSelection)

    return () => {
      document.removeEventListener('selectionchange', handleSelection)
    }
  }, [editorElement, setState, state])
}
