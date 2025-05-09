import { useEffect } from "react";
import { Trigger } from "./types";
import { dispatchTriggerAction } from "./dispatcher";
import { TriggerContext } from "./types";
import { useResultsStore } from "@/stores/results/useResultsStore";

export const useTimerTriggers = (
  triggers: Trigger[],
  context: TriggerContext
) => {
  const { captureInteraction } = useResultsStore();

  useEffect(() => {
    if (!context.started) return;

    const timerTriggers = triggers.filter((t) => t.metadata.type === "timer");

    const timers: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    timerTriggers.forEach((trigger) => {
      const rawDelay = trigger.metadata?.delay;
      const delay = typeof rawDelay === "number" ? rawDelay : Number(rawDelay);

      const safeDelay = !isNaN(delay) && delay >= 0 ? delay : 1000;

      let elapsed = 0;
      // console.log(`⏱️ ${elapsed / 1000}s elapsed`);

      const interval = setInterval(() => {
        elapsed += 1000;
        // console.log(`⏱️ ${elapsed / 1000}s elapsed`);
      }, 1000);
      intervals.push(interval);

      const timeout = setTimeout(() => {
        captureInteraction({
          type: "timer",
          timestamp: Date.now(),
          target: trigger.id,
        });

        dispatchTriggerAction(trigger, context);
        clearInterval(interval);
      }, safeDelay);
      timers.push(timeout);
    });

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [context.activeStepId, context.started]);
};
