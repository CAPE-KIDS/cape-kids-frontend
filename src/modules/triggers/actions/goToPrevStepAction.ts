import { toast } from "sonner";
import { TriggerContext } from "../types";

export const goToPrevStepAction = {
  type: "goToPrevStep" as const,
  execute: (context: TriggerContext) => {
    const { steps, activeStepId, setActiveStepId } = context;
    const index = steps.findIndex((s) => s.id === activeStepId);
    const prev = steps[index - 1];

    toast("Go to previous step action triggered!", {
      position: "top-right",
    });

    if (prev) {
      setActiveStepId(prev.id);
    } else {
      console.log("Is the first step already.");
    }
  },
};
