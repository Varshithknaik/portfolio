import {
  EditorNode,
  EditorState,
  ElementNode,
  EditorNodeMap,
  RootNode,
  TextNode,
  NodeKey,
} from '../type/schema'

export const Format = {
  NONE: 0,
  BOLD: 1 << 0,
  ITALIC: 1 << 1,
  UNDERLINE: 1 << 2,
} as const

// Can't use the crypto.randomUUID() on initial render as it cause the hydration error
export const createInitState = (): EditorState => {
  const rootKey = 'root-key'
  const paragraphKey = 'paragraph-key'
  const paragraphKey2 = 'paragraph-key-2'
  const paragraphKey3 = 'p-1'
  const nodeMap: EditorNodeMap = new Map<NodeKey, EditorNode>([
    [
      rootKey,
      {
        type: 'root',
        key: rootKey,
        parent: null,
        children: [paragraphKey, paragraphKey2, paragraphKey3],
      },
    ],
    [
      paragraphKey,
      {
        type: 'paragraph',
        key: paragraphKey,
        parent: rootKey,
        children: ['t-1', 't-2', 't-3'],
      },
    ],
    [
      't-1',
      {
        type: 'text',
        key: 't-1',
        parent: paragraphKey,
        text: 'Hello ',
        format: Format.BOLD,
      },
    ],
    [
      't-2',
      {
        type: 'text',
        key: 't-2',
        parent: paragraphKey,
        text: 'world',
        format: Format.NONE,
      },
    ],
    [
      't-3',
      {
        type: 'text',
        key: 't-3',
        parent: paragraphKey,
        text: ' people',
        format: Format.ITALIC,
      },
    ],
    [
      paragraphKey2,
      {
        type: 'paragraph',
        key: paragraphKey2,
        parent: rootKey,
        children: ['t-1-2'],
      },
    ],
    [
      't-1-2',
      {
        type: 'text',
        key: 't-1-2',
        parent: paragraphKey2,
        text: 'Varshith from different paragraph',
        format: Format.ITALIC,
      },
    ],
    [
      paragraphKey3,
      {
        type: 'paragraph',
        key: paragraphKey3,
        parent: rootKey,
        children: ['t-4', 't-5'],
      },
    ],
    [
      't-4',
      {
        type: 'text',
        key: 't-4',
        parent: paragraphKey3,
        text: 'Hello ',
        format: Format.BOLD,
      },
    ],
    [
      't-5',
      {
        type: 'text',
        key: 't-5',
        parent: paragraphKey3,
        text: 'world from different paragraph',
        format: Format.NONE,
      },
    ],
  ])
  return {
    nodeMap,
    rootNodeKey: rootKey,
    selection: null,
  }
}

export const isElementNode = (node: EditorNode): node is ElementNode => {
  return 'children' in node
}

export const isRootNode = (node: EditorNode): node is RootNode => {
  return node.type === 'root'
}

export const isTextNode = (
  node: EditorNode | undefined | null
): node is TextNode => {
  return node?.type === 'text'
}

export const hasFormat = (format: number, flag: number) => {
  return (format & flag) !== 0
}

export const toggleFormat = (format: number, flag: number) => {
  return format ^ flag
}

export const addFormat = (format: number, flag: number) => {
  return format | flag
}

export const removeFormat = (format: number, flag: number) => {
  return format & ~flag
}

export function isSameFormat(a: number, b: number): boolean {
  return a === b
}

export const createKey = (prefix: string) => `${prefix}-${crypto.randomUUID()}`
