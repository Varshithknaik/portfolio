import { EditorState, ElementNode, TextNode } from '../type/schema'
import { isElementNode, isTextNode } from './nodeUtils'

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
