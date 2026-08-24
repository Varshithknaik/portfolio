import {
  EditorNode,
  EditorState,
  ElementNode,
  Mark,
  NodeKey,
  NodeMap,
  RootNode,
  TextNode,
} from '../type/schema'

// Can't use the crypto.randomUUID() on initial render as it cause the hydration error
export const createEmptyState = (): EditorState => {
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
      children: [],
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

function canonicalizeMarks(marks: Mark[]): Mark[] {
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

function sameMarks(a: Mark[], b: Mark[]): boolean {
  if (a.length !== b.length) return false
  return a.every((m, i) => markKey(m) === markKey(b[i]))
}

export function normalizeTextChildren(
  nodeMap: NodeMap,
  parentKey: NodeKey
): NodeMap {
  const parent = nodeMap[parentKey]
  if (!parent || !isElementNode(parent)) return nodeMap

  const nextMap: NodeMap = { ...nodeMap }
  const normalizedChildren: NodeKey[] = []

  for (const childKey of parent.children) {
    const child = nodeMap[childKey]

    if (!child) continue

    if (child.type === 'root') {
      throw new Error('Root node should not be a child of any node')
    }

    // Preserve the invalid text nodes
    if (!isTextNode(child)) {
      nextMap[childKey] = {
        ...child,
        parent: parentKey,
      }
      normalizedChildren.push(childKey)
      continue
    }

    if (child.text.length === 0) {
      delete nextMap[childKey]
      continue
    }

    const normalizedChild: TextNode = {
      ...child,
      parent: parentKey,
      marks: canonicalizeMarks(child.marks),
    }

    nextMap[childKey] = normalizedChild

    // Now check if previous is same
    const prevKey = normalizedChildren.at(-1)
    const previous = prevKey ? nextMap[prevKey] : undefined

    if (
      prevKey &&
      previous &&
      isTextNode(previous) &&
      sameMarks(normalizedChild.marks, previous.marks)
    ) {
      // Merge the two text nodes
      const mergedText: TextNode = {
        ...previous,
        text: previous.text + normalizedChild.text,
      }

      nextMap[prevKey] = mergedText

      // Remove the current node
      delete nextMap[childKey]
    } else {
      normalizedChildren.push(childKey)
    }
  }

  nextMap[parentKey] = {
    ...parent,
    children: normalizedChildren,
  }

  return nextMap
}
