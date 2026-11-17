import type { ReactNode } from 'react'
import { BiSolidParking } from 'react-icons/bi'
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from 'react-icons/md'
import { LuHeading1, LuHeading2 } from 'react-icons/lu'
import {
  EditorSelection,
  EditorState,
  ElementNode,
  NodeKey,
  TextNode,
} from '../type/schema'
import { Format, hasFormat, isElementNode, isTextNode } from './nodeUtils'
import { getPointParentKey, resolveTreeTextRange } from './textRange'

export type MarkKey = 'bold' | 'italic' | 'underline'

export type ToolbarKey = MarkKey | 'paragraph' | 'h1' | 'h2' | 'h3'

export const MARK_FORMAT_MAP: Record<MarkKey, number> = {
  bold: Format.BOLD,
  italic: Format.ITALIC,
  underline: Format.UNDERLINE,
}

export type ToolbarButton = {
  key: ToolbarKey
  icon: ReactNode
  isSelected: (state: EditorState) => boolean
}

const getSelectedTextNodes = (state: EditorState): TextNode[] => {
  const selection = state.selection

  if (!selection || selection.type === 'caret') return []

  const range = resolveTreeTextRange(state)

  if (!range) return []

  const startParentNodeKey: NodeKey = getPointParentKey(range, range.startPath)
  const endParentNodeKey: NodeKey = getPointParentKey(range, range.endPath)
  const commonAncestor = range.commonAncestor

  const startParent = state.nodeMap.get(startParentNodeKey)
  const endParent = state.nodeMap.get(endParentNodeKey)

  let keys: NodeKey[]

  if (
    !startParent ||
    !isElementNode(startParent) ||
    !endParent ||
    !isElementNode(endParent)
  )
    return []

  // Same block
  if (startParentNodeKey === endParentNodeKey) {
    keys = startParent.children.slice(range.start.index, range.end.index + 1)
  } else {
    const startBlockIndex = commonAncestor.children.indexOf(startParentNodeKey)
    const endBlockIndex = commonAncestor.children.indexOf(endParentNodeKey)

    if (startBlockIndex < 0 || endBlockIndex <= startBlockIndex) return []

    keys = [...startParent.children.slice(range.start.index)]

    for (const blockKeys of commonAncestor.children.slice(
      startBlockIndex + 1,
      endBlockIndex
    )) {
      const block = state.nodeMap.get(blockKeys)

      if (!block || !isElementNode(block)) return []

      keys.push(...block.children)
    }

    keys.push(...endParent.children.slice(0, range.end.index + 1))
  }
  return keys.map((nodeKey) => state.nodeMap.get(nodeKey)).filter(isTextNode)
}

const isMarkSelected = (state: EditorState, format: number): boolean => {
  const selection = state.selection
  if (!selection) return false

  if (selection.type === 'caret') {
    if (selection.storedFormat != null) {
      return hasFormat(selection.storedFormat, format)
    }

    const anchorNodeKey = selection.anchorNode?.key
    if (!anchorNodeKey) return false

    const node = state.nodeMap.get(anchorNodeKey)
    if (!node || !isTextNode(node)) return false

    return hasFormat(node.format, format)
  }

  const selectedTextNodes: TextNode[] = getSelectedTextNodes(state)

  return (
    selectedTextNodes.length > 0 &&
    selectedTextNodes.every((node) => hasFormat(node.format, format))
  )
}

export const getToolbarButtons = (): ToolbarButton[] => [
  // Marks
  {
    key: 'bold',
    icon: <MdFormatBold />,
    isSelected: (state: EditorState) => isMarkSelected(state, Format.BOLD),
  },
  {
    key: 'italic',
    icon: <MdFormatItalic />,
    isSelected: (state: EditorState) => isMarkSelected(state, Format.ITALIC),
  },
  {
    key: 'underline',
    icon: <MdFormatUnderlined />,
    isSelected: (state: EditorState) => isMarkSelected(state, Format.UNDERLINE),
  },
  // // Blocks
  // {
  //   key: 'paragraph',
  //   icon: <BiSolidParking />,
  //   isSelected: (state: EditorState) =>
  //     isElementNode(node) && node.type === 'paragraph',
  // },
  // {
  //   key: 'h1',
  //   icon: <LuHeading1 />,
  //   isSelected: (state: EditorState) =>
  //     isElementNode(node) && node.type === 'heading' && node.level === 1,
  // },
  // {
  //   key: 'h2',
  //   icon: <LuHeading2 />,
  //   isSelected: (state: EditorState) =>
  //     isElementNode(node) && node.type === 'heading' && node.level === 2,
  // },
]
