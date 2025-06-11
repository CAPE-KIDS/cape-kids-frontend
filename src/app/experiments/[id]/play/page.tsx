"use client";
import CanvasDebugger from "@/modules/canvas/components/CanvasDebugger";
import CanvasRunner from "@/modules/canvas/components/CanvasRunner";
import { useCanvasStore } from "@/modules/canvas/store/useCanvasStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { API } from "@/utils/api";
import { compileTimeline } from "@/utils/functions";
import { TimelineStep } from "@shared/timeline";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PlayExperiment = () => {
  const { t: tC } = useTranslation("common");
  const { authState } = useAuthStore();
  const searchParams = useParams();
  const stepId = searchParams.id as string;
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<TimelineStep[] | null>(null);

  const compileSteps = async () => {
    const request = await fetch(API.EXPERIMENT_BY_ID(stepId || ""), {
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });
    const response = await request.json();

    if (response.error) {
      console.error("Error fetching experiment:", response.error);
      setLoading(false);
      return;
    }
    const compiledSteps = await compileTimeline(response.data.timeline.steps);
    setSteps(compiledSteps);
    setLoading(false);
  };

  useEffect(() => {
    if (!authState.user) return;
    compileSteps();
  }, [authState]);

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
                <CanvasRunner steps={steps} started={started} />
              </div>
            </div>
          )}
        </div>

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

export default PlayExperiment;
