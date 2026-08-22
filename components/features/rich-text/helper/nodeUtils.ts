import {
  EditorNode,
  EditorState,
  ElementNode,
  NodeMap,
  RootNode,
  TextNode,
} from '../type/schema'

export const createEmptyState = (): EditorState => {
  const rootKey = crypto.randomUUID()
  const paragraphKey = crypto.randomUUID()

  const nodeMap: NodeMap = {
    [rootKey]: {
      type: 'root',
      key: rootKey,
      parent: null,
      children: [paragraphKey],
    },
    [paragraphKey]: {
      type: 'paragraph',
      key: paragraphKey,
      parent: rootKey,
      children: [],
    },
  }

  return {
    nodeMap,
    rootKey: rootKey,
    selection: null,
  }
}

export const isElementNode = (node: EditorNode): node is ElementNode => {
  return 'children' in node
}

export const isRootNode = (node: EditorNode): node is RootNode => {
  return node.type === 'root'
}

export const isTextNode = (node: EditorNode): node is TextNode => {
  return node.type === 'text'
}
