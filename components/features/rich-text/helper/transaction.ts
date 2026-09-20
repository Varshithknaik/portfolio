import {
  EditorNode,
  EditorSelection,
  EditorState,
  ElementNode,
  NodeKey,
  NodeMap,
  TextNode,
  Transaction,
} from '../type/schema'
import { createKey, isElementNode, isTextNode } from './nodeUtils'
import {
  createCaretSelection,
  normalizeDocument,
  remapSelectionAfterNormalization,
} from './normalizer'

type TextPoint = {
  node: TextNode
  offset: number
  index: number
}

type TreeTextRange = {
  commonAncestor: ElementNode
  start: TextPoint
  end: TextPoint
  startPath: NodeKey[] // child of commonAncestor -> start.node
  endPath: NodeKey[] // child of commonAncestor -> end.node
  backward: boolean
}

type ReplacementPolicy = 'same-parent' | 'sibling-block-merge'

const maxDepth = 32

export function applyTransaction(
  state: EditorState,
  transaction: Transaction
): EditorState | null {
  switch (transaction.type) {
    case 'insertText': {
      return replaceTextSelection(state, transaction.text)
    }
    case 'deleteText': {
      return deleteTextSelection(state)
    }

    default:
      return null
  }
}

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

// Using the depth approach vs set Method for the depth gaurd
const getPathToRoot = (leaf: NodeKey, nodeMap: NodeMap): NodeKey[] | null => {
  const path: NodeKey[] = []
  let currentKey: NodeKey | undefined = leaf
  let depth = 0
  while (currentKey && depth++ < maxDepth) {
    path.push(currentKey)
    const node: EditorNode = nodeMap[currentKey]
    if (!node || node.parent === null) return path.reverse()
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

  //Top sharedLength at 0 will the rootElement
  for (let i = 0; i < anchorNodePath.length && i < focusNodePath.length; i++) {
    if (anchorNodePath[i] === focusNodePath[i]) sharedLength++
    else break
  }

  // if its just the rootElement the sharedLength will be 1
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

  if (leftIndex !== rightIndex) {
    return leftIndex - rightIndex
  }

  return leftOffset - rightOffset
}

const resolveTreeTextRange = (state: EditorState): TreeTextRange | null => {
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

const replaceInSingleParent = (
  range: TreeTextRange,
  replacementText: string,
  state: EditorState
) => {
  const { start, end, commonAncestor } = range
  const startPrefix = start.node.text.slice(0, start.offset)
  const endSuffix = end.node.text.slice(end.offset)

  const updatedStartNode: TextNode = {
    ...start.node,
    text: startPrefix + replacementText,
  }
  const newEndNodeKey = createKey('t')
  const updatedEndNode: TextNode = {
    ...end.node,
    key: newEndNodeKey,
    text: endSuffix,
  }

  const nextChildren = [
    ...commonAncestor.children.slice(0, start.index + 1),
    newEndNodeKey,
    ...commonAncestor.children.slice(end.index + 1),
  ]

  const nextOffset = startPrefix.length + replacementText.length

  const nextSelection: EditorSelection = createCaretSelection(
    updatedStartNode,
    nextOffset
  )

  const nextNodeMap = {
    ...state.nodeMap,
    [start.node.key]: updatedStartNode,
    [newEndNodeKey]: updatedEndNode,
    [commonAncestor.key]: {
      ...commonAncestor,
      children: nextChildren,
    },
  }

  const removedKeys = commonAncestor.children.slice(
    start.index + 1,
    end.index + 1
  )
  for (const key of removedKeys) {
    delete nextNodeMap[key]
  }

  const nextState = {
    ...state,
    nodeMap: nextNodeMap,
    selection: nextSelection,
  }

  const normalizedState = normalizeDocument(nextState)
  return remapSelectionAfterNormalization(nextState, normalizedState)
}

const getPointParentKey = (range: TreeTextRange, path: NodeKey[]): NodeKey =>
  path.length === 1 ? range.commonAncestor.key : path[path.length - 2]

const replaceInSiblingBlocks = (
  range: TreeTextRange,
  replacementText: string,
  state: EditorState
) => {
  const { start, startPath, end, commonAncestor, endPath } = range
  const startPrefix = start.node.text.slice(0, start.offset)
  const endSuffix = end.node.text.slice(end.offset)

  const updatedStartNode: TextNode = {
    ...start.node,
    text: startPrefix + replacementText,
  }
  const newEndNodeKey = createKey('t')
  const updatedEndNode: TextNode = {
    ...end.node,
    key: newEndNodeKey,
    text: endSuffix,
  }

  const startParentNodeKey: NodeKey = getPointParentKey(range, startPath)
  const startParentNode = state.nodeMap[startParentNodeKey]
  const endParentNodeKey: NodeKey = getPointParentKey(range, endPath)
  const endParentNode = state.nodeMap[endParentNodeKey]

  if (
    !startParentNode ||
    !isElementNode(startParentNode) ||
    !endParentNode ||
    !isElementNode(endParentNode)
  )
    return null

  const startNodeIndex = commonAncestor.children.indexOf(startParentNodeKey)
  const endNodeIndex = commonAncestor.children.indexOf(endParentNodeKey)

  const nextChildren = [
    ...commonAncestor.children.slice(0, startNodeIndex + 1),
    ...commonAncestor.children.slice(endNodeIndex + 1),
  ]

  const nextOffset = startPrefix.length + replacementText.length

  const nextSelection: EditorSelection = createCaretSelection(
    updatedStartNode,
    nextOffset
  )

  const nextNodeMap = {
    ...state.nodeMap,
    [start.node.key]: updatedStartNode,
    [newEndNodeKey]: updatedEndNode,
    [commonAncestor.key]: {
      ...commonAncestor,
      children: nextChildren,
    },
    [startParentNode.key]: {
      ...startParentNode,
      children: [
        ...startParentNode.children.slice(0, start.index + 1),
        newEndNodeKey,
        ...endParentNode.children.slice(end.index + 1),
      ],
    },
  }

  const removedKeys = commonAncestor.children.slice(
    start.index + 1,
    end.index + 1
  )
  for (const key of removedKeys) {
    delete nextNodeMap[key]
  }

  const nextState = {
    ...state,
    nodeMap: nextNodeMap,
    selection: nextSelection,
  }

  const normalizedState = normalizeDocument(nextState)
  return remapSelectionAfterNormalization(nextState, normalizedState)
}

const haveCompatibleBlockKinds = (a: ElementNode, b: ElementNode): boolean => {
  if (a.type !== b.type) return false

  if (a.type === 'heading' && b.type === 'heading') {
    return a.level === b.level
  }

  return a.type === 'paragraph' && b.type === 'paragraph'
}

const getReplacementPolicy = (
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

const replaceTextRange = (
  state: EditorState,
  range: TreeTextRange,
  replacementText: string
): EditorState | null => {
  const policy = getReplacementPolicy(state, range)

  if (policy === 'same-parent') {
    return replaceInSingleParent(range, replacementText, state)
  } else if (policy === 'sibling-block-merge') {
    return replaceInSiblingBlocks(range, replacementText, state)
  }
  return null
}

const replaceTextSelection = (
  state: EditorState,
  text: string
): EditorState | null => {
  const crossBlockTextRange = resolveTreeTextRange(state)

  if (!crossBlockTextRange) return null
  return replaceTextRange(state, crossBlockTextRange, text)
}

const resolveBackwardDeletionRange = (
  state: EditorState
): TreeTextRange | null => {
  const crossBlockTextRange = resolveTreeTextRange(state)

  if (!crossBlockTextRange) return null

  const { start, end, commonAncestor } = crossBlockTextRange

  const isCollapsed =
    start.node.key === end.node.key && start.offset === end.offset

  if (!isCollapsed) return crossBlockTextRange

  if (start.offset > 0) {
    return {
      ...crossBlockTextRange,
      start: {
        ...start,
        offset: start.offset - 1,
      },
      backward: true,
    }
  }

  // If not start.offset is is 0 select the previous child if present
  for (let idx = start.index - 1; idx >= 0; idx--) {
    const prevKey = commonAncestor.children[idx]
    const prevNode = state.nodeMap[prevKey]

    if (!prevNode || !isTextNode(prevNode)) return null
    if (prevNode.text.length === 0) continue

    return {
      ...crossBlockTextRange,
      start: {
        node: prevNode,
        index: idx,
        offset: prevNode.text.length - 1,
      },
      end: {
        node: prevNode,
        index: idx,
        offset: prevNode.text.length,
      },
      backward: true,
    }
  }

  return null
}

const deleteTextSelection = (state: EditorState): EditorState | null => {
  const textRange = resolveBackwardDeletionRange(state)
  if (!textRange) return null

  return replaceTextRange(state, textRange, '')
}
