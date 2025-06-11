import React, { useEffect, useState } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { useResultsStore } from "@/stores/results/useResultsStore";
import { MediaBlock } from "@/modules/media/types";
import { result } from "lodash";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeedbackScreen = () => {
  const { t } = useTranslation("common");
  const { isLastCorrect } = useResultsStore();

  if (isLastCorrect === undefined) return null;

  return (
    <div className="absolute inset-0 z-[50] flex items-center justify-center text-center bg-black text-lg">
      {isLastCorrect ? (
        <div className="flex items-center gap-2">
          <p className="text-2xl font-medium text-green-500">{t("correct")}</p>
          <Check size={20} className="text-green-500" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-2xl font-medium text-red-500 ">{t("incorrect")}</p>
          <X size={20} className="text-red-500 mt-0.5" />
        </div>
      )}
    </div>
  );
};

export default FeedbackScreen;
