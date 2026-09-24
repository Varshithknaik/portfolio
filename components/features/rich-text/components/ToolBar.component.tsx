import { MdFormatBold } from 'react-icons/md'

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

export function ToolBar() {
  return (
    <section>
      <ToolBarBtn isSelected={false} onSelect={() => {}}>
        <MdFormatBold />
      </ToolBarBtn>
      <div></div>
    </section>
  )
}
