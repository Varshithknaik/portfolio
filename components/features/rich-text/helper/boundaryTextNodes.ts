import { NodeKey, EditorNodeMap, TextNode } from '../type/schema'
import { createKey, isElementNode, isTextNode } from './nodeUtils'
import { TextPoint } from './textRange'

export type BoundaryTextPoint = {
  node: TextNode
  offset: number
}

export type BoundaryTextNodes = {
  updatedStartNode: TextNode
  updatedEndNode: TextNode
  newMiddleNode: TextNode | null
  nextOffset: number
}

export type SplitNodes = {
  updatedStartNode: TextNode
  updatedMiddleNodes: TextNode[]
  updatedEndNode: TextNode
  removedKeys: NodeKey[]
}

type ReplacementBoundaryNodesInput = {
  start: BoundaryTextPoint
  end: BoundaryTextPoint
  replacementText: string
  endParentKey?: NodeKey
  storedFormat?: number | null
}

export const createReplacementBoundaryNodes = ({
  start,
  end,
  replacementText,
  endParentKey,
  storedFormat,
}: ReplacementBoundaryNodesInput): BoundaryTextNodes => {
  const startPrefix = start.node.text.slice(0, start.offset)
  const endSuffix = end.node.text.slice(end.offset)

  const hasStoredFormat = storedFormat != null

  const updatedStartNode: TextNode = {
    ...start.node,
    text: startPrefix + (hasStoredFormat ? '' : replacementText),
  }

  let newMiddleNode: TextNode | null = null

  if (hasStoredFormat) {
    const newMiddleNodeKey = createKey('t')
    newMiddleNode = {
      ...start.node,
      format: storedFormat,
      key: newMiddleNodeKey,
      parent: endParentKey ?? end.node.parent,
      text: replacementText,
    }
  }

  const newEndNodeKey = createKey('t')
  const updatedEndNode: TextNode = {
    ...end.node,
    key: newEndNodeKey,
    parent: endParentKey ?? end.node.parent,
    text: endSuffix,
  }

  return {
    updatedStartNode,
    updatedEndNode,
    newMiddleNode,
    nextOffset: hasStoredFormat
      ? replacementText.length
      : startPrefix.length + replacementText.length,
  }
}

export const splitNodesForMarkRange = (
  start: TextPoint,
  end: TextPoint,
  nodeMap: EditorNodeMap,
  endParentKey?: NodeKey
): SplitNodes | null => {
  // Check for if the start and end node are same or not
  let updatedStartNode: TextNode
  let updatedMiddleNodes: TextNode[]
  let updatedEndNode: TextNode
  const removedKeys: NodeKey[] = []

  if (start.node.key === end.node.key) {
    const startPrefix = start.node.text.slice(0, start.offset)
    const middleText = start.node.text.slice(start.offset, end.offset)
    const endSuffix = end.node.text.slice(end.offset)

    updatedStartNode = {
      ...start.node,
      text: startPrefix,
    }

    updatedMiddleNodes = [
      {
        ...start.node,
        key: createKey('t'),
        parent: endParentKey ?? end.node.parent,
        text: middleText,
      },
    ]

    updatedEndNode = {
      ...end.node,
      key: createKey('t'),
      parent: endParentKey ?? end.node.parent,
      text: endSuffix,
    }
  } else if (start.node.parent && start.node.parent === end.node.parent) {
    const parentNode = nodeMap.get(start.node.parent)
    if (!parentNode || !isElementNode(parentNode)) return null

    const startPrefix = start.node.text.slice(0, start.offset)
    const startSuffix = start.node.text.slice(start.offset)

    const endPrefix = end.node.text.slice(0, end.offset)
    const endSuffix = end.node.text.slice(end.offset)

    updatedStartNode = {
      ...start.node,
      text: startPrefix,
    }

    updatedEndNode = {
      ...end.node,
      key: createKey('t'),
      parent: endParentKey ?? end.node.parent,
      text: endSuffix,
    }

    updatedMiddleNodes = [
      {
        ...start.node,
        key: createKey('t'),
        parent: endParentKey ?? end.node.parent,
        text: startSuffix,
      },
      ...parentNode.children
        .slice(start.index + 1, end.index)
        .map((key) => nodeMap.get(key))
        .filter(isTextNode),
      {
        ...end.node,
        key: createKey('t'),
        parent: endParentKey ?? end.node.parent,
        text: endPrefix,
      },
    ]

    if (start.node.key != end.node.key) removedKeys.push(end.node.key)
  } else {
    return null
  }

  return {
    updatedStartNode,
    updatedMiddleNodes,
    updatedEndNode,
    removedKeys,
  }
}
