import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Type } from "lucide-react";
import React from "react";
import { AudioTool } from "../tools/AudioTool";

const AudioMedia = () => {
  const { currentTool, setTool } = useEditorStore();

  return (
    <button
      onClick={() => {
        setTool(AudioTool);
      }}
      className={`w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer ${
        currentTool?.type === AudioTool.type
          ? "border-blue-500 border-2 border-dashed bg-blue-100"
          : ""
      }`}
    >
      {AudioTool.icon}
    </button>
  );
};

export default AudioMedia;
