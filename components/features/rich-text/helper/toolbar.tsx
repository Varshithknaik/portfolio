import type { ReactNode } from 'react'
import { BiSolidParking } from 'react-icons/bi'
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from 'react-icons/md'
import { LuHeading1, LuHeading2 } from 'react-icons/lu'
import { ElementNode, TextNode } from '../type/schema'
import { isElementNode, isTextNode } from './nodeUtils'

export type ToolbarKey =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'

export type ToolbarButton = {
  key: ToolbarKey
  icon: ReactNode
  isSelected: (node: TextNode | ElementNode) => boolean
}

export const getToolbarButtons = (): ToolbarButton[] => [
  // Marks
  {
    key: 'bold',
    icon: <MdFormatBold />,
    isSelected: (node: TextNode | ElementNode) =>
      isTextNode(node) && node.marks.includes('bold'),
  },
  {
    key: 'italic',
    icon: <MdFormatItalic />,
    isSelected: (node: TextNode | ElementNode) =>
      isTextNode(node) && node.marks.includes('italic'),
  },
  {
    key: 'underline',
    icon: <MdFormatUnderlined />,
    isSelected: (node: TextNode | ElementNode) =>
      isTextNode(node) && node.marks.includes('underline'),
  },
  // Blocks
  {
    key: 'paragraph',
    icon: <BiSolidParking />,
    isSelected: (node: TextNode | ElementNode) =>
      isElementNode(node) && node.type === 'paragraph',
  },
  {
    key: 'h1',
    icon: <LuHeading1 />,
    isSelected: (node: TextNode | ElementNode) =>
      isElementNode(node) && node.type === 'heading' && node.level === 1,
  },
  {
    key: 'h2',
    icon: <LuHeading2 />,
    isSelected: (node: TextNode | ElementNode) =>
      isElementNode(node) && node.type === 'heading' && node.level === 2,
  },
]
