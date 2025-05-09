import React, { useEffect, useState } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { StepResult, useResultsStore } from "@/stores/results/useResultsStore";

const SaveScreen = () => {
  const { steps, activeStepId } = useCanvasStore();
  const { results } = useResultsStore();

  const [status, setStatus] = useState<"saving" | "done">("saving");

  const consoleResults = (results: StepResult[]) => {
    console.group("🧪 Análise Interativa dos Steps");

    results.forEach((step, i) => {
      console.groupCollapsed(`📍 Step ${i + 1} – ${step.stepId}`);

      const interactions = step.interactions || [];
      const last = interactions.at(-1);
      const endedByTimeout = last?.type === "timer";
      const duration = step.completedAt - step.startedAt;

      console.log(`⏱️ Duração: ${duration}ms`);
      if (interactions.length === 0) {
        console.log("⚠️ Nenhuma interação foi registrada.");
      } else {
        interactions.forEach((ia, idx) => {
          let desc = `#${idx + 1} → `;
          if (ia.type === "click") {
            desc += `🖱️ Clique em "${ia.target}" (${ia.x?.toFixed(
              1
            )}%, ${ia.y?.toFixed(1)}%)`;
          } else if (ia.type === "keydown") {
            desc += `⌨️ Tecla "${ia.key}" pressionada`;
          } else if (ia.type === "timer") {
            desc += `⏰ Tempo expirado`;
          } else if (ia.type === "trigger") {
            desc += `🔁 Trigger executado`;
          } else {
            desc += `📍 Interação do tipo "${ia.type}"`;
          }
          desc += ` – ${new Date(ia.timestamp).toLocaleTimeString()}`;
          console.log(desc);
        });
      }

      if (endedByTimeout) {
        console.log("⛔ Step encerrado automaticamente por timeout.");
      } else {
        console.log("✅ Step encerrado por ação do participante.");
      }

      console.groupEnd();
    });

    console.groupEnd();
  };

  useEffect(() => {
    if (results.length !== steps.length - 1) return;

    const currentIndex = steps.findIndex((s) => s.id === activeStepId);
    if (currentIndex === steps.length - 1) {
      console.log("✅ Resultados salvos:", results);
      // consoleResults(results);
      const timeout = setTimeout(() => {
        setStatus("done");
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {
            console.warn("Falha ao sair do modo fullscreen:", err);
          });
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [results]);

  return (
    <div
      tabIndex={0}
      className="absolute inset-0 z-50 flex items-center justify-center text-center bg-white text-black text-lg"
      style={{ width: "100%", height: "100%" }}
      data-block-id="SaveScreen"
    >
      {status === "saving" ? (
        <div>
          <p className="text-xl font-medium">Salvando resultados...</p>
        </div>
      ) : (
        <div>
          <p className="text-xl font-medium">
            ✅ Resultados salvos com sucesso!
          </p>
          <p className="mt-2 text-gray-600">Você já pode fechar esta janela.</p>
        </div>
      )}
    </div>
  );
};

export default SaveScreen;
