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

  const nodeMap: NodeMap = {
    [rootKey]: {
      type: 'root',
      key: rootKey,
      parent: null,
      children: [paragraphKey],
    },
    [paragraphKey]: {
      type: 'paragraph',
      key: paragraphKey,
      parent: rootKey,
      children: ['t-empty', 't-1', 't-2', 't-3'],
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
      marks: ['bold'],
    },
    't-3': {
      type: 'text',
      key: 't-3',
      parent: paragraphKey,
      text: ' people',
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
