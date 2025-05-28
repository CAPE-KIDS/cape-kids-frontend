import { MediaBlock } from "@/modules/media/types";
import { StimuliBlockConfig, StimuliGroup } from "@/modules/timeline/types";
import { Trigger } from "@/modules/triggers/types";
import { TimelineStep } from "@shared/timeline";
import _ from "lodash";
import { API } from "@/utils/api";

export const getRelativeSize = (px: number, total: number) => {
  return (px / total) * 100;
};

export const getAbsoluteSize = (px: number, total: number) => {
  return (px * total) / 100;
};

export const preloadImagesFromTimeline = async (
  steps: TimelineStep[]
): Promise<void> => {
  const imageUrls = new Set<string>();

  for (const step of steps) {
    const blocks = step.metadata?.blocks || [];

    for (const block of blocks) {
      if (block.type === "image" && block.data?.src) {
        imageUrls.add(block.data.src);
      }
    }
  }

  console.log("Preloading images:", Array.from(imageUrls));
  await Promise.all(
    Array.from(imageUrls).map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn("Failed to preload image:", src);
            resolve();
          };
        })
    )
  );
};

export const compileTimeline = async (
  steps: TimelineStep[],
  isSubTimeline: boolean = false
): Promise<TimelineStep[]> => {
  steps.sort((a, b) => {
    if (a.orderIndex && b.orderIndex) {
      return a.orderIndex - b.orderIndex;
    }
    return 0;
  });

  const compiled = [] as TimelineStep[];

  for (const step of steps) {
    const hasGroup =
      step.metadata?.group?.steps && step.metadata.group.steps.length > 0;

    if (step.type === "task") {
      const request = await fetch(API.GET_TASK_BY_ID(step.metadata?.taskId));
      const response = await request.json();

      if (!response || response.error) {
        console.warn(
          "Task not found or invalid response:",
          step.metadata?.taskId
        );
        continue;
      }

      const compiledSubSteps = await compileTimeline(
        response.data.timeline.steps,
        true
      );
      compiled.push(...compiledSubSteps);
      continue;
    }

    if (hasGroup) {
      const config = step.metadata?.group.config as StimuliBlockConfig;
      const isRandomized = config.randomize || false;
      const groupSteps = step.metadata.group?.steps;

      for (let i = 0; i < config.trials; i++) {
        const formattedSteps = isRandomized
          ? _.shuffle(groupSteps)
          : groupSteps;

        for (const childSteps of formattedSteps || []) {
          const newStep: TimelineStep = {
            ...step,
            id: crypto.randomUUID(),
            orderIndex: compiled.length + 1,
            metadata: {
              ...childSteps.metadata,
              blocks: childSteps.metadata.blocks,
              group: undefined,
              config: {
                ...config,
                ...childSteps.metadata.config,
              },
            },
            step_id: step?.id,
          };

          const parsedStep = handleStimuliDurationConfig(newStep);
          compiled.push(parsedStep);

          // Feedback step
          if (config.feedbackDuration) {
            const showFeedback =
              childSteps.type !== "multi_trigger_stimuli" ||
              childSteps.metadata.blocks.some(
                (block) => block.triggers && block.triggers.length > 1
              );

            if (showFeedback) {
              const feedbackStep = createFeedback(
                newStep.id,
                config.feedbackDuration
              );
              compiled.push(feedbackStep);
            }
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
        }
      }
    } else {
      const parsedStep = {
        ...handleStimuliDurationConfig(step),
        orderIndex: compiled.length + 1,
        step_id: step?.id,
      };

      compiled.push(parsedStep);
    }
  }

  if (!isSubTimeline) {
    const saveStep = createSaveStep();
    compiled.push(saveStep);
  }

  console.log("compiled timeline steps:", compiled);
  await preloadImagesFromTimeline(compiled);
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
