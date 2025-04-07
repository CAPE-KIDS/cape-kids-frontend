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
  const { currentTool, addBlock, setTool, screen } = useEditorStore();

  // MouseDown
  const handleMouseDown = (e: MouseEvent) => {
    if (!currentTool || !screen) return;
    currentTool.onMouseDown?.(e, {
      screen,
      addBlock,
      getRelativePosition,
      setTool,
    });
  };

  // MouseMove
  const handleMouseMove = (e: MouseEvent) => {
    if (!currentTool || !screen) return;

    currentTool.onMouseMove?.(e, {
      screen,
      addBlock,
      getRelativePosition,
      setTool,
    });
  };

  // MouseUp
  const handleMouseUp = (e: MouseEvent) => {
    if (!currentTool || !screen) return;

    currentTool.onMouseUp?.(e, {
      screen,
      addBlock,
      getRelativePosition,
      setTool,
    });
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
