// stores/results/useResultsStore.ts
import { create } from "zustand";

export interface Interaction {
  type: string;
  timestamp: number;
  target?: EventTarget | string;
  key?: string;
  x?: number;
  y?: number;
}

export interface StepResult {
  stepId: string;
  stepType: string;
  startedAt: number;
  completedAt?: number;
  interactions: Interaction[];
  isCorrect?: boolean;
}

interface ResultsState {
  results: StepResult[];
  currentResult: StepResult | null;
  activeResultId: string | null;
  startTime: number | null;

  startStepResult: (stepId: string, stepType: string) => void;
  completeStepResult: () => void;
  updateCurrentResult: (patch: Partial<StepResult>) => void;
  captureInteraction: (interaction: Interaction) => void;
  clearResults: () => void;
}

export const useResultsStore = create<ResultsState>((set, get) => ({
  results: [],
  currentResult: null,
  activeResultId: null,
  startTime: null,

  startStepResult: (stepId, stepType) => {
    const now = Date.now();
    const newResult: StepResult = {
      stepId,
      stepType,
      startedAt: now,
      interactions: [],
    };

    set({
      currentResult: newResult,
      activeResultId: stepId,
      startTime: now,
    });
  },

  completeStepResult: () => {
    const { currentResult, results } = get();

    if (!currentResult) return;

    const now = Date.now();
    const completedResult = {
      ...currentResult,
      completedAt: now,
    };

    set({
      results: [...results, completedResult],
      currentResult: null,
      activeResultId: null,
      startTime: null,
    });
  },

  updateCurrentResult: (partial) => {
    set((state) => {
      if (!state.currentResult) return {};

      return {
        currentResult: {
          ...state.currentResult,
          ...partial,
        },
      };
    });
  },

  captureInteraction: (interaction) => {
    const { currentResult, startTime } = get();
    if (!currentResult || !startTime) return;

    const timestamp = Date.now();

    const updatedResult = {
      ...currentResult,
      interactions: [
        ...currentResult.interactions,
        {
          ...interaction,
          timestamp,
        },
      ],
    };

    set({
      currentResult: updatedResult,
    });
  },

  clearResults: () =>
    set({
      results: [],
      currentResult: null,
      activeResultId: null,
      startTime: null,
    }),
}));
