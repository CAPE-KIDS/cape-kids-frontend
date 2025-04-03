// modules/media/tools/TextTool.ts
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { EditorContext, Tool } from "@/types/editor.types";
import { MediaBlock } from "@/types/media.types";
import { Image } from "lucide-react";
import { MouseEvent } from "react";

export const ImageTool: Tool = {
  type: "image",
  editorStyles: "cursor-move",
  icon: <Image size={20} />,
  onMouseDown: (e: MouseEvent, ctx: EditorContext) => {
    console.log("ImageTool onmousedown", e, ctx);
  },
  onMouseMove: (e: MouseEvent, ctx: EditorContext) => {
    console.log("ImageTool onmousemove");
  },
  onMouseUp: (e: MouseEvent, ctx: EditorContext) => {
    console.log("ImageTool onmouseup");
  },
  onClick: (e, { setTool, inputRef }) => {
    const tool = setTool(ImageTool);
    if (!tool) return;

    inputRef?.current && inputRef.current.click();
  },
  onChange: (e, { addBlock }) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageSrc = event.target?.result as string;
        const block = {
          id: crypto.randomUUID(),
          type: ImageTool.type,
          position: { x: 0, y: 0 },
          size: { width: 200, height: 200 },
          data: {
            src: imageSrc,
            alt: file.name,
          },
        } as MediaBlock;

        addBlock(block);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  },
};
