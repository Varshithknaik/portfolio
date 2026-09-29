import { create } from 'node:domain'
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

export type SplitNodes = {
  updatedStartNode: TextNode
  updatedMiddleNode: TextNode
  updatedEndNode: TextNode
}

export const createReplacementBoundaryNodes = (
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

export const splitNodesForMarkRange = (
  start: BoundaryTextPoint,
  end: BoundaryTextPoint,
  endParentKey?: NodeKey
): SplitNodes | null => {
  const startPrefix = start.node.text.slice(0, start.offset)
  const middleText = start.node.text.slice(start.offset, end.offset)
  const endSuffix = end.node.text.slice(end.offset)

  const updatedStartNode: TextNode = {
    ...start.node,
    text: startPrefix,
  }

  const newMiddleNodeKey = createKey('t')
  const updatedMiddleNode: TextNode = {
    ...start.node,
    key: newMiddleNodeKey,
    parent: endParentKey ?? end.node.parent,
    text: middleText,
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
    updatedMiddleNode,
    updatedEndNode,
  }
}
