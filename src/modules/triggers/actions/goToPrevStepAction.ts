import { TriggerAction, TriggerContext } from "../types";

export const goToPrevStepAction: TriggerAction = {
  label: "Go to Previous Step",
  type: "goToPrevStep",
  execute: (context: TriggerContext) => {
    const { steps, activeStepId, setActiveStepId } = context;
    const index = steps.findIndex((s) => s.id === activeStepId);
    const prev = steps[index - 1];

    if (prev) {
      setActiveStepId(prev.id);
    } else {
      console.log("Is the first step already.");
    }
  },
};
