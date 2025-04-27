import { MouseEvent } from "react";
import { MediaType, MediaBlock } from "../modules/media/types";
import { LexicalEditor } from "lexical";
import { Trigger } from "@/modules/triggers/types";
import { StepType, TimelineStep } from "@/modules/timeline/types";

export interface EditorContext {
  screen: Screen;
  addStep: (block: MediaBlock) => void;
  getRelativePosition: (e: MouseEvent) => { x: number; y: number };
  setTool: (tool: Tool) => Tool | null;
  editor?: LexicalEditor;
}

export interface Screen {
  element: HTMLDivElement | null;
  width: number | null;
  height: number | null;
}

export interface ToolUIContext {
  screen: Screen;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  setTool: (tool: Tool) => Tool | null;
  addStep: (block: MediaBlock) => void;
  resetTool: () => void;
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

export type EditorContextType = "main" | "stimuli";
export interface HistorySnapshot {
  stepType: StepType;
  blocks: MediaBlock[];
}

export interface EditorState {
  screen: Screen | null;
  setEditorContainer: (screenData: Screen) => void;
  editorContext: EditorContextType;
  setEditorContext: (context: EditorContextType) => void;
  currentTool: Tool | null;
  setTool: (tool: Tool) => Tool | null;
  resetTool: () => void;
  blocks: MediaBlock[];
  historyStack: HistorySnapshot[] | [];
  pushHistory: (stepType: StepType) => void;
  popHistory: () => void;
  clearHistory: () => void;
  updateStep: (block: MediaBlock) => void;
  addStep: (block: MediaBlock) => void;
  addScreenBlock: () => void;
  deleteBlock: (blockId: string) => void;
  calculateRenderPosititon: (steps: TimelineStep[]) => StepPositions;
  getTriggersForBlock: (blockId: string) => Trigger[];
  addTriggerToBlock: (blockId: string | null, trigger: Trigger) => void;
  getAllTriggers: () => Trigger[];
  removeTriggerFromBlock: (blockId: string | null, triggerId: string) => void;
  mountStep: (
    timelineId: string,
    positions: StepPositions,
    type: StepType,
    title: string
  ) => TimelineStep;
  clearEditor: () => void;
}

export interface StepPositions {
  index: number;
  x: number;
  y: number;
}

export type EditorMode = null | {
  type: MediaType;
  payload?: any;
};
