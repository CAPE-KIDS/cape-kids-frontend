export type StepType =
  | "start"
  | "task"
  | "conditional"
  | "sequential_stimuli"
  | "simultaneos_stimuli"
  | "block"
  | "end";

export const StepColors: Record<
  StepType,
  {
    background: string;
    color: string;
  }
> = {
  start: {
    background: "#1E1E1E",
    color: "#FFFFFF",
  },
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
  simultaneos_stimuli: {
    background: "#1D8499",
    color: "#FFFFFF",
  },
  block: {
    background: "#FF6200",
    color: "#FFFFFF",
  },
  end: {
    background: "#FF3B30",
    color: "#FFFFFF",
  },
} as const;

export interface TimelineStepMetadata {
  name: string;
  positionX: number;
  positionY: number;
}

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
