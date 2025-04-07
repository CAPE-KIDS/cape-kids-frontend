export type TriggerContext = {
  goToNextStep: () => void;
};

export type TriggerActionPayloadMap = {
  goToNextStep: {
    description: string;
  };
  goToPreviousStep: undefined;
};

export type TriggerActionType = keyof TriggerActionPayloadMap;

export interface TriggerAction<
  T extends TriggerActionType = TriggerActionType
> {
  type: T;
  payload: TriggerActionPayloadMap[T];
}

export interface Trigger {
  id: string;
  timeline_step_id: string;
  stimullus_id: string | null;
  metadata: TriggerAction<TriggerActionType>;
}
