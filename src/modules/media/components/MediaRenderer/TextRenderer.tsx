import React, { useEffect, useMemo, useRef, useState } from "react";
import { MediaBlock } from "@/modules/media/types";
import { DraggableData, Rnd, RndDragEvent, RndResizeCallback } from "react-rnd";
import { Delete, Move, Trash2 } from "lucide-react";
import { TextEditor } from "../TextEditor/TextEditor";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { debounce } from "lodash";
import { getAbsoluteSize, getRelativeSize } from "@/utils/functions";

const TextRenderer: React.FC<{ block: MediaBlock }> = ({ block }) => {
  const { screen, updateStep, deleteBlock } = useEditorStore();
  const lastTextRef = useRef(block.data.text);
  const [isEditable, setIsEditable] = useState(false);

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

    updateStep({
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

  const handleTextChange = (html: string, text: string) => {
    if (block.data.text === text) return;

    updateStep({
      ...block,
      data: {
        ...block.data,
        text,
        html,
      },
    });
  };

  if (!screen?.width || !screen?.height) return null;

  return (
    <Rnd
      position={{
        x: getAbsoluteSize(block.position?.x || 0, screen?.width),
        y: getAbsoluteSize(block.position?.y || 0, screen?.height),
      }}
      size={{
        width: getAbsoluteSize(block.size?.width || 300, screen?.width),
        height: getAbsoluteSize(block.size?.height || 200, screen?.height),
      }}
      className={`border border-dashed rounded-sm relative ${
        isEditable ? "bg-yellow-50 bg-opacity-10" : "bg-transparent drag-handle"
      }`}
      bounds="parent"
      dragHandleClassName="drag-handle"
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
        className="absolute bottom-[-2px] -right-[22px] cursor-pointer bg-red-500 p-1 rounded-sm shadow-md"
      >
        <Trash2 size={12} color="white" />
      </div>
      <TextEditor
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        onChange={handleTextChange}
        block={block}
      />
    </Rnd>
  );
};

export default TextRenderer;
