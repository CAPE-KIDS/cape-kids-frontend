import {
  TriggerActionType,
  TriggerActionPayloadMap,
  TriggerContext,
} from "./types";
import { goToNextStepAction } from "./actions/goToNextStep";

export const TriggerActionsRegistry: {
  [K in TriggerActionType]: (
    payload: TriggerActionPayloadMap[K],
    context: TriggerContext
  ) => void;
} = {
  goToNextStep: goToNextStepAction.execute,
};
