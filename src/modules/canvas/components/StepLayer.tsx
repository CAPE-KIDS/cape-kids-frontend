// modules/canvas/components/StepLayer.tsx
import { TimelineStep } from "@/modules/timeline/types";
import { CanvasMediaRenderer } from "./CanvasMediaRenderer";
import { useEffect, useState } from "react";
import { useTriggerHandler } from "@/modules/triggers/useTriggerHandler";
import { useCanvasStore } from "../store/useCanvasStore";
import { useKeyboardTriggers } from "@/modules/triggers/useKeyboardTriggers";
import { useTimerTriggers } from "@/modules/triggers/useTimerTrigger";

interface StepLayerProps {
  step: TimelineStep;
  visible: boolean;
  started: boolean;
}

const StepLayer = ({ step, visible, started }: StepLayerProps) => {
  const { activeStepId, steps, setActiveStepId } = useCanvasStore();

  const allTriggers =
    step.metadata.blocks?.flatMap((block) => block.triggers || []) || [];

  useKeyboardTriggers(allTriggers, {
    activeStepId,
    steps,
    setActiveStepId,
    started,
  });

  useTimerTriggers(allTriggers, {
    activeStepId,
    steps,
    setActiveStepId,
    started,
  });

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full h-full flex items-center justify-center">
        {step.metadata.blocks?.map((block) => (
          <CanvasMediaRenderer block={block} key={block.id} />
        ))}
      </div>
    </div>
  );
};

export default StepLayer;
