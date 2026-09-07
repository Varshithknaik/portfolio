import {
  EditorSelection,
  EditorState,
  TextNode,
  Transaction,
} from '../type/schema'
import { isTextNode } from './nodeUtils'
import { normalizeDocument, normalizeTextChildren } from './normalizer'

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

type TextRange = {
  node: TextNode
  startOffset: number
  endOffset: number
}

const getTextRange = (state: EditorState): TextRange | null => {
  const { selection, nodeMap } = state

  if (!selection) return null

  const { anchorNode, anchorOffset, focusOffset, focusNode } = selection

  if (!anchorNode || !focusNode) return null

  // get the node from the nodeMap
  const currentAnchor = nodeMap[anchorNode.key]
  const currentFocus = nodeMap[focusNode.key]

  if (
    !currentAnchor ||
    !currentFocus ||
    !isTextNode(currentAnchor) ||
    !isTextNode(currentFocus)
  ) {
    return null
  }

  if (anchorNode.parent !== focusNode.parent) return null

  const currentTextNodeKey = anchorNode.key
  const currentTextNode = nodeMap[currentTextNodeKey]

  if (!currentTextNode || !isTextNode(currentTextNode)) return null

  const startOffset = Math.min(anchorOffset, focusOffset)
  const endOffset = Math.max(anchorOffset, focusOffset)

  return {
    node: currentTextNode,
    startOffset,
    endOffset,
  }
}

const replaceTextRange = (
  state: EditorState,
  range: TextRange,
  replacementText: string
): EditorState => {
  const { node: textNode, startOffset, endOffset } = range
  const newText =
    textNode.text.slice(0, startOffset) +
    replacementText +
    textNode.text.slice(endOffset)

  const updatedTextNode: TextNode = {
    ...textNode,
    text: newText,
  }

  const nextOffset = startOffset + replacementText.length

  const nextSelection: EditorSelection = {
    anchorNode: updatedTextNode,
    focusNode: updatedTextNode,
    anchorOffset: nextOffset,
    focusOffset: nextOffset,
    type: 'caret',
  }

  const nextNodeMap = {
    ...state.nodeMap,
    [textNode.key]: updatedTextNode,
  }

  const nextState = {
    ...state,
    nodeMap: nextNodeMap,
    selection: nextSelection,
  }

  return normalizeDocument(nextState)
}

const replaceTextSelection = (
  state: EditorState,
  text: string
): EditorState | null => {
  const textRange = getTextRange(state)

  if (!textRange) return null

  return replaceTextRange(state, textRange, text)
}

const deleteTextSelection = (state: EditorState): EditorState | null => {
  const textRange = getTextRange(state)

  if (!textRange) return null

  const { startOffset, endOffset } = textRange

  const deleteStart =
    startOffset === endOffset ? Math.max(0, startOffset - 1) : startOffset

  return replaceTextRange(
    state,
    {
      ...textRange,
      startOffset: deleteStart,
    },
    ''
  )
}
