// components/CanvasMediaRenderer.tsx

import { MediaBlock } from "@/modules/media/types";
import { useCanvasStore } from "../store/useCanvasStore";
import { getAbsoluteSize } from "@/utils/functions";
import { useEffect } from "react";
import { useTriggerHandler } from "@/modules/triggers/useTriggerHandler";
import { z } from "zod";
import SaveScreen from "./SaveScreen";
import FeedbackScreen from "./FeedbackScreen";
import { Cross, Plus } from "lucide-react";

export const CanvasMediaRenderer: React.FC<{ block: MediaBlock }> = ({
  block,
}) => {
  const { screen } = useCanvasStore();
  const { getHandlersFromTriggers } = useTriggerHandler();
  const handlers = getHandlersFromTriggers(block.triggers);

  if (block.type === "feedback") {
    return <FeedbackScreen />;
  }

  if (block.type === "save") {
    return <SaveScreen />;
  }

  if (block.type === "inter_stimulus") {
    const hasTriggers = block.triggers && block.triggers.length > 0;

    return (
      <div
        {...handlers}
        tabIndex={0}
        className={`${
          hasTriggers
            ? " absolute inset-0 z-50 pointer-events-auto bg-black flex items-center justify-center"
            : "pointer-events-none hidden"
        }`}
        style={{ width: "100%", height: "100%" }}
        data-block-id={block.id}
      >
        <Plus size={40} className="text-white" />
      </div>
    );
  }

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
        data-block-id={block.id}
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
    height: `${
      block.size?.height
        ? getAbsoluteSize(block.size?.height, screen?.height) + "px"
        : "auto"
    }`,
    ...block.data,
    fontSize: `${fontSize}px`,
    zIndex: 100,
  };

  switch (block.type) {
    case "text":
      return (
        <div
          {...handlers}
          style={{
            ...style,
            height: "auto",
          }}
          className="leading-none"
          dangerouslySetInnerHTML={{
            __html: block.data.html || block.data.text,
          }}
          data-block-id={block.id}
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
          data-block-id={block.id}
        />
      );

    case "video":
      return (
        <video
          {...handlers}
          controls
          style={style}
          className="rounded object-contain"
          data-block-id={block.id}
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
          data-block-id={block.id}
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
