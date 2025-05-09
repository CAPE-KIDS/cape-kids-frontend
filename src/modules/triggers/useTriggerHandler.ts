// modules/trigger/useTriggerHandler.ts
import { Trigger, TriggerContext } from "./types";
import { dispatchTriggerAction } from "./dispatcher";
import { useCanvasStore } from "../canvas/store/useCanvasStore";

export const useTriggerHandler = () => {
  const { activeStepId, steps, setActiveStepId } = useCanvasStore();

  const context = {
    activeStepId,
    steps,
    setActiveStepId,
  } as TriggerContext;

  const eventMap: Record<
    string,
    (fn: () => void) => Record<string, () => void>
  > = {
    click: (fn) => ({ onClick: fn }),
    hover: (fn) => ({ onMouseEnter: fn }),
    rightClick: (fn) => ({ onContextMenu: fn }),
    wheel: (fn) => ({ onWheel: fn }),
    dragStart: (fn) => ({ onDragStart: fn }),
    dragEnd: (fn) => ({ onDragEnd: fn }),
  };

  const getHandlersFromTriggers = (triggers: Trigger[] = []) => {
    const handlers: Record<string, () => void> = {};

    triggers.forEach((trigger) => {
      const wrapper = eventMap[trigger.metadata.type];
      if (!wrapper) return;

      const handler = () => dispatchTriggerAction(trigger, context);

      const eventHandlers = wrapper(handler);

      for (const [key, value] of Object.entries(eventHandlers)) {
        const existing = handlers[key];
        handlers[key] = existing
          ? () => {
              existing();
              value();
            }
          : value;
      }
    });

    return handlers;
  };

  return { getHandlersFromTriggers };
};
