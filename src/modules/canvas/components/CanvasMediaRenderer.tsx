// components/CanvasMediaRenderer.tsx

import { MediaBlock } from "@/modules/media/types";
import { useCanvasStore } from "../store/useCanvasStore";
import { getAbsoluteSize } from "@/utils/functions";
import { useEffect } from "react";
import { useTriggerHandler } from "@/modules/triggers/useTriggerHandler";
import { z } from "zod";

export const CanvasMediaRenderer: React.FC<{ block: MediaBlock }> = ({
  block,
}) => {
  const { screen } = useCanvasStore();
  const { getHandlersFromTriggers } = useTriggerHandler();
  const handlers = getHandlersFromTriggers(block.triggers);

  if (block.type === "screen") {
    const hasTriggers = block.triggers && block.triggers.length > 0;

    return (
      <div
        {...handlers}
        tabIndex={0}
        className={`${
          hasTriggers
            ? " absolute inset-0  z-50 pointer-events-auto"
            : "pointer-events-none hidden"
        }`}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }

  const fontSize = block.data.fontSize
    ? getAbsoluteSize(block.data.fontSize, screen?.width)
    : 16;

  const style = {
    position: "absolute" as const,
    left: `${getAbsoluteSize(block.position.x, screen?.width)}px`,
    top: `${getAbsoluteSize(block.position.y, screen?.height)}px`,
    width: `${getAbsoluteSize(block.size.width, screen?.width)}px`,
    height: `auto`,
    ...block.data,
    fontSize: `${fontSize}px`,
    zIndex: 100,
  };

  switch (block.type) {
    case "text":
      console.log(block);
      return (
        <div
          {...handlers}
          style={style}
          className="leading-none"
          dangerouslySetInnerHTML={{ __html: block.data.html }}
        ></div>
      );

    case "image":
      return (
        <img
          {...handlers}
          src={block.data.src}
          alt=""
          style={style}
          className="rounded object-contain"
        />
      );

    case "video":
      return (
        <video
          {...handlers}
          controls
          style={style}
          className="rounded object-contain"
        >
          <source src={block.data.src} />
          Your browser does not support the video tag.
        </video>
      );

    case "audio":
      return (
        <div
          {...handlers}
          style={style}
          className="flex items-center justify-center"
        >
          <audio controls className="w-full">
            <source src={block.data.src} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );

    default:
      return null;
  }
};
