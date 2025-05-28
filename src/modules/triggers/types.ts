export interface TriggerAction {
  label: string;
  type: TriggerActionType;
  execute: (context: TriggerContext) => void;
}

export type TriggerActionType =
  | "goToNextStep"
  | "goToPrevStep"
  | "goToStep"
  | "repeat"
  | "stop";

export type TriggerContext = {
  activeStepId: string;
  steps: { id: string }[];
  setActiveStepId: (id: string) => void;
  started?: boolean;
  targetStepId?: string;
};

export interface Trigger<T extends TriggerActionType = TriggerActionType> {
  id: string;
  timeline_step_id: string;
  stimulus_id: string | null;
  metadata: TriggerMetadata;
}

export interface TriggerMetadata {
  type: "click" | "keydown" | "timer";
  description: string;
  action: keyof TriggerActionPayloadMap;
  key?: string;
}
// Metadatas

export interface BaseTriggerMetadata {
  type: string;
  action: TriggerActionType;
}

export interface GoToNextStepMetadata extends BaseTriggerMetadata {
  action: "goToNextStep";
  description?: string;
}

export interface GoToPrevStepMetadata extends BaseTriggerMetadata {
  action: "goToPrevStep";
}

export type TriggerActionPayloadMap = {
  goToNextStep: GoToNextStepMetadata;
  goToPrevStep: GoToPrevStepMetadata;
  goToStep: BaseTriggerMetadata;
  reset: BaseTriggerMetadata;
  stop: BaseTriggerMetadata;
};
