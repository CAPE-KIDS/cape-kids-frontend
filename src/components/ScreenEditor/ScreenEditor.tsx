import { MediaRenderer } from "@/modules/media/components/MediaRenderer/MediaRenderer";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import React, { useEffect } from "react";
import { useEvents } from "./useEvents";
import { useSizeObserver } from "@/hooks/useSizeObserver";

export const ScreenEditor = () => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const { currentTool, blocks, setEditorContainer } = useEditorStore();
  const { events } = useEvents();
  const screenSize = useSizeObserver(editorRef);

  useEffect(() => {
    if (editorRef.current) {
      setEditorContainer({
        element: editorRef.current,
        width: screenSize.width,
        height: screenSize.height,
      });
    }
  }, [editorRef, setEditorContainer, screenSize]);

  return (
    <div
      ref={editorRef}
      {...events}
      className={`aspect-video rounded-md p-4 h-auto border-2 flex flex-col gap-2 relative overflow-hidden ${
        currentTool ? "border-dashed border-blue-500" : "border-transparent"
      } ${currentTool?.editorStyles}
      bg-[#E8EBFB]`}
    >
      {blocks.map((block) => (
        <MediaRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};
