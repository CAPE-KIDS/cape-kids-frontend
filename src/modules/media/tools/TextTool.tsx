// modules/media/tools/TextTool.ts
import { ScreenUtils, Tool } from "@/types/editor.types";
import { Type } from "lucide-react";
import { MouseEvent } from "react";

export const TextTool: Tool = {
  type: "text",
  cursor: "crosshair",
  icon: <Type size={20} />,
  onMouseDown: (e: MouseEvent, utils: ScreenUtils) => {
    console.log("TextTool onmousedown", e, utils);
  },
  onMouseMove: (e, utils) => {
    console.log("TextTool onmousemove");
  },
  onMouseUp: (e, utils) => {
    console.log("TextTool onmouseup");
  },
};
