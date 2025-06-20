// stores/timeline/blockTypes/useStimuliModal.ts
import { MediaBlock } from "@/modules/media/types";
import { StimuliBlockConfig } from "@/modules/timeline/types";
import { TimelineStep } from "@shared/timeline";
import { create } from "zustand";

interface OverrideConfig {
  displayRate: number;
  overrideStimulus: boolean;
  stimulusDuration: number;
  overrideInterStimulusTime: boolean;
  interStimulusTime: number;
}

interface MultiTriggerStimuliModalState {
  open: boolean;
  config: StimuliBlockConfig;
  steps: TimelineStep[];
  openModal: () => void;
  closeModal: () => void;
  setConfig: (data: Partial<StimuliBlockConfig>) => void;
  addStimulusStep: (step: TimelineStep) => void;
  updateStimulusStep: (step: TimelineStep) => void;
  updateStimulusStepsConfigField: <K extends keyof StimuliBlockConfig>(
    key: K,
    value: StimuliBlockConfig[K]
  ) => void;
  removeStimulusStep: (id: string) => void;
  duplicateStimulusStep: (id: string) => void;
  multiTriggerStimulusEditorOpen: boolean;
  openMultiTriggerStimulusEditorModal: () => void;
  closeMultiTriggerStimulusEditorModal: () => void;
  editingStep: TimelineStep | null;
  setEditingStep: (step: TimelineStep | null) => void;
  mountStimulusStep: (
    blocks: MediaBlock[],
    title: string,
    overrideConfig?: OverrideConfig
  ) => TimelineStep;
  calculateOrderIndex: () => number;
  updateStimulusOrder: (newOrder: string[]) => void;
  clear: () => void;
}

export const useMultiTriggerStimuliModal =
  create<MultiTriggerStimuliModalState>((set, get) => ({
    open: false,
    config: {
      trials: 1,
      stimulusDuration: null,
      interStimulusInterval: null,
      feedbackDuration: null,
      randomize: false,
      advanceOnWrong: true,
      isPractice: false,
      isLevel: false,
      level: {
        level: "1",
        repeatOnWrong: false,
        repeatAmount: 1,
        onWrongAnswer: "goToNextStep",
      },
      optional_step: false,
    },
    steps: [],
    openModal: () => set({ open: true }),
    closeModal: () => set({ open: false }),

    multiTriggerStimulusEditorOpen: false,
    openMultiTriggerStimulusEditorModal: () =>
      set({ multiTriggerStimulusEditorOpen: true }),
    closeMultiTriggerStimulusEditorModal: () =>
      set({ multiTriggerStimulusEditorOpen: false }),

    editingStep: null,
    setEditingStep: (step) => set({ editingStep: step }),

    setConfig: (data) =>
      set((state) => ({
        config: { ...state.config, ...data },
      })),

    mountStimulusStep: (blocks, title, overrideConfig?): TimelineStep => {
      const { trials, isPractice, stimulusDuration, interStimulusInterval } =
        get().config;

      const step: TimelineStep = {
        id: crypto.randomUUID(),
        timelineId: "",
        orderIndex: get().calculateOrderIndex(),
        type: "multi_trigger_stimuli",
        metadata: {
          title,
          positionX: 0,
          positionY: 0,
          blocks,
          triggers: [],
          config: {
            ...get().config,
            trials,
            stimulusDuration: overrideConfig?.overrideStimulus
              ? overrideConfig.stimulusDuration
              : stimulusDuration,

            displayRate: overrideConfig?.displayRate || 1,
            interStimulusInterval: overrideConfig?.overrideInterStimulusTime
              ? overrideConfig.interStimulusTime
              : interStimulusInterval,
          },
        },
      };

      set((state) => ({
        steps: [...state.steps, step],
      }));

      return step;
    },

    addStimulusStep: (step) =>
      set((state) => ({
        steps: [...state.steps, step],
      })),

    updateStimulusStep: (step) =>
      set((state) => ({
        steps: state.steps.map((s) => (s.id === step.id ? step : s)),
      })),

    removeStimulusStep: (id) =>
      set((state) => ({
        steps: state.steps.filter((s) => s.id !== id),
      })),

    duplicateStimulusStep: (id: string) =>
      set((state) => {
        const stepToDuplicate = state.steps.find((s) => s.id === id);
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
          steps: [...state.steps, duplicatedStep],
        };
      }),

    updateStimulusStepsConfigField<K extends keyof StimuliBlockConfig>(
      key: K,
      value: StimuliBlockConfig[K]
    ) {
      const { steps } = get();

      if (!steps || steps.length === 0) return;

      const updatedSteps = steps.map((step) => {
        if (step?.type === "multi_trigger_stimuli" && step?.metadata?.config) {
          return {
            ...step,
            metadata: {
              ...step.metadata,
              config: {
                ...step.metadata.config,
                [key]: value,
              },
            },
          };
        }
        return step;
      }) as TimelineStep[];

      set({ steps: updatedSteps });
    },
    calculateOrderIndex: () => {
      const { steps } = get();
      if (steps.length === 0) return 1;
      return Math.max(...steps.map((s) => s.orderIndex || 0)) + 1;
    },

    updateStimulusOrder: (newOrder) =>
      set((state) => ({
        steps: newOrder.map((id, index) => {
          const step = state.steps.find((s) => s.id === id);
          if (!step) throw new Error("Step not found!");
          return {
            ...step,
            orderIndex: index + 1,
          };
        }),
      })),

    clear: () =>
      set(() => ({
        open: false,
        stimulusEditorOpen: false,
        editingStep: null,
        config: {
          trials: 1,
          isPractice: false,
          stimulusDuration: null,
          interStimulusInterval: null,
          feedbackDuration: null,
          randomize: false,
          advanceOnWrong: true,
          optional_step: false,
        },
        steps: [],
      })),
  }));
