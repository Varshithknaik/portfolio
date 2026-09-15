import {
  EditorSelection,
  EditorState,
  NodeKey,
  NodeMap,
  TextNode,
} from '../type/schema'
import {
  canonicalizeMarks,
  createKey,
  isElementNode,
  isRootNode,
  isTextNode,
  sameMarks,
} from './nodeUtils'

export const createCaretSelection = (
  node: TextNode,
  offset: number
): EditorSelection => {
  return {
    anchorNode: node,
    anchorOffset: offset,
    focusNode: node,
    focusOffset: offset,
    type: 'caret',
  }
}

const removeNodeAndDescendents = (nodeMap: NodeMap, nodeKey: NodeKey) => {
  const node = nodeMap[nodeKey]
  if (!node) return

  if (isElementNode(node)) {
    for (const childKey of node.children) {
      removeNodeAndDescendents(nodeMap, childKey)
    }
  }

  delete nodeMap[nodeKey]
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
    const child = nextMap[childKey]

    if (!child) continue

    if (child.type === 'root') {
      throw new Error('Root node should not be a child of any node')
    }

    if (!isTextNode(child)) {
      removeNodeAndDescendents(nextMap, childKey)
      continue
    }

    if (child.text.length === 0) {
      removeNodeAndDescendents(nextMap, childKey)
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

  if (normalizedChildren.length === 0) {
    const textKey = createKey('text')
    nextMap[textKey] = {
      type: 'text',
      key: textKey,
      parent: parentKey,
      text: '',
      marks: [],
    }
    normalizedChildren.push(textKey)
    nextMap[parentKey] = {
      ...parent,
      children: normalizedChildren,
    }
    return nextMap
  }

  nextMap[parentKey] = {
    ...parent,
    children: normalizedChildren,
  }

  return nextMap
}

export function normalizeDocument(state: EditorState): EditorState {
  const { nodeMap, rootKey } = state
  const root = nodeMap[rootKey]
  if (!isRootNode(root)) {
    throw new Error('Root node is not an element node')
  }

  let nextMap: NodeMap = { ...nodeMap }
  const rootChildren = root.children.filter((key) => {
    return !!nodeMap[key]
  })
  // rapair logic
  if (rootChildren.length === 0) {
    const paragraphKey = createKey('paragraph')
    nextMap[paragraphKey] = {
      type: 'paragraph',
      key: paragraphKey,
      parent: rootKey,
      children: [],
    }
    rootChildren.push(paragraphKey)
  }

  nextMap[rootKey] = { ...root, children: rootChildren }

  // normalize the text node
  for (const childKey of rootChildren) {
    const child = nextMap[childKey]
    if (!child) continue

    if (child.type === 'root') {
      throw new Error('Root node should not be a child of any node')
    }

    nextMap[childKey] = {
      ...child,
      parent: rootKey,
    }

    if (isElementNode(child)) {
      const newMap = normalizeTextChildren(nextMap, childKey)
      nextMap = newMap
    }
  }

  return { ...state, nodeMap: nextMap }
}

function getSurvivingNodeText(
  nodeMap: NodeMap,
  nodeKey: NodeKey | undefined,
  offset: number
) {
  if (!nodeKey) return null
  const node = nodeMap[nodeKey]
  if (!node || !isTextNode(node)) return null

  return {
    node,
    offset: Math.min(offset, node.text.length),
  }
}

export function findFallbackTextPoint(
  before: EditorState,
  after: EditorState,
  key: NodeKey
): { node: TextNode; offset: number } | null {
  const oldNode = before.nodeMap[key]
  if (!oldNode || !oldNode.parent) return null

  const oldParent = before.nodeMap[oldNode.parent]
  const newParent = after.nodeMap[oldNode.parent]

  if (
    !oldParent ||
    !newParent ||
    !isElementNode(oldParent) ||
    !isElementNode(newParent)
  ) {
    return null
  }

  const oldIndex = oldParent.children.indexOf(key)
  if (oldIndex < 0) return null

  for (let idx = oldIndex - 1; idx >= 0; idx--) {
    const previous = after.nodeMap[oldParent.children[idx]]
    if (previous && isTextNode(previous)) {
      return {
        node: previous,
        offset: previous.text.length,
      }
    }
  }
  for (let idx = oldIndex + 1; idx < oldParent.children.length; idx++) {
    const next = after.nodeMap[oldParent.children[idx]]
    if (next && isTextNode(next)) {
      return {
        node: next,
        offset: 0,
      }
    }
  }

  for (const child of newParent.children) {
    const node = after.nodeMap[child]
    if (node && isTextNode(node)) {
      return {
        node: node,
        offset: 0,
      }
    }
  }
  return null
}

export function remapSelectionAfterNormalization(
  before: EditorState,
  after: EditorState
): EditorState {
  if (!before.selection) return after

  //check if anchorNode Survived
  const anchor = getSurvivingNodeText(
    after.nodeMap,
    before.selection.anchorNode?.key,
    before.selection.anchorOffset
  )

  const focus = getSurvivingNodeText(
    after.nodeMap,
    before.selection.focusNode?.key,
    before.selection.focusOffset
  )

  if (anchor && focus) {
    return {
      ...after,
      selection: {
        type: before.selection.type,
        anchorNode: anchor.node,
        focusNode: focus.node,
        anchorOffset: anchor.offset,
        focusOffset: focus.offset,
      },
    }
  }

  const survivingNode = anchor ?? focus

  if (survivingNode) {
    return {
      ...after,
      selection: {
        type: 'caret',
        anchorNode: survivingNode.node,
        focusNode: survivingNode.node,
        anchorOffset: survivingNode.offset,
        focusOffset: survivingNode.offset,
      },
    }
  }

  const selectedKey = before.selection.anchorNode?.key
  const fallback = selectedKey
    ? findFallbackTextPoint(before, after, selectedKey)
    : null

  return {
    ...after,
    selection: fallback
      ? createCaretSelection(fallback.node, fallback.offset)
      : null,
  }
}
