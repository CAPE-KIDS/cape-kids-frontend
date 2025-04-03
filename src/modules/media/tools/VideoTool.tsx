// modules/media/tools/TextTool.ts
import { ScreenUtils, Tool } from "@/types/editor.types";
import { Video } from "lucide-react";
import { MouseEvent } from "react";

export const VideoTool: Tool = {
  type: "video",
  editorStyles: "cursor-crosshair",
  icon: <Video size={20} />,
  onMouseDown: (e: MouseEvent, utils: ScreenUtils) => {
    console.log("VideoTool onmousedown", e, utils);
  },
  onMouseMove: (e, utils) => {
    console.log("VideoTool onmousemove", e, utils);
  },
  onMouseUp: (e, utils) => {
    console.log("VideoTool onmouseup");
  },
};
