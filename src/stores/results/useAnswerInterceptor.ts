import { useEffect } from "react";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { Trigger } from "@/modules/triggers/types";
import { TriggerActionsRegistry } from "@/modules/triggers/TriggerActionsRegistry";
import { useCanvasStore } from "@/modules/canvas/store/useCanvasStore";

export const useAnswerInterceptor = () => {
  const { currentResult, updateCurrentResult } = useResultsStore();
  const { activeStepId, steps, setActiveStepId } = useCanvasStore();

  useEffect(() => {
    if (
      !currentResult ||
      !activeStepId ||
      currentResult.isCorrect !== undefined ||
      currentResult.interactions.length === 0
    )
      return;

    const last = currentResult.interactions.at(-1);
    console.log("last", last);
    if (!last) return;

    const step = steps.find((s) => s.id === activeStepId);
    const config = step?.metadata?.config;
    if (!step || !config?.advanceOnWrong) return;

    const triggers: Trigger[] =
      step.metadata?.blocks?.flatMap((block) => block.triggers || []) || [];

    const isCorrect = triggers.some((trigger) => {
      const triggerType = trigger.metadata.type;
      if (triggerType === "keydown") {
        return last.type === "keydown" && trigger.metadata.key === last.key;
      }
      if (triggerType === "click") {
        return last.type === "click" && trigger.stimulus_id === last.target;
      }
      return false;
    });

    updateCurrentResult({ isCorrect });

    if (!isCorrect && config?.advanceOnWrong) {
      setTimeout(() => {
        TriggerActionsRegistry.goToNextStep.execute({
          activeStepId,
          steps,
          setActiveStepId,
        });
      }, 100);
    }
  }, [currentResult]);
};
