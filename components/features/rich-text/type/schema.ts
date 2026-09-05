export type Mark =
  | 'bold'
  | 'italic'
  | 'underline'
  | { type: 'link'; href: string }

export type NodeKey = string

export interface EditorNodeBase {
  type: string
  key: NodeKey
  parent: NodeKey | null
}

export interface ElementNodeBase extends EditorNodeBase {
  children: NodeKey[]
}

export interface TextNode extends EditorNodeBase {
  type: 'text'
  text: string
  marks: Mark[]
}

export interface RootNode extends ElementNodeBase {
  type: 'root'
  parent: null
}

export interface HeadingNode extends ElementNodeBase {
  type: 'heading'
  level: 1 | 2 | 3
}

interface ParagraphNode extends ElementNodeBase {
  type: 'paragraph'
}

export type ElementNode = RootNode | ParagraphNode | HeadingNode
export type EditorNode = ElementNode | TextNode

export type NodeMap = Record<NodeKey, EditorNode>

export interface EditorSelection {
  anchorNode: EditorNode | null
  anchorOffset: number
  focusNode: EditorNode | null
  focusOffset: number
  type: 'caret' | 'range'
}

export interface EditorState {
  nodeMap: NodeMap
  rootKey: NodeKey
  selection: EditorSelection | null
}

export type Transaction =
  | {
      type: 'insertText'
      text: string
      origin: 'keyboard'
    }
  | {
      type: 'deleteText'
      text: string
      origin: 'keyboard'
    }
