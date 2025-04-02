import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Image } from "lucide-react";
import React from "react";

const ImageMedia = () => {
  const { editorMode, setEditorMode } = useEditorStore();

  return (
    <button
      onClick={() => {
        setEditorMode({ type: "image" });
      }}
      className={`w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer ${
        editorMode?.type === "image"
          ? "border-blue-500 border-2 border-dashed bg-blue-100"
          : ""
      }`}
    >
      <Image size={20} />
    </button>
  );
};

export default ImageMedia;
