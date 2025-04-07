import { Trigger } from "./types";
import { TriggerActionsRegistry } from "./TriggerActionsRegistry";
import { TriggerContext } from "./types";

export const dispatchTriggerAction = (
  trigger: Trigger,
  context: TriggerContext
) => {
  const { action } = trigger.metadata;
  const actionDefinition = TriggerActionsRegistry[action];

  if (!actionDefinition) {
    console.warn(`[Trigger] Ação "${action}" não está registrada.`);
    return;
  }

  actionDefinition.execute(context);
};
