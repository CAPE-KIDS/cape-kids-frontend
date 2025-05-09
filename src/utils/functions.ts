import { MediaBlock } from "@/modules/media/types";
import {
  StimuliBlockConfig,
  StimuliGroup,
  TimelineStep,
} from "@/modules/timeline/types";
import { Trigger } from "@/modules/triggers/types";
import _, { has } from "lodash";

export const getRelativeSize = (px: number, total: number) => {
  return (px / total) * 100;
};

export const getAbsoluteSize = (px: number, total: number) => {
  return (px * total) / 100;
};

export const compileTimeline = (steps: TimelineStep[]): TimelineStep[] => {
  steps.sort((a, b) => a.orderIndex - b.orderIndex);

  const compiled = [] as TimelineStep[];

  steps.forEach((step) => {
    const hasGroup =
      (step.metadata?.group?.steps && step.metadata.group.steps.length > 0) ||
      false;

    if (hasGroup) {
      const config = step.metadata?.group.config as StimuliBlockConfig;
      const isRandomized = config.randomize || false;
      const groupSteps = step.metadata.group?.steps;
      const formattedSteps = isRandomized ? _.shuffle(groupSteps) : groupSteps;

      formattedSteps?.forEach((childSteps, index) => {
        const newStep = {
          ...step,
          id: crypto.randomUUID(),
          orderIndex: compiled.length + 1,
          metadata: {
            ...childSteps.metadata,
            blocks: childSteps.metadata.blocks,
            group: undefined,
          },
        } as TimelineStep;

        const parsedStep = handleStimuliDurationConfig(newStep);
        compiled.push(parsedStep);

        // Feedback step
        if (config.feedbackDuration) {
          const feedbackStep = createFeedback(
            newStep.id,
            config.feedbackDuration
          );
          compiled.push(feedbackStep);
        }

        // Inter Stimulus Interval step
        const hasInterStimulusInterval =
          childSteps.metadata.config?.interStimulusInterval > 0;

        if (hasInterStimulusInterval) {
          const interStimulusStep = createInterStimulusStep(
            childSteps.metadata.config?.interStimulusInterval,
            compiled.length + 1
          );
          compiled.push(interStimulusStep);
        }
      });
    } else {
      const parsedStep = {
        ...handleStimuliDurationConfig(step),
        orderIndex: compiled.length + 1,
      };

      compiled.push(parsedStep);
    }
  });

  const saveStep = createSaveStep();
  compiled.push(saveStep);

  return compiled;
};

const createInterStimulusStep = (
  delay: number,
  orderIndex: number
): TimelineStep => {
  const fakeStep = {
    id: crypto.randomUUID(),
    type: "sequential_stimuli",
    metadata: {
      positionX: 0,
      positionY: 0,
      width: 0,
      height: 0,
      title: "",
      blocks: [
        {
          type: "inter_stimulus",
          id: crypto.randomUUID(),
          data: null,
          triggers: [
            {
              id: crypto.randomUUID(),
              timeline_step_id: "1234-5678-9101",
              stimulus_id: crypto.randomUUID(),
              metadata: {
                type: "timer",
                delay,
                description: "",
                action: "goToNextStep",
              },
            },
          ],
        },
      ],
    },
    orderIndex,
    timelineId: "",
  } as TimelineStep;

  return fakeStep;
};

const createSaveStep = (): TimelineStep => {
  const saveStep = {
    id: crypto.randomUUID(),
    type: "custom_block",
    metadata: {
      positionX: 0,
      positionY: 0,
      width: 0,
      height: 0,
      title: "",
      blocks: [
        {
          type: "save",
          id: crypto.randomUUID(),
          data: null,
        },
      ],
    },
    orderIndex: 9999,
    timelineId: "",
  } as TimelineStep;

  return saveStep;
};

const createFeedback = (parentId: string, delay: number): TimelineStep => {
  const feedbackStep = {
    id: crypto.randomUUID(),
    type: "custom_block",
    metadata: {
      positionX: 0,
      positionY: 0,
      width: 0,
      height: 0,
      title: "",
      blocks: [
        {
          type: "feedback",
          id: crypto.randomUUID(),
          data: null,
          triggers: [
            {
              id: crypto.randomUUID(),
              timeline_step_id: parentId,
              stimulus_id: crypto.randomUUID(),
              metadata: {
                type: "timer",
                delay,
                description: "",
                action: "goToNextStep",
              },
            },
          ],
        },
      ],
    },
    orderIndex: 9999,
    timelineId: "",
  } as TimelineStep;

  return feedbackStep;
};

const handleStimuliDurationConfig = (step: TimelineStep): TimelineStep => {
  const stimuliDuration = step.metadata?.config?.stimulusDuration;

  if (!stimuliDuration) return step;

  const stepClone = _.cloneDeep(step);
  if (!stepClone.metadata?.blocks) return step;

  const timerTrigger = {
    id: crypto.randomUUID(),
    timeline_step_id: stepClone.id,
    stimulus_id: crypto.randomUUID(),
    metadata: {
      type: "timer",
      delay: stimuliDuration,
      description: "",
      action: "goToNextStep",
    },
  } as Trigger;

  if (stepClone.metadata.blocks[0]?.triggers) {
    const hasTimerTrigger = stepClone.metadata.blocks[0].triggers.find(
      (trigger) => trigger.metadata.type === "timer"
    );
    if (hasTimerTrigger) return step;

    stepClone.metadata.blocks[0]?.triggers.push(timerTrigger);
    return stepClone;
  }

  stepClone.metadata.blocks[0].triggers = [timerTrigger];
  return stepClone;
};

export function normalizeKeyCombo(e: KeyboardEvent): string | null {
  const modifiers = [];
  const key = e.key.toLowerCase();

  if (e.ctrlKey) modifiers.push("ctrl");
  if (e.altKey) modifiers.push("alt");
  if (e.shiftKey) modifiers.push("shift");

  let mainKey = key;

  if (key === "control") mainKey = "ctrl";
  if (key === " ") mainKey = "space";
  if (key === "escape") mainKey = "esc";

  const isOnlyModifier = ["ctrl", "alt", "shift", "meta"].includes(mainKey);
  const combo =
    isOnlyModifier && modifiers.includes(mainKey)
      ? null
      : [...modifiers, mainKey].join("+");

  return combo;
}
