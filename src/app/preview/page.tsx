// app/preview/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TimelineStep } from "@/modules/timeline/types";

const CanvasRunner = dynamic(
  () => import("@/modules/canvas/components/CanvasRunner"),
  { ssr: false }
);

const PreviewPage = () => {
  const searchParams = useSearchParams();
  const stepId = searchParams.get("id");

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<TimelineStep[] | null>(null);

  // Carrega os steps via window.name
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.name) {
        const data = JSON.parse(window.name);
        console.log(data.steps);
        if (data?.steps) {
          setSteps(data.steps);
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
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleStart = async () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen não permitido:", err);
      }
    }
    setStarted(true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Canvas com steps carregados */}
      {steps && <CanvasRunner steps={steps} />}

      {/* Overlay de início */}
      <div
        className={`absolute inset-0 z-50 bg-black text-white flex flex-col items-center justify-center transition-opacity duration-500 ${
          started ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {loading ? (
          <>
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-300">Carregando experimento...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl mb-6">Pronto para começar?</h1>
            <button
              onClick={handleStart}
              className="bg-white text-black px-6 py-3 rounded-lg text-lg hover:bg-gray-200 transition"
            >
              Começar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
