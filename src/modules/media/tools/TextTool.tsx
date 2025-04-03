// modules/media/tools/TextTool.ts
import { ScreenUtils, Tool } from "@/types/editor.types";
import { Type } from "lucide-react";
import { MouseEvent } from "react";

let draft: {
  start: { x: number; y: number };
  width: number;
  height: number;
} | null = null;

export const TextTool: Tool = {
  type: "text",
  editorStyles: "cursor-crosshair",
  icon: <Type size={20} />,
  onMouseDown: (e: MouseEvent, { getRelativePosition }) => {
    const pos = getRelativePosition(e);
    draft = { start: pos, width: 0, height: 0 };
  },
  onMouseMove: (e, { getRelativePosition }) => {
    if (!draft) return;
    const pos = getRelativePosition(e);
    draft.width = pos.x - draft.start.x;
    draft.height = pos.y - draft.start.y;
  },
  onMouseUp: (e, { addBlock, getRelativePosition }) => {
    if (!draft) return;

    const block = {
      id: crypto.randomUUID(),
      type: TextTool.type,
      position: {
        x: draft.start.x,
        y: draft.start.y,
      },
      size: { width: draft.width, height: draft.height },
      data: { text: "New Text" },
    };

    addBlock(block);
    draft = null;
  },
};
