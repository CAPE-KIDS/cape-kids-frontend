"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, JSX } from "react";
import CanvasRunner from "@/modules/canvas/components/CanvasRunner";
import { compileTimeline } from "@/utils/functions";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { TimelineStep } from "@shared/timeline";
import { useCanvasStore } from "@/modules/canvas/store/useCanvasStore";
import CanvasDebugger from "@/modules/canvas/components/CanvasDebugger";
import { API } from "@/utils/api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useTranslation } from "react-i18next";

const PreviewContent = () => {
  const { t: tC } = useTranslation("common");
  const searchParams = useSearchParams();
  const stepId = searchParams.get("id");
  const { activeStep } = useCanvasStore();
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<TimelineStep[] | null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const { clearResults } = useResultsStore();
  const { authState } = useAuthStore();

  const compileSteps = async (steps: TimelineStep[]) => {
    const compiledSteps = await compileTimeline(steps);
    setSteps(compiledSteps);
    return compiledSteps;
  };

  async function getTimelineData() {
    if (!stepId) return toast.error("Timeline ID inválido ou não fornecido.");
    const request = await fetch(API.GET_TIMELINE_ID_BY_SOURCE_ID(stepId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();

    if (response.error) {
      console.error("Erro ao buscar dados da timeline:", response.error);
      toast.error(tC("error_getting_timeline_data"));
      return;
    }
    console.log(response);
    compileSteps(response.data.steps);
  }

  useEffect(() => {
    try {
      if (!window.name) {
        getTimelineData();
        return;
      }

      if (typeof window !== "undefined" && window.name) {
        const data = JSON.parse(window.name);
        setRawData(data);
        if (data?.steps) {
          compileSteps(data.steps);
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
    if (loading) return;
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

  const resetPreview = async () => {
    window.location.reload();
    return;
  };

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-white">
        <div className="relative w-full h-full overflow-hidden">
          {!started && <div className="absolute inset-0 bg-black z-50" />}

          {started && steps && (
            <div className="w-screen h-screen bg-black flex items-center justify-center">
              <div
                className="bg-white relative"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "calc(100vh * (16 / 9))",
                  maxHeight: "calc(100vw * (9 / 16))",
                  aspectRatio: "16 / 9",
                }}
              >
                <button
                  className="p-2 bg-black text-white cursor-pointer hover:opacity-80 border border-white absolute left-[-1px] top-[-1px] z-50"
                  onClick={resetPreview}
                >
                  {tC("restart")}
                </button>
                {activeStep && authState.user && <CanvasDebugger />}

                <CanvasRunner steps={steps} started={started} />
              </div>
            </div>
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
              <p className="text-sm text-gray-300">{tC("loading")}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl mb-6">
                {tC("click_on_screen_to_start")}
              </h1>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PreviewContent;
