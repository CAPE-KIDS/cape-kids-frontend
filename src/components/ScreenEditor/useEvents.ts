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
  const { currentTool, addStep, setTool, screen } = useEditorStore();

  // MouseDown
  const handleMouseDown = (e: MouseEvent) => {
    if (!currentTool || !screen) return;
    currentTool.onMouseDown?.(e, {
      screen,
      addStep,
      getRelativePosition,
      setTool,
    });
  };

  // MouseMove
  const handleMouseMove = (e: MouseEvent) => {
    if (!currentTool || !screen) return;

    currentTool.onMouseMove?.(e, {
      screen,
      addStep,
      getRelativePosition,
      setTool,
    });
  };

  // MouseUp
  const handleMouseUp = (e: MouseEvent) => {
    if (!currentTool || !screen) return;

    currentTool.onMouseUp?.(e, {
      screen,
      addStep,
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
