import React, { useEffect, useState } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { MediaBlock } from "@/modules/media/types";
import { result } from "lodash";
import { Check, X } from "lucide-react";

const FeedbackScreen = ({ block }: { block: MediaBlock }) => {
  const { screen } = useCanvasStore();
  const { results } = useResultsStore();
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!block || !block.triggers) return;

    const blockResult = results.find(
      (result) =>
        result.stepId ===
        (block.triggers && block.triggers[0]?.timeline_step_id)
    );

    setIsCorrect(blockResult?.isCorrect);

    return () => {
      setIsCorrect(undefined);
    };
  }, [block, results]);

  if (isCorrect === undefined) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center text-center bg-black text-lg">
      {isCorrect ? (
        <div className="flex items-center gap-2">
          <p className="text-2xl font-medium text-green-500">Correct</p>
          <Check size={20} className="text-green-500" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-2xl font-medium text-red-500 ">Incorrect</p>
          <X size={20} className="text-red-500 mt-0.5" />
        </div>
      )}
    </div>
  );
};

export default FeedbackScreen;
