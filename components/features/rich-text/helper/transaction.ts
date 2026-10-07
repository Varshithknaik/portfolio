import {
  EditorSelection,
  EditorState,
  Mark,
  NodeKey,
  NodeMap,
  TextNode,
  Transaction,
} from '../type/schema'
import {
  canonicalizeMarks,
  createKey,
  isElementNode,
  isTextNode,
} from './nodeUtils'
import {
  createReplacementBoundaryNodes,
  splitNodesForMarkRange,
} from './boundaryTextNodes'
import {
  createCaretSelection,
  createRangeSelection,
  normalizeDocument,
  remapSelectionAfterNormalization,
} from './normalizer'
import {
  getMarkPolicy,
  getPointParentKey,
  getReplacementPolicy,
  resolveTreeTextRange,
  TreeTextRange,
} from './textRange'

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
    case 'toggleMark': {
      return toggleMark(state, transaction.mark)
    }

    default:
      return null
  }
}

const replaceInSingleParent = (
  range: TreeTextRange,
  replacementText: string,
  state: EditorState
) => {
  const { start, end, commonAncestor } = range

  const { updatedStartNode, updatedEndNode, nextOffset } =
    createReplacementBoundaryNodes(start, end, replacementText)

  const nextChildren = [
    ...commonAncestor.children.slice(0, start.index + 1),
    updatedEndNode.key,
    ...commonAncestor.children.slice(end.index + 1),
  ]

  const nextSelection: EditorSelection = createCaretSelection(
    updatedStartNode,
    nextOffset
  )

  const nextNodeMap = {
    ...state.nodeMap,
    [start.node.key]: updatedStartNode,
    [updatedEndNode.key]: updatedEndNode,
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

const replaceInSiblingBlocks = (
  range: TreeTextRange,
  replacementText: string,
  state: EditorState
) => {
  const { start, startPath, end, commonAncestor, endPath } = range
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

  const { updatedStartNode, updatedEndNode, nextOffset } =
    createReplacementBoundaryNodes(
      start,
      end,
      replacementText,
      startParentNode.key
    )

  const startNodeIndex = commonAncestor.children.indexOf(startParentNodeKey)
  const endNodeIndex = commonAncestor.children.indexOf(endParentNodeKey)
  const isValidIndex = startNodeIndex >= 0 && endNodeIndex > startNodeIndex
  if (!isValidIndex) return null
  const nextChildren = [
    ...commonAncestor.children.slice(0, startNodeIndex + 1),
    ...commonAncestor.children.slice(endNodeIndex + 1),
  ]
  const nextSelection: EditorSelection = createCaretSelection(
    updatedStartNode,
    nextOffset
  )
  const nextNodeMap = {
    ...state.nodeMap,
    [start.node.key]: updatedStartNode,
    [updatedEndNode.key]: updatedEndNode,
    [commonAncestor.key]: {
      ...commonAncestor,
      children: nextChildren,
    },
    [startParentNode.key]: {
      ...startParentNode,
      children: [
        ...startParentNode.children.slice(0, start.index + 1),
        updatedEndNode.key,
        ...endParentNode.children.slice(end.index + 1),
      ],
    },
  }

  const intermediateBlockKeys = commonAncestor.children.slice(
    startNodeIndex + 1,
    endNodeIndex
  )

  const removedStartTextKeys = startParentNode.children.slice(start.index + 1)

  const removedEndTextKeys = endParentNode.children.slice(0, end.index + 1)

  const removedKeys = new Set<NodeKey>([
    ...removedStartTextKeys,
    ...removedEndTextKeys,
    ...intermediateBlockKeys,
    endParentNode.key,
  ])

  for (const blockKey of intermediateBlockKeys) {
    const block = state.nodeMap[blockKey]

    if (block && isElementNode(block)) {
      for (const childKey of block.children) {
        removedKeys.add(childKey)
      }
    }
  }

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

const toggleMarkInSameBlock = (
  state: EditorState,
  range: TreeTextRange,
  mark: Mark
): EditorState | null => {
  const { start, end, commonAncestor } = range
  const splitNodes = splitNodesForMarkRange(start, end, state.nodeMap)
  if (!splitNodes) return null

  const nextChildren = [
    ...commonAncestor.children.slice(0, start.index + 1),
    ...splitNodes.updatedMiddleNodes.map((node) => node.key),
    splitNodes.updatedEndNode.key,
    ...commonAncestor.children.slice(end.index + 1),
  ]

  const filteredTextNodes: TextNode[] =
    splitNodes.updatedMiddleNodes.filter(isTextNode)

  if (filteredTextNodes.length === 0) return null

  const hasMark = filteredTextNodes.every((node) => node.marks.includes(mark))

  const formattedMiddleTextNodes: TextNode[] = filteredTextNodes.map((node) => {
    return {
      ...node,
      marks: hasMark
        ? node.marks.filter((m) => m !== mark)
        : canonicalizeMarks([...node.marks, mark]),
    }
  })

  const newFormattedMiddleNodes: NodeMap = formattedMiddleTextNodes.reduce(
    (acc, node) => ({
      ...acc,
      [node.key]: node,
    }),
    {}
  )

  const nextNodeMap: NodeMap = {
    ...state.nodeMap,
    [splitNodes.updatedStartNode.key]: splitNodes.updatedStartNode,
    ...newFormattedMiddleNodes,
    [splitNodes.updatedEndNode.key]: splitNodes.updatedEndNode,
    [commonAncestor.key]: {
      ...commonAncestor,
      children: nextChildren,
    },
  }

  const nextStartNode = formattedMiddleTextNodes[0]
  const nextEndNode =
    formattedMiddleTextNodes[formattedMiddleTextNodes.length - 1]

  const nextSelection: EditorSelection = createRangeSelection({
    anchorNode: nextStartNode,
    anchorOffset: 0,
    focusNode: nextEndNode,
    focusOffset: nextEndNode.text.length,
  })

  const nextState = {
    ...state,
    nodeMap: nextNodeMap,
    selection: nextSelection,
  }

  return nextState
}

const getDescendantTextKeys = (
  state: EditorState,
  parent: NodeKey
): NodeKey[] => {
  const parentNode = state.nodeMap[parent]
  if (!parentNode || !isElementNode(parentNode)) return []

  const textKeys: NodeKey[] = []
  for (const key of parentNode.children) {
    const childNode = state.nodeMap[key]
    if (!childNode) continue

    if (isTextNode(childNode)) {
      textKeys.push(key)
    } else if (isElementNode(childNode)) {
      textKeys.push(...getDescendantTextKeys(state, key))
    }
  }
  return textKeys
}

const toggleMarkInSiblingBlocks = (
  state: EditorState,
  range: TreeTextRange,
  mark: Mark
): EditorState | null => {
  const { start, end, commonAncestor, startPath, endPath } = range

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

  const startPrefix = start.node.text.slice(0, start.offset)
  const startSuffix = start.node.text.slice(start.offset)

  const endPrefix = end.node.text.slice(0, end.offset)
  const endSuffix = end.node.text.slice(end.offset)
  // start's cursors to end make new mark with its existing mark and make it as the new children + inbettween elemets + end
  const startPrefixNode: TextNode = {
    ...start.node,
    text: startPrefix,
  }

  const startSuffixKey = createKey('t')
  const startSuffixNode: TextNode = {
    ...start.node,
    // this will the new node
    key: startSuffixKey,
    text: startSuffix,
  }

  const endPrefixKey = createKey('t')
  const endPrefixNode: TextNode = {
    ...end.node,
    key: endPrefixKey,
    text: endPrefix,
  }
  const endSuffixNode: TextNode = {
    ...end.node,
    text: endSuffix,
  }

  const inBetweenElements = commonAncestor.children.slice(
    start.index + 1,
    end.index + 1
  )

  console.log(inBetweenElements)

  const descendantTextKeys = getDescendantTextKeys(state, commonAncestor.key)
  const descendantNodes: TextNode[] = descendantTextKeys
    .map((key) => state.nodeMap[key])
    .filter((node) => node && isTextNode(node))

  const isAllMarksSame = [
    startSuffixNode,
    ...descendantNodes,
    endPrefixNode,
  ].every((node) => node.marks.includes(mark))

  return null
}

const toggleMark = (state: EditorState, mark: Mark): EditorState | null => {
  const crossBlockTextRange = resolveTreeTextRange(state)
  let nextEditorState: EditorState | null = null
  if (!crossBlockTextRange) return null

  const range = crossBlockTextRange

  const policy = getMarkPolicy(state, crossBlockTextRange)

  if (!policy) return null

  if (policy === 'same-block') {
    nextEditorState = toggleMarkInSameBlock(state, range, mark)
  } else if (policy === 'sibling-blocks') {
    nextEditorState = toggleMarkInSiblingBlocks(state, range, mark)
  } else {
    return null
  }

  if (!nextEditorState) return null

  const normalizedState = normalizeDocument(nextEditorState)
  return remapSelectionAfterNormalization(nextEditorState, normalizedState)
}
