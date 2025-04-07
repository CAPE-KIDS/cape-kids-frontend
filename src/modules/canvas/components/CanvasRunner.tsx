// modules/canvas/components/CanvasRunner.tsx
"use client";

import { useEffect } from "react";
import StepLayer from "./StepLayer";
import { useCanvasStore } from "../store/useCanvasStore";
import { TimelineStep } from "@/modules/timeline/types";

interface CanvasRunnerProps {
  steps?: TimelineStep[];
}

const CanvasRunner = ({ steps }: CanvasRunnerProps) => {
  const { setSteps, steps: stateSteps, activeStepId } = useCanvasStore();

  useEffect(() => {
    if (steps) {
      setSteps(steps);
    }
  }, [steps, setSteps]);

  return (
    <div className="relative w-full h-full">
      {stateSteps.map((step) => (
        <StepLayer
          key={step.id}
          step={step}
          visible={step.id === activeStepId}
        />
      ))}
    </div>
  );
};

export default CanvasRunner;
