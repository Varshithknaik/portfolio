import { Dispatch } from 'react'
import { EditorState, Transaction } from '../type/schema'
import { getToolbarButtons, ToolbarKey } from '../helper/toolbar'

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

const buttons = getToolbarButtons()

export function ToolBar({ state, dispatch }: ITextEditorToolBar) {
  const selection = state.selection

  const anchorNodeKey = selection?.anchorNode?.key
  const offsetNodeKey = selection?.focusNode?.key

  const isSameNode = !!(anchorNodeKey && anchorNodeKey === offsetNodeKey)
  const commonNodeKey = isSameNode ? anchorNodeKey : null

  const handleToolbarButtonClick = (key: ToolbarKey) => {
    if (key === 'bold' || key === 'italic' || key === 'underline') {
      dispatch({
        type: 'toggleMark',
        mark: key,
        origin: 'toolbar',
      })
    } else if (key === 'paragraph') {
      dispatch({
        type: 'setBlockType',
        blockType: 'paragraph',
        origin: 'toolbar',
      })
    } else {
      dispatch({
        type: 'setBlockType',
        blockType: 'heading',
        level: Number(key[1]) as 1 | 2 | 3,
        origin: 'toolbar',
      })
    }
  }

  return (
    <section className="flex gap-2">
      {buttons.map((btn) => (
        <ToolBarBtn
          key={btn.key}
          isSelected={
            !!commonNodeKey && btn.isSelected(state.nodeMap[commonNodeKey])
          }
          onSelect={() => handleToolbarButtonClick(btn.key)}
        >
          {btn.icon}
        </ToolBarBtn>
      ))}
    </section>
  )
}
