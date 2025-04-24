import { useEffect } from "react";
import { Trigger } from "./types";
import { TriggerContext } from "./types";
import { dispatchTriggerAction } from "./dispatcher";

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
        blockIdsInCurrentStep.includes(t.stimullus_id)
    );

    if (keyboardTriggers.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiers = [
        e.ctrlKey ? "ctrl" : null,
        e.altKey ? "alt" : null,
        e.shiftKey ? "shift" : null,
      ].filter(Boolean);

      let key = e.key.toLowerCase();
      if (key === " ") key = "space";

      if (["control", "shift", "alt", "meta"].includes(key)) {
        if (modifiers.includes(key)) return;
      }

      const fullCombo = [...modifiers, key].join("+");

      console.log(`[KeyDown] Pressed: "${fullCombo}"`);

      keyboardTriggers.forEach((trigger) => {
        const triggerCombo = trigger.metadata.key.toLowerCase().trim();

        if (fullCombo === triggerCombo) {
          e.preventDefault();
          console.log(
            `[Trigger] Right shortcut: "${triggerCombo}" → ${trigger.metadata.action}`
          );
          dispatchTriggerAction(trigger, context);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    JSON.stringify(triggers.map((t) => t.metadata.key + t.stimullus_id)),
    context.activeStepId,
  ]);
};
