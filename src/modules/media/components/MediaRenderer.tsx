// components/MediaRenderer.tsx

import { MediaBlock } from "@/stores/editor/useEditorStore";

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
        <img
          src={block.data.src}
          alt={block.data.alt || ""}
          className="max-w-full rounded"
        />
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
