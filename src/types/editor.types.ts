import { MouseEvent } from "react";
import { MediaType, MediaBlock } from "./media.types";

export interface EditorContext {
  addBlock: (block: MediaBlock) => void;
  getRelativePosition: (e: MouseEvent) => { x: number; y: number };
  setTool: (tool: Tool) => Tool | null;
}

export interface ToolUIContext {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  setTool: (tool: Tool) => Tool | null;
  addBlock: (block: MediaBlock) => void;
  resetTool: () => void;
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

  // Editor
  onMouseDown?: (e: MouseEvent, ctx: EditorContext) => void;
  onMouseMove?: (e: MouseEvent, ctx: EditorContext) => void;
  onMouseUp?: (e: MouseEvent, ctx: EditorContext) => void;
  onKeyDown?: (e: KeyboardEvent, ctx: EditorContext) => void;
}

export interface EditorState {
  currentTool: Tool | null;
  setTool: (tool: Tool) => Tool | null;
  resetTool: () => void;
  blocks: MediaBlock[];
  addBlock: (block: MediaBlock) => void;
}

export type EditorMode = null | {
  type: MediaType;
  payload?: any;
};
