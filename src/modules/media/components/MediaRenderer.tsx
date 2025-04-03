// components/MediaRenderer.tsx

import { MediaBlock } from "@/types/media.types";
import { Rnd } from "react-rnd";
import { TextEditor } from "./TextEditor/TextEditor";
import { Move } from "lucide-react";

export const MediaRenderer: React.FC<{ block: MediaBlock }> = ({ block }) => {
  switch (block.type) {
    case "text":
      return (
        <Rnd
          default={{
            x: block.position ? block.position.x : 0,
            y: block.position ? block.position.y : 0,
            width: block.size ? block.size.width : 300,
            height: block.size ? block.size.height : 200,
          }}
          className="border border-dashed rounded-sm relative"
          bounds="parent"
          // lockAspectRatio
          dragHandleClassName="drag-handle"
          resizeHandleStyles={{
            bottomRight: { cursor: "nwse-resize" },
          }}
        >
          <div className="absolute -top-1 -right-[30px] cursor-move bg-white p-1 rounded-sm shadow-md drag-handle">
            <Move size={20} />
          </div>
          <TextEditor onChange={(value) => {}} />
        </Rnd>
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
