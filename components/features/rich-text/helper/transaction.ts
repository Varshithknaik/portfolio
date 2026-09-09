import {
  EditorSelection,
  EditorState,
  ElementNode,
  TextNode,
  Transaction,
} from '../type/schema'
import { createKey, isElementNode, isTextNode } from './nodeUtils'
import {
  normalizeDocument,
  remapSelectionAfterNormalization,
} from './normalizer'

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

  if (!anchorNode.parent || anchorNode.parent !== focusNode.parent) return null

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
    backward: isAnchorBeforeFocus,
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

  const nextSelection: EditorSelection = {
    anchorNode: updatedStartNode,
    focusNode: updatedStartNode,
    anchorOffset: nextOffset,
    focusOffset: nextOffset,
    type: 'caret',
  }

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
  console.log(normalizedState, nextState)
  return remapSelectionAfterNormalization(nextState, normalizedState)
}

const replaceTextSelection = (
  state: EditorState,
  text: string
): EditorState | null => {
  const textRange = getTextRange(state)
  console.log(textRange, 'textRange')
  if (!textRange) return null

  return replaceTextRange(state, textRange, text)
}

const deleteTextSelection = (state: EditorState): EditorState | null => {
  const textRange = getTextRange(state)

  if (!textRange) return null

  const {
    start: { offset: startOffset },
    end: { offset: endOffset },
  } = textRange

  const deleteStart =
    startOffset === endOffset ? Math.max(0, startOffset - 1) : startOffset

  return replaceTextRange(
    state,
    {
      ...textRange,
    },
    ''
  )
}
