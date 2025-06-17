"use client";

import { useEffect, useRef } from "react";
import StepLayer from "./StepLayer";
import { useCanvasStore } from "../store/useCanvasStore";
import { TimelineStep } from "@shared/timeline";
import { useSizeObserver } from "@/hooks/useSizeObserver";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { useInteractionCapture } from "@/stores/results/useInteractionCapture";
import { useAnswerInterceptor } from "@/stores/results/useAnswerInterceptor";
import CanvasDebugger from "./CanvasDebugger";

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
    setActiveStep,
    activeStep,
  } = useCanvasStore();

  useInteractionCapture();
  useAnswerInterceptor();

  const { startStepResult, completeStepResult, showTryAgain } =
    useResultsStore();

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
    const startedAt = performance.now();
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

    const activeStep = steps?.find((step) => step.id === activeStepId);
    if (activeStep) {
      setActiveStep(activeStep);
    }

    if (!started || !activeStepId || isSaveBlock || isFeedbackBlock) return;

    startStepResult(
      startedAt,
      activeStepId,
      activeStep?.step_id,
      activeStep?.type || ""
    );

    return () => {
      const completedAt = performance.now();
      completeStepResult(completedAt);
    };
  }, [activeStepId, started]);

  return (
    <div className="relative w-full h-full z-40" ref={screenRef}>
      {showTryAgain && (
        <div className="absolute top-0 left-0 w-full h-full bg-red-500 z-[400]">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
            Tente novamente
          </div>
        </div>
      )}

      {/* Render the active step layer */}

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
