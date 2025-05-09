"use client";

import { useEffect, useRef } from "react";
import StepLayer from "./StepLayer";
import { useCanvasStore } from "../store/useCanvasStore";
import { TimelineStep } from "@/modules/timeline/types";
import { useSizeObserver } from "@/hooks/useSizeObserver";
import { Toaster } from "sonner";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { useInteractionCapture } from "@/stores/results/useInteractionCapture";
import { useAnswerInterceptor } from "@/stores/results/useAnswerInterceptor";

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

  useInteractionCapture();
  useAnswerInterceptor();

  const { startStepResult, completeStepResult } = useResultsStore();

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

  useEffect(() => {
    const isSaveBlock = steps?.find(
      (step) =>
        step.id === activeStepId && step.metadata?.blocks?.[0]?.type === "save"
    );

    const isFeedbackBlock = steps?.find(
      (step) =>
        step.id === activeStepId &&
        step.metadata?.blocks?.[0]?.type === "feedback"
    );

    // const isInterStimulusBlock = steps?.find(
    //   (step) =>
    //     step.id === activeStepId &&
    //     step.metadata?.blocks?.[0]?.type === "inter_stimulus"
    // );

    if (!started || !activeStepId || isSaveBlock || isFeedbackBlock) return;

    startStepResult(activeStepId);

    return () => {
      completeStepResult();
    };
  }, [activeStepId, started]);

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
