import {
  EditorSelection,
  EditorState,
  TextNode,
  Transaction,
} from '../type/schema'
import { isTextNode } from './nodeUtils'

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

const getSingleTextRange = (state: EditorState): TextRange | null => {
  const { selection, nodeMap } = state

  if (!selection) return null

  const { anchorNode, anchorOffset, focusOffset, focusNode } = selection

  if (!anchorNode || !isTextNode(anchorNode)) return null
  if (!focusNode || !isTextNode(focusNode)) return null

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

  return {
    ...state,
    nodeMap: {
      ...state.nodeMap,
      [textNode.key]: updatedTextNode,
    },
    selection: nextSelection,
  }
}

const replaceTextSelection = (
  state: EditorState,
  text: string
): EditorState | null => {
  const textRange = getSingleTextRange(state)

  if (!textRange) return null

  return replaceTextRange(state, textRange, text)
}

const deleteTextSelection = (state: EditorState): EditorState | null => {
  const textRange = getSingleTextRange(state)

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
