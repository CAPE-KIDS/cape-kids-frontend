// modules/canvas/components/StepLayer.tsx

import { TimelineStep } from "@/modules/timeline/types";
import { CanvasMediaRenderer } from "./CanvasMediaRenderer";
import { useSizeObserver } from "@/hooks/useSizeObserver";
import { useRef } from "react";

interface StepLayerProps {
  step: TimelineStep;
  visible: boolean;
}

const StepLayer = ({ step, visible }: StepLayerProps) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const screen = useSizeObserver(screenRef);
  return (
    <div
      ref={screenRef}
      className={`absolute inset-0 transition-opacity duration-300 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full h-full flex items-center justify-center">
        {step.metadata.blocks?.map((block) => {
          return <CanvasMediaRenderer block={block} key={block.id} />;
        })}
      </div>
    </div>
  );
};

export default StepLayer;
