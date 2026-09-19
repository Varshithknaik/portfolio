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

type TextRange = {
  parentNode: ElementNode
  start: TextPoint
  end: TextPoint
  backward: boolean
}

type TreeTextRange = {
  commonAncestor: ElementNode
  start: TextPoint
  end: TextPoint
  startPath: NodeKey[] // child of commonAncestor -> start.node
  endPath: NodeKey[] // child of commonAncestor -> end.node
  backward: boolean
}

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
const getTextRange = (state: EditorState): TextRange | null => {
  const { selection, nodeMap } = state

  if (!selection) return null

  const anchorNodeKey = selection.anchorNode?.key
  const focusNodeKey = selection.focusNode?.key

  if (!anchorNodeKey || !focusNodeKey) return null

  const anchorNode = nodeMap[anchorNodeKey]
  const focusNode = nodeMap[focusNodeKey]

  if (!anchorNode || !focusNode) return null

  if (
    !anchorNode ||
    !focusNode ||
    !isTextNode(anchorNode) ||
    !isTextNode(focusNode)
  ) {
    return null
  }

  if (!anchorNode.parent || !focusNode.parent) return null

  const parentNode = nodeMap[anchorNode.parent]
  if (!parentNode || !isElementNode(parentNode)) return null

  const indexOfAnchor = parentNode.children.indexOf(anchorNode.key)
  const indexOfFocus = parentNode.children.indexOf(focusNode.key)

  if (indexOfAnchor === -1 || indexOfFocus === -1) return null

  const { anchorOffset, focusOffset } = selection

  const isValidAnchorOffset =
    anchorOffset >= 0 && anchorOffset <= anchorNode.text.length

  const isValidFocusOffset =
    focusOffset >= 0 && focusOffset <= focusNode.text.length

  if (!isValidAnchorOffset || !isValidFocusOffset) return null

  const affectedKeys = parentNode.children.slice(
    Math.min(indexOfAnchor, indexOfFocus),
    Math.max(indexOfAnchor, indexOfFocus) + 1
  )

  if (
    affectedKeys.some((key) => {
      const node = nodeMap[key]
      return !node || !isTextNode(node)
    })
  ) {
    return null
  }

  const isAnchorBeforeFocus =
    indexOfAnchor < indexOfFocus ||
    (indexOfAnchor === indexOfFocus && anchorOffset <= focusOffset)

  const start: TextPoint = isAnchorBeforeFocus
    ? {
        node: anchorNode,
        index: indexOfAnchor,
        offset: anchorOffset,
      }
    : {
        node: focusNode,
        index: indexOfFocus,
        offset: focusOffset,
      }

  const end: TextPoint = isAnchorBeforeFocus
    ? {
        node: focusNode,
        index: indexOfFocus,
        offset: focusOffset,
      }
    : {
        node: anchorNode,
        index: indexOfAnchor,
        offset: anchorOffset,
      }

  return {
    parentNode,
    start,
    end,
    backward: !isAnchorBeforeFocus,
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

const getCrossTextRange = (state: EditorState): TreeTextRange | null => {
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

  const isAnchorFirst = compareTreePoints(
    common.commonAncestor,
    common.startPath,
    anchor.offset,
    common.endPath,
    focus.offset
  )

  return {
    commonAncestor: common.commonAncestor,
    start: isAnchorFirst ? anchor : focus,
    end: isAnchorFirst ? focus : anchor,
    startPath: isAnchorFirst ? common.startPath : common.endPath,
    endPath: isAnchorFirst ? common.endPath : common.startPath,
    backward: !isAnchorFirst,
  }
}

const replaceTextRange = (
  state: EditorState,
  range: TextRange,
  replacementText: string
): EditorState => {
  const { start, end, parentNode } = range
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
    ...parentNode.children.slice(0, start.index + 1),
    newEndNodeKey,
    ...parentNode.children.slice(end.index + 1),
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
    [parentNode.key]: {
      ...parentNode,
      children: nextChildren,
    },
  }

  const removedKeys = parentNode.children.slice(start.index + 1, end.index + 1)
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

const replaceTextSelection = (
  state: EditorState,
  text: string
): EditorState | null => {
  const textRange = getTextRange(state)
  const crossBlockTextRange = getCrossTextRange(state)

  console.log({ textRange, crossBlockTextRange })

  if (!textRange) return null
  return replaceTextRange(state, textRange, text)
}

const resolveBackwardDeletionRange = (state: EditorState): TextRange | null => {
  const currentRange = getTextRange(state)

  if (!currentRange) return null

  const { start, end, parentNode } = currentRange

  const isCollapsed =
    start.node.key === end.node.key && start.offset === end.offset

  if (!isCollapsed) return currentRange

  if (start.offset > 0) {
    return {
      ...currentRange,
      start: {
        ...start,
        offset: start.offset - 1,
      },
      backward: true,
    }
  }

  // If not start.offset is is 0 select the previous child if present
  for (let idx = start.index - 1; idx >= 0; idx--) {
    const prevKey = parentNode.children[idx]
    const prevNode = state.nodeMap[prevKey]

    if (!prevNode || !isTextNode(prevNode)) return null
    if (prevNode.text.length === 0) continue

    return {
      ...currentRange,
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
