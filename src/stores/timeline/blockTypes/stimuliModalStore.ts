import { MediaBlock } from "@/modules/media/types";
import { StimuliBlockConfig, TimelineStep } from "@/modules/timeline/types";
import { StepPositions } from "@/types/editor.types";
import { create } from "zustand";

interface StimuliModalState {
  open: boolean;
  config: StimuliBlockConfig;
  openModal: () => void;
  closeModal: () => void;
  setConfig: (data: Partial<StimuliBlockConfig>) => void;
  addStimulusStep: (step: TimelineStep) => void;
  updateStimulusStep: (step: TimelineStep) => void;
  removeStimulusStep: (id: string) => void;
  stimulusEditorOpen: boolean;
  openStimulusEditorModal: () => void;
  closeStimulusEditorModal: () => void;
  mountStimulusStep: (blocks: MediaBlock[]) => TimelineStep;
  calculateOrderIndex: () => number;
  clear: () => void;
}

export const useStimuliModal = create<StimuliModalState>((set, get) => ({
  open: false,
  config: {
    trials: 1,
    stimulusDuration: 1000,
    interStimulusInterval: 300,
    showFeedback: false,
    randomize: false,
    steps: [],
  },
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),

  stimulusEditorOpen: false,
  openStimulusEditorModal: () => set({ stimulusEditorOpen: true }),
  closeStimulusEditorModal: () => set({ stimulusEditorOpen: false }),

  setConfig: (data) =>
    set((state) => ({
      config: {
        ...state.config,
        ...data,
      },
    })),

  mountStimulusStep: (blocks): TimelineStep => {
    const step: TimelineStep = {
      id: crypto.randomUUID(),
      timelineId: "",
      orderIndex: get().calculateOrderIndex(),
      type: "sequential_stimuli",
      metadata: {
        title: "Stimulus",
        positionX: 0,
        positionY: 0,
        blocks: blocks,
        triggers: [],
      },
    };

    console.log("Mounting step", step);

    set((state) => ({
      config: {
        ...state.config,
        steps: [...state.config.steps, step],
      },
    }));

    return step;
  },

  calculateOrderIndex: (): number => {
    const { steps } = get().config;

    if (steps.length === 0) {
      return 1;
    }

    const index = Math.max(...steps.map((step) => step.orderIndex || 0));
    return index + 1;
  },

  addStimulusStep: (step) =>
    set((state) => ({
      config: {
        ...state.config,
        steps: [...state.config.steps, step],
      },
    })),

  updateStimulusStep: (step) =>
    set((state) => ({
      config: {
        ...state.config,
        steps: state.config.steps.map((s) => (s.id === step.id ? step : s)),
      },
    })),

  removeStimulusStep: (id) =>
    set((state) => ({
      config: {
        ...state.config,
        steps: state.config.steps.filter((s) => s.id !== id),
      },
    })),

  clear: () =>
    set(() => ({
      open: false,
      config: {
        trials: 1,
        stimulusDuration: 1000,
        interStimulusInterval: 300,
        showFeedback: false,
        randomize: false,
        steps: [],
      },
    })),
}));
