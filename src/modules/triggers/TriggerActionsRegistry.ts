import { TriggerActionType, TriggerContext } from "./types";
import { goToNextStepAction } from "./actions/goToNextStepAction";
import { goToPrevStepAction } from "./actions/goToPrevStepAction";

type TriggerActionDefinition = {
  type: TriggerActionType;
  label: string;
  execute: (context: TriggerContext) => void;
};

export const TriggerActionsRegistry: Record<
  TriggerActionType,
  TriggerActionDefinition
> = {
  goToNextStep: goToNextStepAction,
  goToPrevStep: goToPrevStepAction,
};
