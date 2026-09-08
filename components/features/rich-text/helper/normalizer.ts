import { EditorState, NodeKey, NodeMap, TextNode } from '../type/schema'
import {
  canonicalizeMarks,
  createKey,
  isElementNode,
  isRootNode,
  isTextNode,
  sameMarks,
} from './nodeUtils'

export function normalizeTextChildren(
  nodeMap: NodeMap,
  parentKey: NodeKey
): NodeMap {
  const parent = nodeMap[parentKey]
  if (!parent || !isElementNode(parent)) return nodeMap

  const nextMap: NodeMap = { ...nodeMap }
  const normalizedChildren: NodeKey[] = []

  for (const childKey of parent.children) {
    const child = nodeMap[childKey]

    if (!child) continue

    if (child.type === 'root') {
      throw new Error('Root node should not be a child of any node')
    }

    // Preserve the invalid text nodes
    if (!isTextNode(child)) {
      // nextMap[childKey] = {
      //   ...child,
      //   parent: parentKey,
      // }
      // normalizedChildren.push(childKey)
      delete nextMap[childKey]
      continue
    }

    if (child.text.length === 0) {
      delete nextMap[childKey]
      continue
    }

    const normalizedChild: TextNode = {
      ...child,
      parent: parentKey,
      marks: canonicalizeMarks(child.marks),
    }

    nextMap[childKey] = normalizedChild

    // Now check if previous is same
    const prevKey = normalizedChildren.at(-1)
    const previous = prevKey ? nextMap[prevKey] : undefined

    if (
      prevKey &&
      previous &&
      isTextNode(previous) &&
      sameMarks(normalizedChild.marks, previous.marks)
    ) {
      // Merge the two text nodes
      const mergedText: TextNode = {
        ...previous,
        text: previous.text + normalizedChild.text,
      }

      nextMap[prevKey] = mergedText

      // Remove the current node
      delete nextMap[childKey]
    } else {
      normalizedChildren.push(childKey)
    }
  }

  nextMap[parentKey] = {
    ...parent,
    children: normalizedChildren,
  }

  return nextMap
}

export function normalizeDocument(state: EditorState): EditorState {
  const { nodeMap, rootKey } = state
  const root = nodeMap[rootKey]
  if (!isRootNode(root)) {
    throw new Error('Root node is not an element node')
  }

  let nextMap: NodeMap = { ...nodeMap }
  const rootChildren = root.children.filter((key) => {
    return !!nodeMap[key]
  })

  // rapair logic
  if (rootChildren.length === 0) {
    const paragraphKey = createKey('paragraph')
    nextMap[paragraphKey] = {
      type: 'paragraph',
      key: paragraphKey,
      parent: rootKey,
      children: [],
    }
    rootChildren.push(paragraphKey)
  }

  nextMap[rootKey] = { ...root, children: rootChildren }

  // normalize the text node
  for (const childKey of rootChildren) {
    const child = nextMap[childKey]
    if (!child) continue

    if (child.type === 'root') {
      throw new Error('Root node should not be a child of any node')
    }

    nextMap[childKey] = {
      ...child,
      parent: rootKey,
    }

    if (isElementNode(child)) {
      nextMap = normalizeTextChildren(nextMap, childKey)
    }
  }

  return { ...state, nodeMap: nextMap }
}

export function remapSelectionAfterNormalization(
  before: EditorState,
  after: EditorState
): EditorState {
  if (!before.selection) return after

  const selectedKey = before.selection.anchorNode?.key
  const survivingNode = after.nodeMap[selectedKey!]

  if (survivingNode && isTextNode(survivingNode)) {
    const offset = Math.min(
      before.selection.anchorOffset,
      survivingNode.text.length
    )

    return {
      ...after,
      selection: {
        anchorNode: survivingNode,
        anchorOffset: offset,
        focusNode: survivingNode,
        focusOffset: offset,
        type: 'caret',
      },
    }
  }

  // normalization removed the node that was selected
  const oldNode = before.nodeMap[selectedKey!]

  if (!oldNode || !oldNode.parent) return after

  const oldParent = before.nodeMap[oldNode.parent]
  const newParent = after.nodeMap[oldNode.parent]

  if (
    !oldParent ||
    !newParent ||
    !isElementNode(oldParent) ||
    !isElementNode(newParent)
  ) {
    return after
  }

  const oldIndex = oldParent.children.indexOf(selectedKey!)
  if (oldIndex < 0) return after

  for (let idx = oldIndex - 1; idx >= 0; idx--) {
    const previous = after.nodeMap[oldParent.children[idx]]
    if (previous && isTextNode(previous)) {
      return {
        ...after,
        selection: {
          anchorNode: previous,
          anchorOffset: previous.text.length,
          focusNode: previous,
          focusOffset: previous.text.length,
          type: 'caret',
        },
      }
    }
  }

  for (let idx = oldIndex + 1; idx < oldParent.children.length; idx++) {
    const next = after.nodeMap[oldParent.children[idx]]

    if (next && isTextNode(next)) {
      return {
        ...after,
        selection: {
          anchorNode: next,
          anchorOffset: 0,
          focusNode: next,
          focusOffset: 0,
          type: 'caret',
        },
      }
    }
  }

  return after
}
