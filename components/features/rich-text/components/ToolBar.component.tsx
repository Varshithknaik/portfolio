import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from 'react-icons/md'
import { EditorState, Transaction } from '../type/schema'
import { isTextNode } from '../helper/nodeUtils'
import { Dispatch } from 'react'

interface IToolBarBtn {
  isSelected: boolean
  onSelect: () => void
  children: React.ReactNode
}

const ToolBarBtn = ({ isSelected, onSelect, children }: IToolBarBtn) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-2 rounded-ui transition-colors text-lg ${
        isSelected
          ? 'bg-[var(--color-accent-soft)] text-accent font-semibold'
          : 'text-muted hover:text-[var(--color-text)] hover:bg-[var(--color-accent-soft)]'
      }`}
    >
      {children}
    </button>
  )
}

interface ITextEditorToolBar {
  state: EditorState
  dispatch: Dispatch<Transaction>
}

export function ToolBar({ state, dispatch }: ITextEditorToolBar) {
  // just include for the carat selection and bold only
  const selection = state.selection

  // get mark for the anchor Node
  const anchorNodeKey = selection?.anchorNode?.key

  let isBold = false
  let isItalic = false
  let isUnderline = false

  if (anchorNodeKey && isTextNode(state.nodeMap[anchorNodeKey])) {
    const anchorNode = state.nodeMap[anchorNodeKey]
    isBold = anchorNode.marks.some((m) => m === 'bold')
    isItalic = anchorNode.marks.some((m) => m === 'italic')
    isUnderline = anchorNode.marks.some((m) => m === 'underline')
  }

  return (
    <section className="flex gap-2">
      <ToolBarBtn
        isSelected={!!isBold}
        onSelect={() => {
          if (!anchorNodeKey) return
          dispatch({
            type: 'toggleMark',
            mark: 'bold',
            targetNodeKey: anchorNodeKey,
            origin: 'toolbar',
          })
        }}
      >
        <MdFormatBold />
      </ToolBarBtn>
      <ToolBarBtn isSelected={!!isItalic} onSelect={() => {}}>
        <MdFormatItalic />
      </ToolBarBtn>
      <ToolBarBtn isSelected={!!isUnderline} onSelect={() => {}}>
        <MdFormatUnderlined />
      </ToolBarBtn>
    </section>
  )
}
