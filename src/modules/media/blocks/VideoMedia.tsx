import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Type } from "lucide-react";
import React, { useRef } from "react";
import { VideoTool } from "../tools/VideoTool";

const VideoMedia = () => {
  const { currentTool, setTool } = useEditorStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelection = () => {
    if (inputRef.current) {
      inputRef.current.click();
      // Add the video block to the editor state
      // setTool(videoBlock);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setTool(VideoTool);
          handleVideoSelection();
        }}
        className={`w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer ${
          currentTool?.type === VideoTool.type
            ? "border-blue-500 border-2 border-dashed bg-blue-100"
            : ""
        }`}
      >
        {VideoTool.icon}
      </button>
      <input ref={inputRef} type="file" className="hidden" />
    </>
  );
};

export default VideoMedia;
