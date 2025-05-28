// modules/triggers/useKeyboardTriggers.ts
import { useEffect } from "react";
import { Trigger } from "./types";
import { TriggerContext } from "./types";
import { dispatchTriggerAction } from "./dispatcher";
import { normalizeKeyCombo } from "@/utils/functions";

export const useKeyboardTriggers = (
  triggers: Trigger[],
  context: TriggerContext
) => {
  useEffect(() => {
    const currentStep = context.steps.find(
      (s) => s.id === context.activeStepId
    );
    if (!currentStep) return;

    const blockIdsInCurrentStep =
      currentStep.metadata.blocks?.map((b) => b.id) || [];

    const keyboardTriggers = triggers.filter(
      (t) =>
        t?.metadata?.type === "keydown" &&
        typeof t?.metadata?.key === "string" &&
        t.metadata.key.trim() !== "" &&
        t.metadata.key !== "*" &&
        blockIdsInCurrentStep.includes(t.stimulus_id)
    );

    if (keyboardTriggers.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const fullCombo = normalizeKeyCombo(e);

      if (!fullCombo) return;

      keyboardTriggers.forEach((trigger) => {
        if (!trigger.metadata.key) return;
        const triggerCombo = trigger.metadata.key.toLowerCase().trim();

        if (fullCombo === triggerCombo) {
          e.preventDefault();
          if (currentStep.type === "multi_trigger_stimuli") {
            return;
          }
          dispatchTriggerAction(trigger, context);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    JSON.stringify(triggers.map((t) => t.metadata.key + t.stimulus_id)),
    context.activeStepId,
  ]);
};
