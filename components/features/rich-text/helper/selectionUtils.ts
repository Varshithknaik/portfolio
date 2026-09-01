import { EditorNode, EditorSelection, EditorState } from '../type/schema'

const getEditorLeaf = (node: Node | null): HTMLElement | null => {
  if (!node) return null

  const element: Node | null =
    node.nodeType === Node.TEXT_NODE ? node.parentElement : node

  if (!element || !(element instanceof HTMLElement)) return null
  return element.closest<HTMLElement>('[data-editor-leaf]')
}

const leafMap = new Map()

const findDomTextNode = (
  editorElememt: HTMLElement,
  node: EditorNode | null
) => {
  if (!node) return null

  if (leafMap.has(node.key)) {
    return leafMap.get(node.key)
  }

  // lets just focus on the text-node
  const element = editorElememt.querySelector(
    '[data-editor-leaf="' + node.key + '"]'
  )
  //  ||
  // editorElememt.querySelector('[data-editor-element-key="' + node.key + '"]')

  if (!element) return null

  if (element instanceof HTMLElement && element.dataset.editorLeaf) {
    leafMap.set(element.dataset.editorLeaf, element)
    return element
  }

  return null
}

export const domToEditorSelection = (
  editorElement: HTMLDivElement,
  state: EditorState
): EditorSelection | null => {
  const selection = window.getSelection()

  if (!selection) return null

  const isInsidetheEditor =
    editorElement.contains(selection?.anchorNode) &&
    editorElement.contains(selection?.focusNode)
  if (!isInsidetheEditor) return null

  const nearestAnchoreNode = getEditorLeaf(selection?.anchorNode)
  const nearestFocusNode = getEditorLeaf(selection?.focusNode)

  if (!nearestAnchoreNode || !nearestFocusNode) return null

  const anchorNodeKey = nearestAnchoreNode.dataset.editorLeaf
  const focusNodeKey = nearestFocusNode.dataset.editorLeaf

  if (!anchorNodeKey || !focusNodeKey) return null

  return {
    anchorNode: anchorNodeKey ? state.nodeMap[anchorNodeKey] : null,
    anchorOffset: selection.anchorOffset,
    focusNode: focusNodeKey ? state.nodeMap[focusNodeKey] : null,
    focusOffset: selection.focusOffset,
    type: (selection.type as 'caret' | 'range') ?? 'caret',
  }
}

export const editorSelectionToDom = (
  editorElement: HTMLElement,
  selection: EditorSelection | null
) => {
  if (!selection) return

  const anchorNode = findDomTextNode(editorElement, selection.anchorNode)
  const focusNode = findDomTextNode(editorElement, selection.focusNode)

  if (!anchorNode || !focusNode) return

  const domSelection = editorElement.ownerDocument.getSelection()

  if (!domSelection) return

  const anchorOffset = Math.max(
    0,
    Math.min(selection.anchorOffset, anchorNode.textContent?.length)
  )
  const focusOffset = Math.max(
    0,
    Math.min(selection.focusOffset, focusNode.textContent?.length)
  )

  domSelection.setBaseAndExtent(
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset
  )
}
