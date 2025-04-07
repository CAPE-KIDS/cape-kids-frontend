// components/CanvasMediaRenderer.tsx

import { MediaBlock } from "@/modules/media/types";
import { useEditorStore } from "@/stores/editor/useEditorStore";

export const CanvasMediaRenderer: React.FC<{ block: MediaBlock }> = ({
  block,
}) => {
  const { getAbsoluteSize } = useEditorStore();

  const style = {
    position: "absolute" as const,
    left: `${getAbsoluteSize(block.position.x, window.innerWidth)}px`,
    top: `${getAbsoluteSize(block.position.y, window.innerHeight)}px`,
    width: `${getAbsoluteSize(block.size.width, window.innerWidth)}px`,
    height: `${getAbsoluteSize(block.size.height, window.innerHeight)}px`,
  };

  switch (block.type) {
    case "text":
      return (
        <div
          style={style}
          className="flex items-center justify-center text-black text-base"
        >
          {block.data.text}
        </div>
      );

    case "image":
      return (
        <img
          src={block.data.src}
          alt=""
          style={style}
          className="rounded object-contain"
        />
      );

    case "video":
      return (
        <video controls style={style} className="rounded object-contain">
          <source src={block.data.src} />
          Your browser does not support the video tag.
        </video>
      );

    case "audio":
      return (
        <div style={style} className="flex items-center justify-center">
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
