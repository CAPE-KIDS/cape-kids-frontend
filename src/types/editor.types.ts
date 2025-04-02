import { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { MediaType, MediaBlock } from "./media.types";
import { LucideProps } from "lucide-react";

export interface ScreenUtils {
  addBlock: (block: MediaBlock) => void;
  getRelativePosition: (e: MouseEvent) => { x: number; y: number };
}

export interface Tool {
  type: MediaType;
  cursor:
    | "crosshair"
    | "default"
    | "pointer"
    | "text"
    | "cell"
    | "move"
    | "none";
  icon: React.ReactNode;
  onMouseDown?: (e: MouseEvent, utils: ScreenUtils) => void;
  onMouseMove?: (e: MouseEvent, utils: ScreenUtils) => void;
  onMouseUp?: (e: MouseEvent, utils: ScreenUtils) => void;
}

export interface EditorState {
  currentTool: Tool | null;
  setTool: (tool: Tool) => void;
  blocks: MediaBlock[];
  addBlock: (block: MediaBlock) => void;
}

export type EditorMode = null | {
  type: MediaType;
  payload?: any;
};
