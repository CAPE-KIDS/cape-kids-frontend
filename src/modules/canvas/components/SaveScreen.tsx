"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { StepResult, useResultsStore } from "@/stores/results/useResultsStore";
import { Tooltip } from "@/components/Tooltip";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useParams, usePathname } from "next/navigation";
import { API } from "@/utils/api";
import { toast } from "sonner";

const SaveScreen = () => {
  const params = useParams<{ id: string }>();
  const sourceId = params.id;
  const { authState } = useAuthStore();
  const path = usePathname();
  const { steps } = useCanvasStore();
  const { results } = useResultsStore();

  const [status, setStatus] = useState<"saving" | "done" | null>(null);
  const hasSavedRef = useRef(false);

  const filteredSteps = useMemo(() => {
    return steps.filter(
      (s) =>
        !s.metadata?.blocks?.some(
          (b) => b.type === "feedback" || b.type === "save"
        )
    );
  }, [steps]);

  const processedResults = useMemo(() => {
    const allResults = results.filter((result) => {
      const step = filteredSteps.find((s) => s.id === result.stepId);
      if (!step) return false;

      if (step.type === "multi_trigger_stimuli") {
        const hasMultipleTriggers = step.metadata?.blocks?.some(
          (block) => block.triggers && block.triggers.length > 1
        );
        if (!hasMultipleTriggers) return false;
      }

      return step.metadata?.blocks?.[0]?.type !== "inter_stimulus";
    });

    const formatedResults = allResults.map((result) => ({
      sourceId,
      timelineStepId: result.timelineStepId,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      metadata: {
        stepType: result.stepType,
        isCorrect: result.isCorrect,
        interactions: result.interactions,
      },
    }));

    return { raw: allResults, formated: formatedResults };
  }, [results, filteredSteps, sourceId]);

  const saveResults = async () => {
    if (hasSavedRef.current || status || processedResults.formated.length === 0)
      return;

    hasSavedRef.current = true;
    setStatus("saving");

    if (!path.includes("preview")) {
      try {
        const request = await fetch(API.SAVE_RESULTS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(processedResults.formated),
        });

        const response = await request.json();

        if (response.error) {
          toast("Erro ao salvar resultados:", {
            description: response.message,
          });
        } else if (response.data) {
          toast("Resultados salvos com sucesso!");
        } else {
          toast("Nenhum resultado para salvar.");
        }
      } catch (err) {
        console.error(err);
        toast("Erro ao salvar resultados.");
      }
    }

    setStatus("done");

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.warn("Falha ao sair do modo fullscreen:", err);
      });
    }
  };

  useEffect(() => {
    if (processedResults.raw.length === 0 || hasSavedRef.current) return;

    const timer = setTimeout(() => {
      saveResults();
    }, 1000);

    return () => clearTimeout(timer);
  }, [processedResults]);

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
          {processedResults.raw.map((step, i) => {
            const last = step.interactions.at(-1);
            const endedByTimeout = last?.type === "timer";
            const duration = Math.round(
              (step.completedAt ?? 0) - step.startedAt
            );
            const deltaTime =
              last?.expectedTime && duration - last.expectedTime;
            return (
              <tr key={`${step.stepId}-${i}`} className="text-sm">
                <td className="border p-2">#{i + 1}</td>
                <td className="border p-2">
                  {duration}ms
                  {deltaTime && deltaTime !== duration && (
                    <Tooltip>
                      <div className="text-xs text-gray-500">
                        Diferença entre tempo esperado e real.
                        <br />
                        Variações pequenas são normais no navegador. Delta:{" "}
                        {deltaTime}ms
                      </div>
                    </Tooltip>
                  )}
                </td>
                <td className="border p-2">
                  {step.interactions.length === 0
                    ? "Nenhuma"
                    : step.interactions
                        .map((ia) => {
                          if (ia.type === "click")
                            return `Click - Target: ${ia.target}`;
                          if (ia.type === "keydown")
                            return `(Keypress) ${ia.key}`;
                          if (ia.type === "timer") return `(timer)`;
                          if (ia.type === "trigger") return `Trigger`;
                          return ia.type;
                        })
                        .join(", ")}
                </td>
                <td className="border p-2">
                  {endedByTimeout ? "Timeout" : "Participant"}
                </td>
                <td className="border p-2">
                  {step.stepType === "custom_block" ? (
                    <div>
                      Not evaluated{" "}
                      <Tooltip>
                        Results are evaluated only for stimulus and tasks.
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
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-6 w-6 border-4 border-gray-300 border-t-black rounded-full" />
          <p className="text-xl font-medium">Salvando resultados...</p>
        </div>
      ) : status === "done" ? (
        <>
          <p className="mt-2 text-gray-600">Você já pode fechar essa janela.</p>
          {renderTable()}
        </>
      ) : null}
    </div>
  );
};

export default React.memo(SaveScreen);
