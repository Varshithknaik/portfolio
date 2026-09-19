import {
  EditorNode,
  EditorState,
  ElementNode,
  Mark,
  NodeMap,
  RootNode,
  TextNode,
} from '../type/schema'

// Can't use the crypto.randomUUID() on initial render as it cause the hydration error
export const createInitState = (): EditorState => {
  const rootKey = 'root-key'
  const paragraphKey = 'paragraph-key'
  const paragraphKey2 = 'paragraph-key-2'

  const nodeMap: NodeMap = {
    [rootKey]: {
      type: 'root',
      key: rootKey,
      parent: null,
      children: [paragraphKey, paragraphKey2, 'p-1'],
    },
    [paragraphKey]: {
      type: 'paragraph',
      key: paragraphKey,
      parent: rootKey,
      children: ['t-empty', 't-1', 't-2', 't-3'],
    },
    [paragraphKey2]: {
      type: 'paragraph',
      key: paragraphKey2,
      parent: rootKey,
      children: ['t-1-2'],
    },
    't-empty': {
      type: 'text',
      key: 't-empty',
      parent: paragraphKey,
      text: '',
      marks: [],
    },
    't-1': {
      type: 'text',
      key: 't-1',
      parent: paragraphKey,
      text: 'Hello ',
      marks: ['bold'],
    },
    't-2': {
      type: 'text',
      key: 't-2',
      parent: paragraphKey,
      text: 'world',
      marks: [],
    },
    'p-1': {
      type: 'paragraph',
      key: 'p-1',
      parent: paragraphKey,
      children: ['t-4', 't-5'],
    },
    't-4': {
      type: 'text',
      key: 't-4',
      parent: 'p-1',
      text: 'Hello ',
      marks: ['bold'],
    },
    't-5': {
      type: 'text',
      key: 't-5',
      parent: 'p-1',
      text: 'world from diffrent paragraph',
      marks: [],
    },
    't-3': {
      type: 'text',
      key: 't-3',
      parent: paragraphKey,
      text: ' people',
      marks: ['italic'],
    },
    't-1-2': {
      type: 'text',
      key: 't-1-2',
      parent: paragraphKey2,
      text: 'Varshith from diffrent paragraph',
      marks: ['italic'],
    },
  }

  return {
    nodeMap,
    rootKey: rootKey,
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
