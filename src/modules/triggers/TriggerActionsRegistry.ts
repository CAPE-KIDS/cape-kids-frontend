import { TriggerActionType, TriggerContext } from "./types";
import { goToNextStepAction } from "./actions/goToNextStepAction";
import { goToPrevStepAction } from "./actions/goToPrevStepAction";
import { goToStepAction } from "./actions/goToStepAction";
import { repeatAction } from "./actions/repeatAction";
import { stopAction } from "./actions/stopAction";

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
  goToStep: goToStepAction,
  repeat: repeatAction,
  stop: stopAction,
};
