import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Type } from "lucide-react";
import React from "react";
import { TextTool } from "../tools/TextTool";

const TextMedia = () => {
  const { currentTool, setTool, addStep, resetTool, editorContext } =
    useEditorStore();

  const UIContext = {
    setTool,
    addStep,
    resetTool,
  };

  const handleClick = (e: React.MouseEvent) => {
    // if (editorContext === "main") {
    //   TextTool.onClick && TextTool.onClick(e, { ...UIContext });
    // }
    TextTool.onClick && TextTool.onClick(e, { ...UIContext });
  };

  return (
    <button
      onClick={handleClick}
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
