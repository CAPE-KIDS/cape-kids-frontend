// modules/media/tools/TextTool.ts
import { ScreenUtils, Tool } from "@/types/editor.types";
import { Headphones } from "lucide-react";
import { MouseEvent } from "react";

export const AudioTool: Tool = {
  type: "audio",
  editorStyles: "cursor-crosshair",
  icon: <Headphones size={20} />,
  onMouseDown: (e: MouseEvent, utils: ScreenUtils) => {
    console.log("AudioTool onmousedown", e, utils);
  },
  onMouseMove: (e, utils) => {
    console.log("AudioTool onmousemove");
  },
  onMouseUp: (e, utils) => {
    console.log("AudioTool onmouseup");
  },
};
