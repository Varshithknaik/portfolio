import {
  EditorNode,
  EditorState,
  ElementNode,
  EditorNodeMap,
  RootNode,
  TextNode,
} from '../type/schema'

export const Format = {
  Bold: 1 << 0,
  Italic: 1 << 1,
  Underline: 1 << 2,
} as const

// Can't use the crypto.randomUUID() on initial render as it cause the hydration error
export const createInitState = (): EditorState => {
  const rootKey = 'root-key'
  const paragraphKey = 'paragraph-key'
  const paragraphKey2 = 'paragraph-key-2'
  const paragraphKey3 = 'p-1'
  const nodes: EditorNodeMap = new Map<NodeKey, EditorNode>([
    [
      rootKey,
      {
        type: 'element',
        kind: 'root',
        key: rootKey,
        parent: null,
        children: [paragraphKey, paragraphKey2, paragraphKey3],
      },
    ],
    [
      paragraphKey,
      {
        type: 'element',
        kind: 'paragraph',
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
        format: Format.Bold,
      },
    ],
    [
      't-2',
      {
        type: 'text',
        key: 't-2',
        parent: paragraphKey,
        text: 'world',
        format: 0,
      },
    ],
    [
      't-3',
      {
        type: 'text',
        key: 't-3',
        parent: paragraphKey,
        text: ' people',
        format: Format.Italic,
      },
    ],
    [
      paragraphKey2,
      {
        type: 'element',
        kind: 'paragraph',
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
        format: Format.Italic,
      },
    ],
    [
      paragraphKey3,
      {
        type: 'element',
        kind: 'paragraph',
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
        format: Format.Bold,
      },
    ],
    [
      't-5',
      {
        type: 'text',
        key: 't-5',
        parent: paragraphKey3,
        text: 'world from different paragraph',
        format: 0,
      },
    ],
  ])
  return {
    nodes,
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

export const isTextNode = (node: EditorNode): node is TextNode => {
  return node.type === 'text'
}

const MARK_ORDER: Record<string, number> = {
  bold: 0,
  italic: 1,
  underline: 2,
  link: 3,
}

function markKey(m: Mark): string {
  return typeof m === 'string' ? m : `${m.type}:${m.href}`
}

function makeSortValue(m: Mark): number {
  const type = typeof m === 'string' ? m : m.type
  return MARK_ORDER[type] ?? 99
}

export function canonicalizeMarks(marks: Mark[]): Mark[] {
  const seen = new Set<string>()

  return marks
    .filter((m) => {
      const k = markKey(m)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .sort((a, b) => makeSortValue(a) - makeSortValue(b))
}

export function sameMarks(a: Mark[], b: Mark[]): boolean {
  if (a.length !== b.length) return false
  return a.every((m, i) => markKey(m) === markKey(b[i]))
}

export const createKey = (prefix: string) => `${prefix}-${crypto.randomUUID()}`
