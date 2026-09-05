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
      return replaceTextSelection(state, '')
    }

    default:
      return null
  }
}

const replaceTextSelection = (state: EditorState, text: string) => {
  const { selection, nodeMap } = state

  if (!selection) return null

  const { anchorNode, anchorOffset, focusOffset, focusNode } = selection

  if (!anchorNode || !isTextNode(anchorNode)) return null
  if (!focusNode || !isTextNode(focusNode)) return null

  //lets worry on the single text node and left to right selection
  const currentTextNodeKey = anchorNode.key
  const currentTextNode = nodeMap[currentTextNodeKey]

  if (!currentTextNode || !isTextNode(currentTextNode)) return null

  const startOffset = Math.min(anchorOffset, focusOffset)
  const endOffset = Math.max(anchorOffset, focusOffset)

  const newText =
    anchorNode.text.slice(0, startOffset) +
    text +
    anchorNode.text.slice(endOffset)

  const updatedTextNode: TextNode = {
    ...currentTextNode,
    text: newText,
  }

  // Lets normalize the text node later

  const nextOffset = anchorOffset + text.length

  const nextSelection: EditorSelection = {
    anchorNode: updatedTextNode,
    focusNode: updatedTextNode,
    anchorOffset: nextOffset,
    focusOffset: nextOffset,
    type: 'caret',
  }

  const newNodeMap = {
    ...nodeMap,
    [currentTextNodeKey]: updatedTextNode,
  }

  return {
    ...state,
    nodeMap: newNodeMap,
    selection: nextSelection,
  }
}
