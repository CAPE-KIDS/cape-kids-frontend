// modules/trigger/useTriggerHandler.ts
import { Trigger } from "./types";
import { dispatchTriggerAction } from "./dispatcher";
import { useCanvasStore } from "../canvas/store/useCanvasStore";

export const useTriggerHandler = () => {
  const { activeStepId, steps, setActiveStepId } = useCanvasStore();

  const context = {
    activeStepId,
    steps,
    setActiveStepId,
  };

  const eventMap: Record<
    string,
    (fn: () => void) => Record<string, () => void>
  > = {
    click: (fn) => ({ onClick: fn }),
    doubleClick: (fn) => ({ onDoubleClick: fn }),
    hover: (fn) => ({ onMouseEnter: fn }),
  };

  const getHandlersFromTriggers = (triggers: Trigger[] = []) => {
    return triggers.reduce((acc, trigger) => {
      const wrapper = eventMap[trigger.metadata.type];
      if (!wrapper) return acc;

      const handler = () => dispatchTriggerAction(trigger, context);

      return {
        ...acc,
        ...wrapper(handler),
      };
    }, {});
  };

  return { getHandlersFromTriggers };
};
