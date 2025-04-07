import { TriggerActionPayloadMap, TriggerContext } from "../types";

export const goToNextStep = (
  payload: TriggerActionPayloadMap["goToNextStep"],
  context: TriggerContext
) => {
  console.log("payload", payload);
  console.log("context", context);
};

export const goToNextStepAction = {
  type: "goToNextStep" as const,
  execute: goToNextStep,
};
