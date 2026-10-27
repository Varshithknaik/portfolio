export type NodeKey = string

export interface Editor {
  rootElement: HTMLElement | null
  editorState: EditorState
  pendingEditorState: EditorState | null
}

export interface EditorState {
  nodes: EditorNodeMap
  rootNodeKey: NodeKey
  selection: EditorSelection | null
}

export interface EditorNodeBase {
  type: string
  key: NodeKey
  parent: NodeKey | null
}

export interface ElementNodeBase extends EditorNodeBase {
  children: NodeKey[]
}

export interface RootNode extends ElementNodeBase {
  type: 'root'
  parent: null
}

export interface ParagraphNode extends ElementNodeBase {
  type: 'paragraph'
}

export interface HeadingNode extends ElementNodeBase {
  type: 'heading'
  level: 1 | 2 | 3
}

export type ElementNode = RootNode | ParagraphNode | HeadingNode

export interface TextNode extends EditorNodeBase {
  type: 'text'
  text: string
  format: number
  links?: {
    href: string
  } | null
}

export type EditorNode = ElementNode | TextNode
export type EditorNodeMap = Map<NodeKey, EditorNode>

export interface EditorSelection {
  anchorNode: EditorNode | null
  anchorOffset: number
  focusNode: EditorNode | null
  focusOffset: number
  type: 'caret' | 'range'
}

export type BlockType = 'paragraph' | 'heading'

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
  | {
      type: 'toggleMark'
      format: number
      origin: 'toolbar' | 'keyboard'
    }
  | {
      type: 'setBlockType'
      blockType: BlockType
      level?: 1 | 2 | 3
      origin: 'toolbar'
    }
