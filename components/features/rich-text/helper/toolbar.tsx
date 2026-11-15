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
  TextNode,
} from '../type/schema'
import { Format, hasFormat, isElementNode, isTextNode } from './nodeUtils'

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

  return false
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
