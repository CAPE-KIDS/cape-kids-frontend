// modules/media/tools/TextTool.ts
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { EditorContext, Tool } from "@/types/editor.types";
import { MediaBlock } from "@/modules/media/types";
import { Image } from "lucide-react";
import { MouseEvent } from "react";
import { text } from "stream/consumers";
import { getRelativeSize } from "@/utils/functions";

export const ImageTool: Tool = {
  type: "image",
  editorStyles: "cursor-move",
  icon: <Image size={20} />,
  onMouseDown: (e: MouseEvent, ctx: EditorContext) => {},
  onMouseMove: (e: MouseEvent, ctx: EditorContext) => {},
  onMouseUp: (e: MouseEvent, ctx: EditorContext) => {},
  onClick: (e, { setTool, inputRef }) => {
    const tool = setTool(ImageTool);
    if (!tool) return;

    inputRef?.current && inputRef.current.click();
  },
  onChange: (e, { addStep, addStepFile, screen, resetTool }) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageSrc = event.target?.result as string;
        const imageName = file.name.split(".").slice(0, -1).join(".");
        const imageExtension = file.name.split(".").pop();

        if (!screen.width || !screen.height) return;

        const initialX = 0;
        const initialY = 0;
        const initialWidth = 300;
        const initialHeight = 200;
        const blockId = crypto.randomUUID();
        const block = {
          id: blockId,
          type: ImageTool.type,
          position: {
            x: getRelativeSize(initialX, screen.width),
            y: getRelativeSize(initialY, screen.height),
          },
          size: {
            width: getRelativeSize(initialWidth, screen.width),
            height: getRelativeSize(initialHeight, screen.height),
          },
          data: {
            text: `${imageName}.${imageExtension}`,
            src: imageSrc,
            alt: file.name,
          },
        } as MediaBlock;

        addStep(block);
        addStepFile(blockId, file);
        resetTool();
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  },
};
