export interface TriggerAction {
  label: string;
  type: TriggerActionType;
  execute: (context: TriggerContext) => void;
}

export type TriggerActionType = "goToNextStep" | "goToPrevStep";

export type TriggerContext = {
  activeStepId: string;
  steps: { id: string }[];
  setActiveStepId: (id: string) => void;
  started?: boolean;
};

export interface Trigger<T extends TriggerActionType = TriggerActionType> {
  id: string;
  timeline_step_id: string;
  stimullus_id: string | null;
  metadata: TriggerActionPayloadMap[T];
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
};
