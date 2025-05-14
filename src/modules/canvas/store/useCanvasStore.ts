// modules/canvas/state/useCanvasStore.ts
import { TimelineStep } from "@shared/timeline";
import { create } from "zustand";

interface Screen {
  element: HTMLDivElement | null;
  width: number | null;
  height: number | null;
}

interface CanvasStore {
  screen: Screen | null;
  setScreen: (screenData: Screen) => void;
  steps: TimelineStep[];
  activeStepId: string | null;
  setSteps: (steps: TimelineStep[]) => void;
  setActiveStepId: (id: string) => void;
  activeStep: TimelineStep | null;
  setActiveStep: (step: TimelineStep) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  screen: null,
  setScreen: (screenData) => {
    set({
      screen: { ...screenData },
    });
  },
  steps: [],
  activeStepId: null,
  setSteps: (steps) => set({ steps, activeStepId: steps[0]?.id || null }),
  setActiveStepId: (id) => set({ activeStepId: id }),

  activeStep: null,
  setActiveStep: (step) => set({ activeStep: step }),
}));
