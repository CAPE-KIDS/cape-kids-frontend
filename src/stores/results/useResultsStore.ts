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
  timelineStepId?: string;
  stepType: string;
  startedAt: number;
  completedAt?: number;
  interactions: Interaction[];
  isCorrect?: boolean;
}

interface ResultsState {
  results: StepResult[];
  currentResult: StepResult | null;
  wrongCount: number;
  addWrongCount: () => void;
  resetWrongCount: () => void;
  activeResultId: string | null;
  isLastCorrect: boolean | null;
  setIsLastCorrect: (isCorrect: boolean | null) => void;
  startTime: number | null;
  showTryAgain: boolean;
  showTryAgainTimeout: NodeJS.Timeout | null;
  setShowTryAgain: (delay: number) => void;
  startStepResult: (
    stepId: string,
    timelineId: string,
    stepType: string
  ) => void;
  completeStepResult: () => void;
  updateCurrentResult: (
    patch: Partial<StepResult>,
    callback?: () => void
  ) => void;
  captureInteraction: (interaction: Interaction) => void;
  clearResults: () => void;
  setCurrentResultRightResponse: () => void;
}

export const useResultsStore = create<ResultsState>((set, get) => ({
  results: [],
  currentResult: null,
  wrongCount: 0,
  isLastCorrect: null,
  setIsLastCorrect: (isCorrect) => {
    set({ isLastCorrect: isCorrect });
  },
  activeResultId: null,
  startTime: null,
  showTryAgain: false,
  showTryAgainTimeout: null,
  startStepResult: (stepId, timelineId, stepType) => {
    const now = Date.now();
    const newResult: StepResult = {
      stepId,
      timelineStepId: timelineId,
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

  addWrongCount: () => {
    set((state) => ({
      wrongCount: state.wrongCount + 1,
    }));
  },
  resetWrongCount: () => {
    set({ wrongCount: 0 });
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
  setCurrentResultRightResponse: () => {
    set((state) => {
      if (!state.currentResult) return {};
      console.log("Setting current result as correct");
      return {
        currentResult: {
          ...state.currentResult,
          isCorrect: true,
        },
      };
    });
  },

  updateCurrentResult: (partial, callback) => {
    set((state) => {
      if (!state.currentResult) return {};

      return {
        currentResult: {
          ...state.currentResult,
          ...partial,
        },
      };
    });
    callback && callback();
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

  setShowTryAgain: (delay) => {
    const { showTryAgainTimeout } = get();
    if (showTryAgainTimeout) {
      clearTimeout(showTryAgainTimeout);
    }

    set((state) => ({
      showTryAgain: true,
    }));

    const timeout = setTimeout(() => {
      set({ showTryAgain: false });
    }, delay || 1000);
    set({ showTryAgainTimeout: timeout });
  },

  clearResults: () =>
    set({
      results: [],
      currentResult: null,
      activeResultId: null,
      startTime: null,
    }),
}));
