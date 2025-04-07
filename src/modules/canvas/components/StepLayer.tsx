// modules/canvas/components/StepLayer.tsx

import { TimelineStep } from "@/modules/timeline/types";
import { CanvasMediaRenderer } from "./CanvasMediaRenderer";
import { useSizeObserver } from "@/hooks/useSizeObserver";
import { useRef } from "react";
import { useCanvasStore } from "../store/useCanvasStore";

interface StepLayerProps {
  step: TimelineStep;
  visible: boolean;
}

const StepLayer = ({ step, visible }: StepLayerProps) => {
  return (
    <div
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
