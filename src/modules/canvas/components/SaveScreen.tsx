import React, { useEffect, useState } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { StepResult, useResultsStore } from "@/stores/results/useResultsStore";
import { Tooltip } from "@/components/Tooltip";

const SaveScreen = () => {
  const { steps, activeStepId } = useCanvasStore();
  const { results } = useResultsStore();
  const [status, setStatus] = useState<"saving" | "done">("saving");
  const [filteredResults, setFilteredResults] = useState<StepResult[]>([]);

  const filteredSteps = steps.filter(
    (s) =>
      s.metadata?.blocks?.[0]?.type !== "feedback" &&
      s.metadata?.blocks?.[0]?.type !== "save"
  );

  useEffect(() => {
    if (results.length !== filteredSteps.length) return;

    const timeout = setTimeout(() => {
      setStatus("done");

      const filteredResults = results.filter((result) => {
        const step = filteredSteps.find((s) => s.id === result.stepId);
        return step && step.metadata?.blocks?.[0]?.type !== "inter_stimulus";
      });
      setFilteredResults(filteredResults);

      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.warn("Falha ao sair do modo fullscreen:", err);
        });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [results]);

  const renderTable = () => (
    <div className="mt-6 max-h-[60vh] overflow-auto border rounded">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-100 text-sm font-semibold">
          <tr>
            <th className="border p-2">Step</th>
            <th className="border p-2">Duration</th>
            <th className="border p-2">Interactions</th>
            <th className="border p-2">Action by</th>
            <th className="border p-2">Answer</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((step, i) => {
            const last = step.interactions.at(-1);
            const endedByTimeout = last?.type === "timer";
            const duration = step.completedAt - step.startedAt;
            return (
              <tr key={step.stepId} className="text-sm">
                <td className="border p-2">#{i + 1}</td>
                <td className="border p-2">{duration}ms</td>
                <td className="border p-2">
                  {step.interactions.length === 0
                    ? "Nenhuma"
                    : step.interactions
                        .map((ia, idx) => {
                          if (ia.type === "click") {
                            return `Click - Target: ${ia.target}`;
                          } else if (ia.type === "keydown") {
                            return `(Keypress) ${ia.key}`;
                          } else if (ia.type === "timer") {
                            return `(timer)`;
                          } else if (ia.type === "trigger") {
                            return `Trigger`;
                          } else {
                            return ia.type;
                          }
                        })
                        .join(", ")}
                </td>
                <td className="border p-2">
                  {endedByTimeout ? "Timeout" : `Participant`}
                </td>
                <td className="border p-2">
                  {step.stepType === "custom_block" ? (
                    <div>
                      Not evaluated{" "}
                      <Tooltip>
                        Results area evaluated only for stimulus and tasks.
                      </Tooltip>
                    </div>
                  ) : step.isCorrect ? (
                    <span className="text-green-500">Correct ✅</span>
                  ) : (
                    <span className="text-red-500">Incorrect ❌</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      tabIndex={0}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center bg-white text-black text-lg px-6 py-4 overflow-auto"
      data-block-id="SaveScreen"
    >
      {status === "saving" ? (
        <p className="text-xl font-medium">Saving results...</p>
      ) : (
        <>
          <p className="text-xl font-medium">✅ Results saved successfully!</p>
          <p className="mt-2 text-gray-600">You can close this window.</p>
          {renderTable()}
        </>
      )}
    </div>
  );
};

export default SaveScreen;
