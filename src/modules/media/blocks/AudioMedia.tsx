import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Headphones } from "lucide-react";
import React from "react";

const AudioMedia = () => {
  const { editorMode, setEditorMode } = useEditorStore();

  return (
    <button
      onClick={() => {
        setEditorMode({ type: "audio" });
      }}
      className={`w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer ${
        editorMode?.type === "audio"
          ? "border-blue-500 border-2 border-dashed bg-blue-100"
          : ""
      }`}
    >
      <Headphones size={20} />
    </button>
  );
};

export default AudioMedia;
