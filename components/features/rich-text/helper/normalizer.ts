import {
  EditorNode,
  EditorSelection,
  EditorState,
  NodeKey,
  EditorNodeMap,
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

type LogicalPoint = {
  blockKey: NodeKey
  offset: number
}

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

export const createRangeSelection = ({
  anchorNode,
  anchorOffset,
  focusNode,
  focusOffset,
}: Omit<EditorSelection, 'type'>): EditorSelection => {
  return {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
    type: 'range',
  }
}

const removeNodeAndDescendents = (nodeMap: EditorNodeMap, nodeKey: NodeKey) => {
  const node = nodeMap.get(nodeKey)
  if (!node) return

  if (isElementNode(node)) {
    for (const childKey of node.children) {
      removeNodeAndDescendents(nodeMap, childKey)
    }
  }

  nodeMap.delete(nodeKey)
}

export function normalizeTextChildren(
  nodeMap: EditorNodeMap,
  parentKey: NodeKey
): EditorNodeMap {
  const parent = nodeMap.get(parentKey)
  if (!parent || !isElementNode(parent)) return nodeMap

  const nextMap: EditorNodeMap = new Map(nodeMap)
  const normalizedChildren: NodeKey[] = []

  for (const childKey of parent.children) {
    const child = nextMap.get(childKey)

    if (!child) continue

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

    nextMap.set(childKey, normalizedChild)

    // Now check if previous is same
    const prevKey = normalizedChildren.at(-1)
    const previous = prevKey ? nextMap.get(prevKey) : undefined

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

  let nextMap: EditorNodeMap = { ...nodeMap }
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
      nextMap = normalizeTextChildren(nextMap, childKey)
    }
  }

  return { ...state, nodeMap: nextMap }
}

function getSurvivingNodeText(
  nodeMap: EditorNodeMap,
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

function captureBlockOffset(
  before: EditorState,
  anchorNode: EditorNode | null,
  anchorOffset: number
): LogicalPoint | null {
  if (!anchorNode || !isTextNode(anchorNode)) {
    return null
  }

  const parentKey = anchorNode.parent
  if (!parentKey) return null

  const parentNode = before.nodeMap[parentKey]
  if (!parentNode || !isElementNode(parentNode)) return null

  const index = parentNode.children.indexOf(anchorNode.key)

  let offset = 0

  for (let idx = index - 1; idx >= 0; idx--) {
    const previous = before.nodeMap[parentNode.children[idx]]
    if (previous && isTextNode(previous)) {
      offset += previous.text.length
    }
  }

  return {
    blockKey: parentKey,
    offset: offset + anchorOffset,
  }
}

function resolveBlockOffset(
  after: EditorState,
  logicalPoint: LogicalPoint
): { node: TextNode; offset: number } | null {
  const blockKey = after.nodeMap[logicalPoint.blockKey]
  if (!blockKey || !isElementNode(blockKey)) return null

  let remainingOffset = logicalPoint.offset

  for (let idx = 0; idx < blockKey.children.length; idx++) {
    const child = after.nodeMap[blockKey.children[idx]]

    if (child && isTextNode(child)) {
      if (remainingOffset <= child.text.length) {
        return { node: child, offset: remainingOffset }
      }
      remainingOffset -= child.text.length
    }
  }

  return null
}

export function remapSelectionAfterNormalization(
  before: EditorState,
  after: EditorState
): EditorState {
  const { selection } = before
  if (!selection) return after

  //check if anchorNode Survived
  const anchor = getSurvivingNodeText(
    after.nodeMap,
    selection.anchorNode?.key,
    selection.anchorOffset
  )

  const focus = getSurvivingNodeText(
    after.nodeMap,
    selection.focusNode?.key,
    selection.focusOffset
  )

  console.log(anchor, focus, 'anchor and focus', before, after)

  if (anchor && focus) {
    return {
      ...after,
      selection: {
        type: selection.type,
        anchorNode: anchor.node,
        focusNode: focus.node,
        anchorOffset: anchor.offset,
        focusOffset: focus.offset,
      },
    }
  }

  const logicalAnchor = captureBlockOffset(
    before,
    selection.anchorNode,
    selection.anchorOffset
  )

  const logicalFocus = captureBlockOffset(
    before,
    selection.focusNode,
    selection.focusOffset
  )

  if (logicalAnchor && logicalFocus) {
    const remapAnchor = resolveBlockOffset(after, logicalAnchor)
    const remapFocus = resolveBlockOffset(after, logicalFocus)

    if (remapAnchor && remapFocus) {
      return {
        ...after,
        selection: {
          type: selection.type,
          anchorNode: remapAnchor.node,
          focusNode: remapFocus.node,
          anchorOffset: remapAnchor.offset,
          focusOffset: remapFocus.offset,
        },
      }
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

  const selectedKey = selection.anchorNode?.key
  const fallback = selectedKey
    ? findFallbackTextPoint(before, after, selectedKey)
    : null

  console.log(fallback, 'fallback')

  return {
    ...after,
    selection: fallback
      ? createCaretSelection(fallback.node, fallback.offset)
      : null,
  }
}
