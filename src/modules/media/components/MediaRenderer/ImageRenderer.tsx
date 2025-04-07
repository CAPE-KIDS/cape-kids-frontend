import { useEditorStore } from "@/stores/editor/useEditorStore";
import { MediaBlock } from "@/modules/media/types";
import React from "react";
import { DraggableData, Rnd, RndDragEvent, RndResizeCallback } from "react-rnd";

const ImageRenderer = ({ block }: { block: MediaBlock }) => {
  const { getAbsoluteSize, getRelativeSize, screen, updateBlock } =
    useEditorStore();

  const handleDrag = (e: RndDragEvent, { x, y }: DraggableData) => {
    if (!screen?.width || !screen.height) return;

    const absoluteX = getRelativeSize(x, screen.width);
    const absuloteY = getRelativeSize(y, screen.height);

    updateBlock({
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

    updateBlock({ ...newBlock });

    console.log(newBlock);
  };

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
      className="border border-dashed rounded-sm"
      bounds="parent"
      // lockAspectRatio
      resizeHandleStyles={{
        bottomRight: { cursor: "nwse-resize" },
      }}
      onDragStop={handleDrag}
      onResizeStop={handleResize}
    >
      <img
        src={block.data.src}
        alt=""
        className="w-full h-full object-contain pointer-events-none"
      />
    </Rnd>
  );
};

export default ImageRenderer;
