// modules/media/tools/TextTool.ts
import { Tool } from "@/types/editor.types";
import { TextBlockData } from "@/modules/media/types";
import { Type } from "lucide-react";
import { MouseEvent } from "react";
import { getRelativeSize } from "@/utils/functions";

let draft: {
  start: { x: number; y: number };
  current: { x: number; y: number };
} | null = null;

export const TextTool: Tool = {
  type: "text",
  editorStyles: "cursor-crosshair",
  icon: <Type size={20} />,

  onMouseDown: (e: MouseEvent, { getRelativePosition }) => {
    const { x, y } = getRelativePosition(e);
    draft = {
      start: { x, y },
      current: { x, y },
    };
  },

  onMouseMove: (e, { getRelativePosition }) => {
    if (!draft) return;
    const { x, y } = getRelativePosition(e);
    draft.current = { x, y };
  },

  onMouseUp: (e, { addStep, screen }) => {
    if (!draft) return;

    const start = draft.start;
    const end = draft.current;

    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    if (width < 1 || height < 1) {
      draft = null;
      return;
    }

    if (!screen.width || !screen.height) return;

    const block = {
      id: crypto.randomUUID(),
      type: TextTool.type,
      position: {
        x: getRelativeSize(x, screen.width),
        y: getRelativeSize(y, screen.height),
      },
      size: {
        width: getRelativeSize(width, screen.width),
        height: getRelativeSize(height, screen.height),
      },
      data: { text: "" } as TextBlockData,
    };

    addStep(block);
    draft = null;
  },

  onDragEnd: (e, { getRelativePosition }) => {
    const pos = getRelativePosition(e);
    console.log("drag ended at", pos);
  },

  onClick: (e, { setTool }) => {
    setTool(TextTool);
  },
};
