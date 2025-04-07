// modules/canvas/state/useCanvasStore.ts
import { create } from "zustand";
import { StepType } from "../types";

interface CanvasStore {
  steps: StepType[];
  activeStepId: string | null;
  setSteps: (steps: StepType[]) => void;
  setActiveStepId: (id: string) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  steps: [],
  activeStepId: null,
  setSteps: (steps) => set({ steps, activeStepId: steps[0]?.id || null }),
  setActiveStepId: (id) => set({ activeStepId: id }),
}));
