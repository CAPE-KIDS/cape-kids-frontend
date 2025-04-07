import { TriggerAction, TriggerContext } from "./types";
import { TriggerActionsRegistry } from "./TriggerActionsRegistry";

export const executeTriggerAction = (
  action: TriggerAction,
  context: TriggerContext
) => {
  const fn = TriggerActionsRegistry[action.type];

  if (fn) {
    fn(action.payload as any, context);
  } else {
    console.warn("Ação de trigger desconhecida:", action.type);
  }
};
