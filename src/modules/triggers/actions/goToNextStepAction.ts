import { TriggerAction, TriggerContext } from "../types";

const isOptional = (step: any) =>
  step?.metadata?.config?.optional_step || false;

export const goToNextStepAction: TriggerAction = {
  label: "Go to Next Step",
  type: "goToNextStep" as const,
  execute: (context: TriggerContext) => {
    const { steps, activeStepId, setActiveStepId } = context;
    const index = steps.findIndex((s) => s.id === activeStepId);
    const current = steps[index];
    const next = steps[index + 1];

    if (!next) {
      console.log("Is the last step.");
      return;
    }

    const comingFromOptional = isOptional(current);
    const goingToOptional = isOptional(next);

    if (goingToOptional && !comingFromOptional) {
      const nextNonOptionalIndex = steps.findIndex((s, idx) => {
        return idx > index && !isOptional(s) && !s.isFeedbackStep;
      });

      if (nextNonOptionalIndex !== -1) {
        setActiveStepId(steps[nextNonOptionalIndex].id);
        return;
      } else {
        console.warn("No non-optional steps found after this point.");
        return;
      }
    }

    setActiveStepId(next.id);
  },
};
