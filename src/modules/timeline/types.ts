import { MediaBlock } from "../media/types";
import { Trigger, TriggerActionType } from "../triggers/types";
import { TimelineStep, StepType } from "@shared/timeline";

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
  sequential_stimuli: {
    background: "#8F1D99",
    color: "#FFFFFF",
  },
  multi_trigger_stimuli: {
    background: "#FF8C00",
    color: "#FFFFFF",
  },
  custom_block: {
    background: "#333",
    color: "#FFFFFF",
  },
} as const;

export type StepConfig = StimulusStepConfig | StimuliBlockConfig | null;

export interface StepConnection {
  id: string;
  fromStepId: string;
  toStepId: string;
  condition: string | null;
}

interface LevelConfig {
  level: string;
  repeatOnWrong?: boolean;
  repeatAmount?: number;
  onWrongAnswer?: TriggerActionType;
  goToStepId?: string;
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
  isPractice: boolean;
  isLevel?: boolean;
  level?: LevelConfig;
  optional_step?: boolean;
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
