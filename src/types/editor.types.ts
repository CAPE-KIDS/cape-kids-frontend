import { MouseEvent } from "react";
import { MediaType, MediaBlock } from "./media.types";
import { LexicalEditor } from "lexical";

export interface EditorContext {
  screen: Screen;
  addBlock: (block: MediaBlock) => void;
  getRelativePosition: (e: MouseEvent) => { x: number; y: number };
  setTool: (tool: Tool) => Tool | null;
  getRelativeSize: (px: number, total: number) => number;
  getAbsoluteSize: (px: number, total: number) => number;
  editor?: LexicalEditor;
}

interface Screen {
  element: HTMLDivElement | null;
  width: number | null;
  height: number | null;
}

export interface ToolUIContext {
  screen: Screen;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  setTool: (tool: Tool) => Tool | null;
  addBlock: (block: MediaBlock) => void;
  resetTool: () => void;
  getRelativeSize: (px: number, total: number) => number;
  getAbsoluteSize: (px: number, total: number) => number;
  getRelativePosition: (e: MouseEvent) => { x: number; y: number };
  editor?: LexicalEditor;
}

export interface Tool {
  type: MediaType;
  editorStyles?: string;
  icon: React.ReactNode;

  // UI
  onClick?: (e: MouseEvent, ctx: ToolUIContext) => void;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    ctx: ToolUIContext
  ) => void;
  onCancel?: (ctx: ToolUIContext) => void;
  onDragEnd?: (e: MouseEvent, ctx: ToolUIContext) => void;

  // Editor
  onMouseDown?: (e: MouseEvent, ctx: EditorContext) => void;
  onMouseMove?: (e: MouseEvent, ctx: EditorContext) => void;
  onMouseUp?: (e: MouseEvent, ctx: EditorContext) => void;
  onKeyDown?: (e: KeyboardEvent, ctx: EditorContext) => void;
}

export interface EditorState {
  screen: Screen | null;
  setEditorContainer: (screenData: Screen) => void;
  currentTool: Tool | null;
  setTool: (tool: Tool) => Tool | null;
  resetTool: () => void;
  blocks: MediaBlock[];
  updateBlock: (block: MediaBlock) => void;
  addBlock: (block: MediaBlock) => void;
  getRelativeSize: (px: number, total: number) => number;
  getAbsoluteSize: (px: number, total: number) => number;
}

export type EditorMode = null | {
  type: MediaType;
  payload?: any;
};
