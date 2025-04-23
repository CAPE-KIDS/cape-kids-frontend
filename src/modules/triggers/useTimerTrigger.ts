import { useEffect } from "react";
import { Trigger } from "./types";
import { dispatchTriggerAction } from "./dispatcher";
import { TriggerContext } from "./types";

export const useTimerTriggers = (
  triggers: Trigger[],
  context: TriggerContext
) => {
  useEffect(() => {
    if (!context.started) return;

    const timerTriggers = triggers.filter((t) => t.metadata.type === "timer");

    const timers: NodeJS.Timeout[] = [];

    timerTriggers.forEach((trigger) => {
      const delay = Number(trigger.metadata.delay || 1000);
      const timer = setTimeout(() => {
        dispatchTriggerAction(trigger, context);
      }, delay);

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [triggers, context.activeStepId, context.started]);
};
