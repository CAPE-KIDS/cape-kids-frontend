// modules/media/tools/TextTool.ts
import { ScreenUtils, Tool } from "@/types/editor.types";
import { Image } from "lucide-react";
import { MouseEvent } from "react";

export const ImageTool: Tool = {
  type: "image",
  editorStyles: "cursor-move",
  icon: <Image size={20} />,
  onMouseDown: (e: MouseEvent, utils: ScreenUtils) => {
    console.log("ImageTool onmousedown", e, utils);
  },
  onMouseMove: (e, utils) => {
    console.log("ImageTool onmousemove");
  },
  onMouseUp: (e, utils) => {
    console.log("ImageTool onmouseup");
  },
};
