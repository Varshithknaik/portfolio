import {
  EditorNode,
  EditorState,
  ElementNode,
  NodeKey,
  NodeMap,
  TextNode,
} from '../type/schema'
import { isElementNode, isTextNode } from './nodeUtils'

export type TextPoint = {
  node: TextNode
  offset: number
  index: number
}

export type TreeTextRange = {
  commonAncestor: ElementNode
  start: TextPoint
  end: TextPoint
  startPath: NodeKey[] // child of commonAncestor -> start.node
  endPath: NodeKey[] // child of commonAncestor -> end.node
  backward: boolean
}

export type ReplacementPolicy = 'same-parent' | 'sibling-block-merge'
export type MarkPolicy = 'same-block' | 'sibling-blocks'

const maxDepth = 32
const resolveTextNode = (
  key: NodeKey | undefined,
  nodeMap: NodeMap,
  offset: number
): TextPoint | null => {
  if (!key) return null
  const node = nodeMap[key]
  if (!node || !node.parent || !isTextNode(node)) return null

  const parentNode = nodeMap[node.parent]
  if (!parentNode || !isElementNode(parentNode)) return null

  const isValidOffset = offset >= 0 && offset <= node.text.length
  if (!isValidOffset) return null

  const index = parentNode.children.indexOf(node.key)
  if (index < 0) return null

  return {
    node,
    offset,
    index,
  }
}

// Use a depth guard to avoid traversing malformed parent cycles indefinitely.
const getPathToRoot = (leaf: NodeKey, nodeMap: NodeMap): NodeKey[] | null => {
  const path: NodeKey[] = []
  let currentKey: NodeKey | undefined = leaf
  let depth = 0

  while (currentKey && depth++ < maxDepth) {
    path.push(currentKey)
    const node: EditorNode = nodeMap[currentKey]
    if (!node) return null
    if (node.parent === null) return path.reverse()
    currentKey = node.parent
  }

  return null
}

const resolveCommonElement = (
  nodeMap: NodeMap,
  anchorNodePath: NodeKey[],
  focusNodePath: NodeKey[]
): {
  commonAncestor: ElementNode
  startPath: NodeKey[]
  endPath: NodeKey[]
} | null => {
  let sharedLength = 0

  for (let i = 0; i < anchorNodePath.length && i < focusNodePath.length; i++) {
    if (anchorNodePath[i] === focusNodePath[i]) sharedLength++
    else break
  }

  for (let idx = sharedLength - 1; idx >= 0; idx--) {
    const node = nodeMap[anchorNodePath[idx]]
    if (!node || !isElementNode(node)) continue

    return {
      commonAncestor: node,
      startPath: anchorNodePath.slice(idx + 1),
      endPath: focusNodePath.slice(idx + 1),
    }
  }

  return null
}

const compareTreePoints = (
  commonAncestor: ElementNode,
  leftPath: NodeKey[],
  leftOffset: number,
  rightPath: NodeKey[],
  rightOffset: number
): number | null => {
  const leftKey = leftPath[0]
  const rightKey = rightPath[0]

  if (!leftKey || !rightKey) return null

  const leftIndex = commonAncestor.children.indexOf(leftKey)
  const rightIndex = commonAncestor.children.indexOf(rightKey)

  if (leftIndex < 0 || rightIndex < 0) return null
  if (leftIndex !== rightIndex) return leftIndex - rightIndex

  return leftOffset - rightOffset
}

export const resolveTreeTextRange = (
  state: EditorState
): TreeTextRange | null => {
  const { selection, nodeMap } = state
  if (!selection) return null

  const anchor = resolveTextNode(
    selection.anchorNode?.key,
    nodeMap,
    selection.anchorOffset
  )
  const focus = resolveTextNode(
    selection.focusNode?.key,
    nodeMap,
    selection.focusOffset
  )

  if (!anchor || !focus) return null

  const anchorRootPath = getPathToRoot(anchor.node.key, nodeMap)
  const focusRootPath = getPathToRoot(focus.node.key, nodeMap)
  if (!anchorRootPath || !focusRootPath) return null

  const common = resolveCommonElement(nodeMap, anchorRootPath, focusRootPath)
  if (!common) return null

  const comparison = compareTreePoints(
    common.commonAncestor,
    common.startPath,
    anchor.offset,
    common.endPath,
    focus.offset
  )
  if (comparison === null) return null

  const isAnchorFirst = comparison <= 0

  return {
    commonAncestor: common.commonAncestor,
    start: isAnchorFirst ? anchor : focus,
    end: isAnchorFirst ? focus : anchor,
    startPath: isAnchorFirst ? common.startPath : common.endPath,
    endPath: isAnchorFirst ? common.endPath : common.startPath,
    backward: !isAnchorFirst,
  }
}

export const getPointParentKey = (
  range: TreeTextRange,
  path: NodeKey[]
): NodeKey => {
  return path.length === 1
    ? range.commonAncestor.key
    : path[path.length - 2] || range.commonAncestor.key
}

const haveCompatibleBlockKinds = (a: ElementNode, b: ElementNode): boolean => {
  if (a.type !== b.type) return false

  if (a.type === 'heading' && b.type === 'heading') {
    return a.level === b.level
  }

  return a.type === 'paragraph' && b.type === 'paragraph'
}

export const getReplacementPolicy = (
  state: EditorState,
  range: TreeTextRange
): ReplacementPolicy | null => {
  if (range.startPath.length === 1 && range.endPath.length === 1) {
    return 'same-parent'
  }

  const isSiblingBlocks =
    range.startPath.length === 2 && range.endPath.length === 2
  if (!isSiblingBlocks) return null

  const startBlock = state.nodeMap[range.startPath[0]]
  const endBlock = state.nodeMap[range.endPath[0]]

  if (
    startBlock &&
    endBlock &&
    isElementNode(startBlock) &&
    isElementNode(endBlock) &&
    haveCompatibleBlockKinds(startBlock, endBlock)
  ) {
    return 'sibling-block-merge'
  }

  return null
}

export const getMarkPolicy = (
  state: EditorState,
  range: TreeTextRange
): MarkPolicy | null => {
  if (range.startPath.length === 1 && range.endPath.length === 1) {
    return 'same-block'
  }

  const isSiblingBlocks =
    range.startPath.length === 2 && range.endPath.length === 2
  if (!isSiblingBlocks) return null

  const startBlock = state.nodeMap[range.startPath[0]]
  const endBlock = state.nodeMap[range.endPath[0]]

  if (
    startBlock &&
    endBlock &&
    isElementNode(startBlock) &&
    isElementNode(endBlock) &&
    haveCompatibleBlockKinds(startBlock, endBlock)
  ) {
    return 'sibling-blocks'
  }

  return null
}
