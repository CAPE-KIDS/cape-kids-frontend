import { TriggerAction, TriggerContext } from "../types";

export const stopAction: TriggerAction = {
  label: "Stop",
  type: "stop",
  execute: (context: TriggerContext) => {
    const { steps, setActiveStepId } = context;

    const lastStep = steps[steps.length - 1];

    if (lastStep) {
      setActiveStepId(lastStep.id);
      console.log(`Stopped at step: ${lastStep.id}`);
    } else {
      console.log("No steps available to stop at.");
    }
  },
};
