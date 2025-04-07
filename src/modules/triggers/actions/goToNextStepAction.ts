import { TriggerContext } from "../types";
import { toast } from "sonner";

export const goToNextStepAction = {
  type: "goToNextStep" as const,
  execute: (context: TriggerContext) => {
    const { steps, activeStepId, setActiveStepId } = context;
    const index = steps.findIndex((s) => s.id === activeStepId);
    const next = steps[index + 1];

    toast("Go to next step action triggered!", {
      position: "top-right",
    });

    if (next) {
      setActiveStepId(next.id);
    } else {
      console.log("Is the last step.");
    }
  },
};
