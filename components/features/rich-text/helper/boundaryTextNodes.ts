import { NodeKey, TextNode } from '../type/schema'
import { createKey } from './nodeUtils'

export type BoundaryTextPoint = {
  node: TextNode
  offset: number
}

export type BoundaryTextNodes = {
  updatedStartNode: TextNode
  updatedEndNode: TextNode
  nextOffset: number
}

export const createBoundaryTextNodes = (
  start: BoundaryTextPoint,
  end: BoundaryTextPoint,
  replacementText: string,
  endParentKey?: NodeKey
): BoundaryTextNodes => {
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
    parent: endParentKey ?? end.node.parent,
    text: endSuffix,
  }

  return {
    updatedStartNode,
    updatedEndNode,
    nextOffset: startPrefix.length + replacementText.length,
  }
}
