import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Video } from "lucide-react";
import React from "react";

const VideoMedia = () => {
  const { editorMode, setEditorMode } = useEditorStore();

  return (
    <button
      onClick={() => {
        setEditorMode({ type: "video" });
      }}
      className={`w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer ${
        editorMode?.type === "video"
          ? "border-blue-500 border-2 border-dashed bg-blue-100"
          : ""
      }`}
    >
      <Video size={20} />
    </button>
  );
};

export default VideoMedia;
