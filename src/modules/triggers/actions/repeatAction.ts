import { TriggerAction, TriggerContext } from "../types";

export const repeatAction: TriggerAction = {
  label: "Repeat Step",
  type: "repeat",
  execute: (context: TriggerContext) => {
    const { steps, activeStepId, setActiveStepId, targetStepId } = context;

    if (targetStepId) {
      setActiveStepId(targetStepId);
      console.log(`Repeat action: ${targetStepId}`);
    } else {
      console.warn("No target step ID provided. Cannot navigate.");
    }
  },
};
