import React, { useEffect, useMemo, useRef } from "react";
import { MediaBlock } from "@/modules/media/types";
import { DraggableData, Rnd, RndDragEvent, RndResizeCallback } from "react-rnd";
import { Move } from "lucide-react";
import { TextEditor } from "../TextEditor/TextEditor";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { debounce } from "lodash";

const TextRenderer: React.FC<{ block: MediaBlock }> = ({ block }) => {
  const { getAbsoluteSize, getRelativeSize, screen, updateBlock } =
    useEditorStore();
  const lastTextRef = useRef(block.data.text);

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

    updateBlock({
      ...block,
      position: {
        x: newX,
        y: newY,
      },
      size: {
        width: newWidth,
        height: newHeight,
      },
    });
  };

  const handleTextChange = (value: string) => {
    const previousText = lastTextRef.current;

    if (value === previousText) return;

    lastTextRef.current = value;

    updateBlock({
      ...block,
      data: {
        ...block.data,
        text: value,
      },
    });
  };

  useEffect(() => {
    if (!screen) return;
  }, [screen?.width, screen?.height]);

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
      className="border border-dashed rounded-sm relative"
      bounds="parent"
      dragHandleClassName="drag-handle"
      resizeHandleStyles={{
        bottomRight: { cursor: "nwse-resize" },
      }}
      onDragStop={handleDrag}
      onResizeStop={handleResize}
    >
      <div className="absolute -top-1 -right-[30px] cursor-move bg-white p-1 rounded-sm shadow-md drag-handle">
        <Move size={20} />
      </div>
      <TextEditor onChange={handleTextChange} data={block.data} />
    </Rnd>
  );
};

export default TextRenderer;
