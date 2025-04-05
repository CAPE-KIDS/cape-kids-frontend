// components/MediaRenderer.tsx

import { MediaBlock } from "@/types/media.types";
import { Rnd } from "react-rnd";
import { TextEditor } from "../TextEditor/TextEditor";
import { Move } from "lucide-react";
import TextRenderer from "./TextRenderer";
import ImageRenderer from "./ImageRenderer";

export const MediaRenderer: React.FC<{ block: MediaBlock }> = ({ block }) => {
  switch (block.type) {
    case "text":
      return <TextRenderer block={block} />;
    case "image":
      return <ImageRenderer block={block} />;
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
