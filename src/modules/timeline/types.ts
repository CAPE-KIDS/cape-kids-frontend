import { MediaBlock } from "../media/types";
import { Trigger } from "../triggers/types";

export type StepType =
  | "custom_block"
  | "task"
  | "conditional"
  | "sequential_stimuli"
  | "simultaneous_stimuli";

export const StepColors: Record<
  StepType,
  {
    background: string;
    color: string;
  }
> = {
  task: {
    background: "#5388D8",
    color: "#FFFFFF",
  },
  conditional: {
    background: "#34C759",
    color: "#FFFFFF",
  },
  sequential_stimuli: {
    background: "#8F1D99",
    color: "#FFFFFF",
  },
  simultaneous_stimuli: {
    background: "#1D8499",
    color: "#FFFFFF",
  },
  custom_block: {
    background: "#333",
    color: "#FFFFFF",
  },
} as const;

export interface TimelineStepMetadata {
  title: string;
  positionX: number | null;
  positionY: number | null;
  blocks?: MediaBlock[] | null;
  triggers?: Trigger[] | null;
  config?: StepConfig;
  group?: StimuliGroup;
}

export type StepConfig = StimulusStepConfig | StimuliBlockConfig | null;

export interface TimelineStep {
  id: string;
  timelineId: string;
  orderIndex: number | null;
  type: StepType;
  metadata: TimelineStepMetadata;
}

export interface StepConnection {
  id: string;
  fromStepId: string;
  toStepId: string;
  condition: string | null;
}

// Step types specific
export interface StimuliBlockConfig {
  trials: number;
  stimulusDuration: number | null;
  interStimulusInterval: number | null;
  feedbackDuration?: number | null;
  randomize: boolean;
  displayRate?: number;
  overrideStimulus?: boolean;
  advanceOnWrong: boolean;
}

export interface StimulusStepConfig {
  stimulusId: string;
  duration: number;
  feedback?: boolean;
  feedbackDuration?: number;
  advanceOnWrong: boolean;
}

export interface StimuliGroup {
  config: StimuliBlockConfig;
  steps: TimelineStep[];
}
