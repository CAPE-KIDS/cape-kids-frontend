import { useEffect } from "react";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { Trigger } from "@/modules/triggers/types";
import { TriggerActionsRegistry } from "@/modules/triggers/TriggerActionsRegistry";
import { useCanvasStore } from "@/modules/canvas/store/useCanvasStore";

export const useAnswerInterceptor = () => {
  const { currentResult, updateCurrentResult, setShowTryAgain, showTryAgain } =
    useResultsStore();
  const { activeStepId, steps, setActiveStepId, activeStep } = useCanvasStore();

  useEffect(() => {
    if (
      !currentResult ||
      !activeStepId ||
      showTryAgain ||
      currentResult.interactions.length === 0
    )
      return;

    const last = currentResult.interactions.at(-1);
    if (!last) return;

    const step = steps.find((s) => s.id === activeStepId);
    const config = step?.metadata?.config;
    if (!step) return;

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

    if (isCorrect && currentResult.isCorrect !== true) {
      updateCurrentResult({ isCorrect: true });

      if (config?.advanceOnWrong || activeStep?.type === "sequential_stimuli") {
        setTimeout(() => {
          TriggerActionsRegistry.goToNextStep.execute({
            activeStepId,
            steps,
            setActiveStepId,
          });
        }, 100);
      }
    } else if (!isCorrect && currentResult.isCorrect !== false) {
      updateCurrentResult({ isCorrect: false });
      if (config?.advanceOnWrong) {
        setTimeout(() => {
          TriggerActionsRegistry.goToNextStep.execute({
            activeStepId,
            steps,
            setActiveStepId,
          });
        }, 100);
      } else {
        if (activeStep?.type === "sequential_stimuli") {
          setShowTryAgain(
            activeStep?.metadata?.config?.feedbackDuration || 1000
          );
        }
      }
    }
  }, [currentResult]);
};
