// components/ScreenEditor/useEvents.ts
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { MouseEvent } from "react";

// Helpers
const getRelativePosition = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

export const useEvents = () => {
  const { currentTool, addBlock } = useEditorStore();

  // MouseDown
  const handleMouseDown = (e: MouseEvent) => {
    if (!currentTool) return;
    currentTool.onMouseDown?.(e, { addBlock, getRelativePosition });
  };

  // MouseMove
  const handleMouseMove = (e: MouseEvent) => {
    if (!currentTool) return;
    currentTool.onMouseMove?.(e, { addBlock, getRelativePosition });
  };

  // MouseUp
  const handleMouseUp = (e: MouseEvent) => {
    if (!currentTool) return;
    currentTool.onMouseUp?.(e, { addBlock, getRelativePosition });
  };

  const events = {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  };

  return {
    events,
  };
};
