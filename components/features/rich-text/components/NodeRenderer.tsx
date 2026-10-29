import {
  Format,
  hasFormat,
  isElementNode,
  isRootNode,
  isTextNode,
} from '../helper/nodeUtils'
import { EditorState, NodeKey } from '../type/schema'

interface NodeRendererProps {
  state: EditorState
  nodeKey: NodeKey
}

const headingTags = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const

export const NodeRenderer = ({ state, nodeKey }: NodeRendererProps) => {
  const node = state.nodeMap.get(nodeKey)

  if (!node) {
    return null
  }
  if (isRootNode(node)) {
    return (
      <>
        {node.children.map((key) => (
          <NodeRenderer key={key} state={state} nodeKey={key} />
        ))}
      </>
    )
  }

  if (isTextNode(node)) {
    let element: React.ReactNode = (
      <span data-editor-leaf={node.key} className="text-inherit">
        {node.text}
      </span>
    )
    if (hasFormat(node.format, Format.BOLD)) {
      element = <strong>{element}</strong>
    }
    if (hasFormat(node.format, Format.ITALIC)) {
      element = <em>{element}</em>
    }
    if (hasFormat(node.format, Format.UNDERLINE)) {
      element = <u>{element}</u>
    }
    // Links are now separate properties on TextNode
    if (node.links?.href) {
      element = <a href={node.links.href}>{element}</a>
    }
    return element
  }

  if (isElementNode(node)) {
    const childrens = node.children.map((key) => (
      <NodeRenderer key={key} state={state} nodeKey={key} />
    ))
    switch (node.type) {
      case 'paragraph':
        return (
          <p data-editor-node-key={node.key}>
            {childrens.length > 0 ? childrens : <br />}
          </p>
        )
      case 'heading': {
        const Tag = headingTags[node.level]
        return (
          <Tag data-editor-node-key={node.key}>
            {childrens.length > 0 ? childrens : <br />}
          </Tag>
        )
      }
    }
  }

  return null
}
