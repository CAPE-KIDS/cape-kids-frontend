import { useEffect } from "react";
import { useResultsStore } from "./useResultsStore";
import { normalizeKeyCombo } from "@/utils/functions";

const MOUSE_EVENTS = ["click", "contextmenu", "wheel"] as const;
const KEY_EVENTS = ["keydown"] as const;

export const useInteractionCapture = () => {
  const { activeResultId, startTime, captureInteraction } = useResultsStore();

  useEffect(() => {
    if (!activeResultId || !startTime) return;

    const handleMouseEvent = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;

      const rect = target?.getBoundingClientRect?.();
      const x = rect ? ((e.clientX - rect.left) / rect.width) * 100 : undefined;
      const y = rect ? ((e.clientY - rect.top) / rect.height) * 100 : undefined;

      let blockId = undefined;
      while (target && !blockId) {
        blockId = target.dataset?.blockId;
        target = target.parentElement;
      }

      captureInteraction({
        type: e.type,
        timestamp: Date.now(),
        target: blockId || target || "Screen",
        x,
        y,
      });
    };

    const handleKeyEvent = (e: KeyboardEvent) => {
      const keyCombo = normalizeKeyCombo(e);
      if (!keyCombo) return;

      captureInteraction({
        type: "keydown",
        timestamp: Date.now(),
        target: activeResultId,
        key: keyCombo,
      });
    };

    MOUSE_EVENTS.forEach((event) =>
      document.addEventListener(event, handleMouseEvent)
    );
    KEY_EVENTS.forEach((event) =>
      document.addEventListener(event, handleKeyEvent)
    );

    return () => {
      MOUSE_EVENTS.forEach((event) =>
        document.removeEventListener(event, handleMouseEvent)
      );
      KEY_EVENTS.forEach((event) =>
        document.removeEventListener(event, handleKeyEvent)
      );
    };
  }, [activeResultId, startTime]);
};
