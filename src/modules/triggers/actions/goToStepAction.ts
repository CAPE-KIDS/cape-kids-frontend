import { set } from "lodash";
import { TriggerAction, TriggerContext } from "../types";

export const goToStepAction: TriggerAction = {
  label: "Go to Step",
  type: "goToStep",
  execute: (context: TriggerContext) => {
    const { steps, activeStepId, setActiveStepId, targetStepId } = context;

    if (targetStepId) {
      setActiveStepId(targetStepId);
      console.log(`Navigated to step: ${targetStepId}`);
    } else {
      console.warn("No target step ID provided. Cannot navigate.");
    }
  },
};
