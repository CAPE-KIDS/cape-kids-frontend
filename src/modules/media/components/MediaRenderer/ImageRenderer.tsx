import { useEditorStore } from "@/stores/editor/useEditorStore";
import { MediaBlock } from "@/modules/media/types";
import React from "react";
import { DraggableData, Rnd, RndDragEvent, RndResizeCallback } from "react-rnd";
import { getAbsoluteSize, getRelativeSize } from "@/utils/functions";
import { Trash2 } from "lucide-react";

const ImageRenderer = ({ block }: { block: MediaBlock }) => {
  const { screen, updateStep, deleteBlock } = useEditorStore();

  const handleDrag = (e: RndDragEvent, { x, y }: DraggableData) => {
    if (!screen?.width || !screen.height) return;

    const absoluteX = getRelativeSize(x, screen.width);
    const absuloteY = getRelativeSize(y, screen.height);

    updateStep({
      ...block,
      position: {
        x: absoluteX,
        y: absuloteY,
      },
    });
  };

  const handleResize: RndResizeCallback = (
    e,
    direction,
    ref,
    delta,
    position
  ) => {
    if (!screen?.width || !screen.height) return;

    const newWidth = getRelativeSize(ref.offsetWidth, screen.width);
    const newHeight = getRelativeSize(ref.offsetHeight, screen.height);

    const newX = getRelativeSize(position.x, screen.width);
    const newY = getRelativeSize(position.y, screen.height);

    const newBlock = {
      ...block,
      position: {
        x: newX,
        y: newY,
      },
      size: {
        width: newWidth,
        height: newHeight,
      },
    };

    updateStep({ ...newBlock });
  };

  if (!screen?.width || !screen.height) return null;

  return (
    <Rnd
      position={{
        x: getAbsoluteSize(block.position?.x || 0, screen.width),
        y: getAbsoluteSize(block.position?.y || 0, screen.height),
      }}
      size={{
        width: getAbsoluteSize(block.size?.width || 300, screen.width),
        height: getAbsoluteSize(block.size?.height || 200, screen.height),
      }}
      className="border border-dashed rounded-sm object-contain"
      bounds="parent"
      // lockAspectRatio
      resizeHandleStyles={{
        bottomRight: { cursor: "nwse-resize" },
      }}
      onDragStop={handleDrag}
      onResizeStop={handleResize}
    >
      <div
        onClick={() => {
          if (!block.id) return;
          deleteBlock(block.id);
        }}
        className="absolute -bottom-0 -right-[22px] cursor-pointer bg-red-500 p-1 rounded-sm shadow-md"
      >
        <Trash2 size={12} color="white" />
      </div>
      <img
        src={block.data.src}
        alt=""
        className="w-full h-full object-contain pointer-events-none"
      />
    </Rnd>
  );
};

export default ImageRenderer;
