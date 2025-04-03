// components/MediaRenderer.tsx

import { MediaBlock } from "@/types/media.types";
import { Rnd } from "react-rnd";

export const MediaRenderer: React.FC<{ block: MediaBlock }> = ({ block }) => {
  switch (block.type) {
    case "text":
      return (
        <div className="border border-dashed p-2 rounded-sm text-sm text-black">
          {block.data.text}
        </div>
      );
    case "image":
      return (
        <Rnd
          default={{
            x: 100,
            y: 100,
            width: 300,
            height: 200,
          }}
          className="border border-dashed rounded-sm"
          bounds="parent"
          // lockAspectRatio
          resizeHandleStyles={{
            bottomRight: { cursor: "nwse-resize" },
          }}
        >
          <img
            src={block.data.src}
            alt=""
            className="w-full h-full object-contain pointer-events-none"
          />
        </Rnd>
      );
    case "video":
      return (
        <video controls className="max-w-full rounded">
          <source src={block.data.src} />
          Your browser does not support the video tag.
        </video>
      );
    case "audio":
      return (
        <audio controls className="w-full">
          <source src={block.data.src} />
          Your browser does not support the audio element.
        </audio>
      );
    default:
      return null;
  }
};
