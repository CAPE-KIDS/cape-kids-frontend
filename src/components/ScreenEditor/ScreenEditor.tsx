import { MediaRenderer } from "@/modules/media/components/MediaRenderer";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import React from "react";
import { useEvents } from "./useEvents";

export const ScreenEditor = () => {
  const { currentTool, blocks } = useEditorStore();
  const { events } = useEvents();

  return (
    <div
      {...events}
      className={`rounded-md p-4 h-[360px] border-2 flex flex-col gap-2 relative overflow-hidden ${
        currentTool ? "border-dashed border-blue-500" : "border-transparent"
      } ${"cursor-" + currentTool?.cursor}
      bg-[#E8EBFB]`}
    >
      {blocks.map((block) => (
        <MediaRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};
