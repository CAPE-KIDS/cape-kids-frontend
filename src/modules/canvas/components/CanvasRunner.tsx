// modules/canvas/components/CanvasRunner.tsx
"use client";

import { useEffect, useRef } from "react";
import StepLayer from "./StepLayer";
import { useCanvasStore } from "../store/useCanvasStore";
import { TimelineStep } from "@/modules/timeline/types";
import { useSizeObserver } from "@/hooks/useSizeObserver";
import { Toaster } from "sonner";

interface CanvasRunnerProps {
  steps?: TimelineStep[];
  started: boolean;
}

const CanvasRunner = ({ steps, started }: CanvasRunnerProps) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const screen = useSizeObserver(screenRef);

  const {
    setScreen,
    setSteps,
    steps: stateSteps,
    activeStepId,
  } = useCanvasStore();

  useEffect(() => {
    if (steps) {
      setSteps(steps);
    }
  }, [steps, setSteps]);

  useEffect(() => {
    if (screenRef.current) {
      setScreen({
        element: screenRef.current,
        height: screen.height,
        width: screen.width,
      });
    }
  }, [screenRef.current, screen.width, screen.height]);

  return (
    <div className="relative w-full h-full z-40" ref={screenRef}>
      <Toaster position="top-right" richColors closeButton />
      {stateSteps
        .filter((step) => step.id === activeStepId)
        .map((step) => (
          <StepLayer
            key={step.id}
            step={step}
            visible={true}
            started={started}
          />
        ))}
    </div>
  );
};

export default CanvasRunner;
