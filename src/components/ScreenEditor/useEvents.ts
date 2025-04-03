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
  const { currentTool, addBlock, setTool } = useEditorStore();

  // MouseDown
  const handleMouseDown = (e: MouseEvent) => {
    if (!currentTool) return;
    currentTool.onMouseDown?.(e, { addBlock, getRelativePosition, setTool });
  };

  // MouseMove
  const handleMouseMove = (e: MouseEvent) => {
    if (!currentTool) return;
    currentTool.onMouseMove?.(e, { addBlock, getRelativePosition, setTool });
  };

  // MouseUp
  const handleMouseUp = (e: MouseEvent) => {
    if (!currentTool) return;
    currentTool.onMouseUp?.(e, { addBlock, getRelativePosition, setTool });
  };

  const events = {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    events,
  };
};
