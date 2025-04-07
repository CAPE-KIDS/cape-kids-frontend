export type TriggerActionType = "goToNextStep" | "goToPreviousStep";

export type TriggerContext = {
  activeStepId: string;
  steps: { id: string }[];
  setActiveStepId: (id: string) => void;
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

export interface GoToPreviousStepMetadata extends BaseTriggerMetadata {
  action: "goToPreviousStep";
}

export type TriggerActionPayloadMap = {
  goToNextStep: GoToNextStepMetadata;
  goToPreviousStep: GoToPreviousStepMetadata;
};
