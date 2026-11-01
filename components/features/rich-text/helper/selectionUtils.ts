import {
  EditorNode,
  EditorSelection,
  EditorState,
  NodeKey,
} from '../type/schema'
import { isTextNode } from './nodeUtils'

const leafMap = new Map()

const getEditorLeaf = (node: Node | null): HTMLElement | null => {
  if (!node) return null

  const element: Node | null =
    node.nodeType === Node.TEXT_NODE ? node.parentElement : node

  if (!element || !(element instanceof HTMLElement)) return null
  return element.closest<HTMLElement>('[data-editor-leaf]')
}

const findTextNode = (element: HTMLElement): Text | null => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)

  return walker.nextNode() as Text | null
}

const findDomTextNode = (
  editorElement: HTMLElement,
  node: EditorNode | null
) => {
  if (!node) return null
  const cachedElement = leafMap.get(node.key)

  if (cachedElement && editorElement.contains(cachedElement)) {
    return cachedElement
  }

  leafMap.delete(node.key)

  // lets just focus on the text-node
  const leafElement = editorElement.querySelector<HTMLElement>(
    `[data-editor-leaf="${node.key}"]`
  )

  if (!leafElement) return null

  const textNode = findTextNode(leafElement)

  if (!textNode) return null

  leafMap.set(node.key, textNode)
  return textNode
}

const getLeafOffset = (leaf: HTMLElement, domNode: Node, domOffset: number) => {
  //
  const range = leaf.ownerDocument.createRange()
  range.setStart(leaf, 0)
  range.setEnd(domNode, domOffset)

  return range.toString().length
}

export const domToEditorSelection = (
  editorElement: HTMLDivElement,
  state: EditorState
): EditorSelection | null => {
  const selection = window.getSelection()
  const { nodeMap } = state
  if (!selection) return null

  const isInsidetheEditor =
    editorElement.contains(selection?.anchorNode) &&
    editorElement.contains(selection?.focusNode)

  if (!isInsidetheEditor) return null

  const nearestAnchoreNode = getEditorLeaf(selection?.anchorNode)
  const nearestFocusNode = getEditorLeaf(selection?.focusNode)

  if (!nearestAnchoreNode || !nearestFocusNode) return null

  const anchorNodeKey: NodeKey | undefined =
    nearestAnchoreNode.dataset.editorLeaf
  const focusNodeKey: NodeKey | undefined = nearestFocusNode.dataset.editorLeaf

  if (!anchorNodeKey || !focusNodeKey) return null

  const anchorOffset = getLeafOffset(
    nearestAnchoreNode,
    selection.anchorNode!,
    selection.anchorOffset
  )

  const focusOffset = getLeafOffset(
    nearestFocusNode,
    selection.focusNode!,
    selection.focusOffset
  )

  const editorAnchorNode = nodeMap.get(anchorNodeKey)
  const editorFocusNode = nodeMap.get(focusNodeKey)

  if (
    !editorAnchorNode ||
    !editorFocusNode ||
    !isTextNode(editorAnchorNode) ||
    !isTextNode(editorFocusNode) ||
    anchorOffset > editorAnchorNode.text.length ||
    focusOffset > editorFocusNode.text.length ||
    anchorOffset < 0 ||
    focusOffset < 0
  )
    return null

  return {
    anchorNode: { key: anchorNodeKey, offset: anchorOffset },
    focusNode: { key: focusNodeKey, offset: focusOffset },
    type: (selection.type.toLowerCase() as 'caret' | 'range') ?? 'caret',
  }
}

export const editorSelectionToDom = (
  editorElement: HTMLElement,
  selection: EditorSelection | null,
  nodeMap: Map<NodeKey, EditorNode>
) => {
  if (!selection || !selection.anchorNode || !selection.focusNode) return

  const rawAnchorNode = nodeMap.get(selection.anchorNode.key)
  const rawFocusNode = nodeMap.get(selection.focusNode.key)

  if (!rawAnchorNode || !rawFocusNode) return

  const anchorNode = findDomTextNode(editorElement, rawAnchorNode)
  const focusNode = findDomTextNode(editorElement, rawFocusNode)

  if (!anchorNode || !focusNode) return

  const domSelection = editorElement.ownerDocument.getSelection()

  if (!domSelection) return

  const anchorOffset = Math.max(
    0,
    Math.min(selection.anchorNode?.offset ?? 0, anchorNode.textContent?.length)
  )
  const focusOffset = Math.max(
    0,
    Math.min(selection.focusNode?.offset ?? 0, focusNode.textContent?.length)
  )

  domSelection.setBaseAndExtent(
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset
  )
}

export const sameEditorSelection = (
  a?: EditorSelection | null | undefined,
  b?: EditorSelection | null | undefined
): boolean => {
  if (a == null || b == null) {
    return a == null && b == null
  }
  if (a?.type !== b?.type) return false
  if (a?.anchorNode?.key !== b?.anchorNode?.key) return false
  if (a?.anchorNode?.offset !== b?.anchorNode?.offset) return false
  if (a?.focusNode?.key !== b?.focusNode?.key) return false
  if (a?.focusNode?.offset !== b?.focusNode?.offset) return false
  return true
}
