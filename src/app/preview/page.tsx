// app/preview/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TimelineStep } from "@/modules/timeline/types";
import CanvasRunner from "@/modules/canvas/components/CanvasRunner";
import { compileTimeline } from "@/utils/functions";
import { useResultsStore } from "@/stores/results/useResultsStore";

const PreviewPage = () => {
  const searchParams = useSearchParams();
  const stepId = searchParams.get("id");

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<TimelineStep[] | null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const { clearResults } = useResultsStore();

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.name) {
        const data = JSON.parse(window.name);
        setRawData(data);
        if (data?.steps) {
          const parsedSteps = compileTimeline(data.steps);
          setSteps(parsedSteps);
        }
      }
    } catch (err) {
      console.warn("window.name:", err);
    }
  }, []);

  // Simula loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleStart = async (e) => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen não permitido:", err);
      }
    }
    setTimeout(() => {
      setStarted(true);
    }, 500);
  };

  const resetPreview = () => {
    setLoading(true);
    setStarted(false);
    setSteps(null);
    clearResults();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.warn("Falha ao sair do modo fullscreen:", err);
      });
    }

    // Reload data
    const parsedSteps = compileTimeline(rawData.steps);
    setSteps(parsedSteps);
    setLoading(false);
  };

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-white">
        {/* Canvas com steps carregados */}
        <div className="relative w-full h-full overflow-hidden">
          {!started && <div className="absolute inset-0 bg-black z-50" />}

          {steps && (
            <>
              <button
                className="p-2 bg-black text-white cursor-pointer hover:opacity-80 border border-white absolute left-[-1px] top-[-1px] z-50"
                onClick={resetPreview}
              >
                Restart
              </button>
              <CanvasRunner steps={steps} started={started} />
            </>
          )}
        </div>

        {/* Overlay de início */}
        <div
          onClick={handleStart}
          className={`absolute inset-0 z-50 bg-black text-white flex flex-col items-center justify-center transition-opacity duration-500 ${
            started ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {loading ? (
            <>
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-300">Loading...</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl mb-6">Click on the screen to start</h1>
            </>
          )}
        </div>
      </div>
      <div id="feedback-overlay-root" />
    </>
  );
};

export default PreviewPage;
