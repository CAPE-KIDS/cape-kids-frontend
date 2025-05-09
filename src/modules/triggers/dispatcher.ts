import { Trigger } from "./types";
import { TriggerActionsRegistry } from "./TriggerActionsRegistry";
import { TriggerContext } from "./types";
import { useResultsStore } from "@/stores/results/useResultsStore";

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

  setTimeout(() => {
    actionDefinition.execute(context);
  }, 0);
};
