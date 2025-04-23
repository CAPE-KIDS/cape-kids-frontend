import { TriggerAction, TriggerContext } from "../types";

export const goToNextStepAction: TriggerAction = {
  label: "Go to Next Step",
  type: "goToNextStep" as const,
  execute: (context: TriggerContext) => {
    const { steps, activeStepId, setActiveStepId } = context;
    const index = steps.findIndex((s) => s.id === activeStepId);
    const next = steps[index + 1];

    if (next) {
      setActiveStepId(next.id);
    } else {
      console.log("Is the last step.");
    }
  },
};
