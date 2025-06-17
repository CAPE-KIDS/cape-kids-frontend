import { useEffect, useMemo } from "react";
import { Trigger, TriggerContext } from "./types";
import { dispatchTriggerAction } from "./dispatcher";
import { useResultsStore } from "@/stores/results/useResultsStore";

export const useTimerTriggers = (
  triggers: Trigger[],
  context: TriggerContext
) => {
  const { captureInteraction } = useResultsStore();

  const timerTriggers = useMemo(
    () => triggers.filter((t) => t.metadata.type === "timer"),
    [triggers]
  );

  useEffect(() => {
    if (!context.started || timerTriggers.length === 0) {
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    timerTriggers.forEach((trigger) => {
      const rawDelay = trigger.metadata?.delay;
      const delay = typeof rawDelay === "number" ? rawDelay : Number(rawDelay);

      const safeDelay = !isNaN(delay) && delay >= 0 ? delay : 1000;

      const timeout = setTimeout(() => {
        console.log(`🔥 Disparando trigger: ${trigger.id} após ${safeDelay}ms`);

        const timestamp = performance.now();
        captureInteraction({
          type: "timer",
          timestamp,
          expectedTime: safeDelay,
          target: trigger.id,
        });

        dispatchTriggerAction(trigger, context);
      }, safeDelay);

      timers.push(timeout);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [
    context.started,
    context.activeStepId,
    timerTriggers,
    captureInteraction,
    context,
  ]);
};
