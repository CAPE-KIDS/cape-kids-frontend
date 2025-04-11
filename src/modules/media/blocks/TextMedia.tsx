import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Type } from "lucide-react";
import React from "react";
import { TextTool } from "../tools/TextTool";

const TextMedia = () => {
  const { currentTool, setTool, addStep, resetTool } = useEditorStore();

  const UIContext = {
    setTool,
    addStep,
    resetTool,
  };

  return (
    <button
      onClick={(e) => TextTool.onClick && TextTool.onClick(e, { ...UIContext })}
      className={`w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer ${
        currentTool?.type === TextTool.type
          ? "border-blue-500 border-2 border-dashed bg-blue-100"
          : ""
      }`}
    >
      {TextTool.icon}
    </button>
  );
};

export default TextMedia;
