import { useEffect, useState } from "react";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { Trigger } from "@/modules/triggers/types";
import { TriggerActionsRegistry } from "@/modules/triggers/TriggerActionsRegistry";
import { useCanvasStore } from "@/modules/canvas/store/useCanvasStore";
import _, { add } from "lodash";

export const useAnswerInterceptor = () => {
  const {
    currentResult,
    updateCurrentResult,
    setShowTryAgain,
    showTryAgain,
    results,
    wrongCount,
    addWrongCount,
    resetWrongCount,
    setCurrentResultRightResponse,
    setIsLastCorrect,
  } = useResultsStore();
  const { activeStepId, steps, setActiveStepId, activeStep } = useCanvasStore();
  const [isUpdating, setIsUpdating] = useState(false);
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

    const goToNextStep = () => {
      TriggerActionsRegistry.goToNextStep.execute({
        activeStepId,
        steps,
        setActiveStepId,
      });
    };

    const handleResponse = (isCorrect: boolean) => {
      if (config?.level) {
        if (isUpdating) return;
        setIsUpdating(true);

        if (isCorrect && currentResult?.isCorrect === undefined) {
          setCurrentResultRightResponse();
          setIsLastCorrect(true);
          resetWrongCount();
          setTimeout(() => {
            goToNextStep();
            setIsUpdating(false);
          }, 100);
          return;
        }

        if (config.level.onWrongAnswer === "stop") {
          resetWrongCount();
          setTimeout(() => {
            TriggerActionsRegistry.stop.execute({
              activeStepId,
              steps,
              setActiveStepId,
            });
            setIsUpdating(false);
          }, 100);
          return;
        }

        if (config.level.onWrongAnswer === "goToNextStep") {
          resetWrongCount();
          setTimeout(() => {
            TriggerActionsRegistry.goToNextStep.execute({
              activeStepId,
              steps,
              setActiveStepId,
            });
            setIsUpdating(false);
          }, 100);
          return;
        }

        if (
          config.level.onWrongAnswer === "goToStep" &&
          config.level?.goToStepId
        ) {
          const targetStepId = steps.filter(
            (s) => s?.step_id === config.level?.goToStepId
          )[0].id;

          if (targetStepId) {
            const duration =
              activeStep?.metadata?.config?.feedbackDuration || 1000;
            setShowTryAgain(duration);

            setTimeout(() => {
              TriggerActionsRegistry.goToStep.execute({
                activeStepId,
                steps,
                setActiveStepId,
                targetStepId,
              });
              setIsUpdating(false);
              setIsLastCorrect(null);
              resetWrongCount();
            }, duration);

            return;
          }
          return;
        }

        if (config.level.onWrongAnswer === "repeat") {
          const targetStepId = steps.filter(
            (s) => s?.step_id === step?.step_id
          )[0].id;

          if (targetStepId) {
            const duration =
              activeStep?.metadata?.config?.feedbackDuration || 1000;
            setShowTryAgain(duration);

            setTimeout(() => {
              TriggerActionsRegistry.repeat.execute({
                activeStepId,
                steps,
                setActiveStepId,
                targetStepId,
              });
              setIsUpdating(false);
              setIsLastCorrect(null);
              resetWrongCount();
            }, duration);

            return;
          }
          return;
        }

        if (
          config.level.repeatAmount &&
          wrongCount < config.level.repeatAmount - 1
        ) {
          const goToStep = config.level.goToStepId;
          const targetStepId = steps.filter(
            (s) => s?.step_id === step?.step_id
          )[0].id;

          addWrongCount();
          const tryMessageDuration =
            activeStep?.metadata?.config?.feedbackDuration || 1000;
          setShowTryAgain(tryMessageDuration);
          setTimeout(() => {
            TriggerActionsRegistry.goToStep.execute({
              activeStepId,
              steps,
              setActiveStepId,
              targetStepId: goToStep || targetStepId,
            });
            setIsLastCorrect(null);
            setIsUpdating(false);
          }, tryMessageDuration);

          return;
        }
        const action = config.level
          .onWrongAnswer as keyof typeof TriggerActionsRegistry;
        updateCurrentResult({ isCorrect: false }, () => {
          TriggerActionsRegistry[action]?.execute({
            activeStepId,
            steps,
            setActiveStepId,
            targetStepId: config.level.goToStepId,
          });
          setIsLastCorrect(false);
          setIsUpdating(false);
        });

        return;
      }

      if (isCorrect && currentResult.isCorrect !== true) {
        updateCurrentResult({ isCorrect: true });
        setIsLastCorrect(true);
        if (
          config?.advanceOnWrong ||
          activeStep?.type === "sequential_stimuli"
        ) {
          setTimeout(() => {
            goToNextStep();
            setIsUpdating(false);
          }, 100);
        }
      } else if (!isCorrect && currentResult.isCorrect !== false) {
        updateCurrentResult({ isCorrect: false });
        setIsLastCorrect(false);
        if (config?.advanceOnWrong) {
          setTimeout(() => {
            goToNextStep();
            setIsUpdating(false);
          }, 100);
        } else {
          if (config && activeStep?.type === "sequential_stimuli") {
            setShowTryAgain(
              activeStep?.metadata?.config?.feedbackDuration || 1000
            );
            setIsUpdating(false);
          }
        }
      }
    };

    const triggers: Trigger[] =
      step.metadata?.blocks?.flatMap((block) => block.triggers || []) || [];

    if (step.type === "multi_trigger_stimuli") {
      if (
        triggers.length > 1 &&
        currentResult.interactions.length === triggers.length
      ) {
        const formatedTriggersResults = triggers.map((trigger) => {
          const triggerType = trigger.metadata.type;
          if (triggerType === "keydown") {
            return {
              type: "keydown",
              key: trigger.metadata.key,
            };
          }
          if (triggerType === "click") {
            return {
              type: "click",
              target: trigger.stimulus_id,
            };
          }
          return null;
        });

        const formatedInteractionsResults = currentResult.interactions.map(
          (interaction) => {
            if (interaction.type === "keydown") {
              return {
                type: "keydown",
                key: interaction.key,
              };
            }
            if (interaction.type === "click") {
              return {
                type: "click",
                target: interaction.target,
              };
            }
            return null;
          }
        );

        const isCorrect = _.isEqual(
          formatedTriggersResults,
          formatedInteractionsResults
        );

        handleResponse(isCorrect);
        return;
      }
      return;
    }

    const isCorrect = triggers.some((trigger) => {
      const triggerType = trigger.metadata.type;

      if (triggerType === "keydown") {
        return last.type === "keydown" && trigger.metadata.key === last.key;
      }
      if (triggerType === "click") {
        return last.type === "click" && trigger.stimulus_id === last.target;
      }
      if (
        triggerType === "timer" &&
        currentResult.interactions[0].type === "timer" &&
        triggers.length === 1
      ) {
        return true;
      }
      return false;
    });

    handleResponse(isCorrect);
  }, [currentResult]);
};
