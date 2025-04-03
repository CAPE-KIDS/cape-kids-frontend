import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Type } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { ImageTool } from "../tools/ImageTool";
import { MediaBlock } from "@/types/media.types";

const ImageMedia = () => {
  const { currentTool, setTool, addBlock, resetTool } = useEditorStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    console.log("disparou click");
    const tool = setTool(ImageTool);
    if (!tool) return;

    inputRef.current && inputRef.current.click();
  }, [currentTool, setTool]);

  const handleFileSelection = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageSrc = event.target?.result as string;
          // Add the image block to the editor state
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
    [currentTool]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("cancel", (e) => {
        resetTool();
      });
    }
  }, [inputRef.current]);

  return (
    <>
      <button
        onClick={handleClick}
        className={`w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer ${
          currentTool?.type === ImageTool.type
            ? "border-blue-500 border-2 border-dashed bg-blue-100"
            : ""
        }`}
      >
        {ImageTool.icon}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          handleFileSelection(e);
        }}
      />
    </>
  );
};

export default ImageMedia;
