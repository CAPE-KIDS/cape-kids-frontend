// stores/timeline/blockTypes/useStimuliModal.ts
import { MediaBlock } from "@/modules/media/types";
import { StimuliBlockConfig, TimelineStep } from "@/modules/timeline/types";
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
  duplicateStimulusStep: (id: string) => void;
  stimulusEditorOpen: boolean;
  openStimulusEditorModal: () => void;
  closeStimulusEditorModal: () => void;
  editingStep: TimelineStep | null;
  setEditingStep: (step: TimelineStep | null) => void;
  mountStimulusStep: (blocks: MediaBlock[], title: string) => TimelineStep;
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

  editingStep: null,
  setEditingStep: (step) => set({ editingStep: step }),

  setConfig: (data) =>
    set((state) => ({
      config: { ...state.config, ...data },
    })),

  mountStimulusStep: (blocks, title): TimelineStep => {
    const step: TimelineStep = {
      id: crypto.randomUUID(),
      timelineId: "",
      orderIndex: get().calculateOrderIndex(),
      type: "sequential_stimuli",
      metadata: {
        title,
        positionX: 0,
        positionY: 0,
        blocks,
        triggers: [],
      },
    };

    set((state) => ({
      config: {
        ...state.config,
        steps: [...state.config.steps, step],
      },
    }));

    return step;
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

  duplicateStimulusStep: (id: string) =>
    set((state) => {
      const stepToDuplicate = state.config.steps.find((s) => s.id === id);
      if (!stepToDuplicate) return state;

      const duplicatedStep = {
        ...stepToDuplicate,
        id: crypto.randomUUID(),
        metadata: {
          ...stepToDuplicate.metadata,
        },
        orderIndex: get().calculateOrderIndex(),
      };

      return {
        config: {
          ...state.config,
          steps: [...state.config.steps, duplicatedStep],
        },
      };
    }),

  calculateOrderIndex: () => {
    const { steps } = get().config;
    if (steps.length === 0) return 1;
    return Math.max(...steps.map((s) => s.orderIndex || 0)) + 1;
  },

  clear: () =>
    set(() => ({
      open: false,
      stimulusEditorOpen: false,
      editingStep: null,
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
