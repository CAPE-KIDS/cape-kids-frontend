import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Type } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { ImageTool } from "../tools/ImageTool";
import { MediaBlock } from "@/modules/media/types";
import { EditorContext, ToolUIContext } from "@/types/editor.types";

const ImageMedia = () => {
  const { screen, currentTool, setTool, addStep, resetTool } = useEditorStore();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("cancel", () => {
        ImageTool.onCancel && ImageTool.onCancel({ ...UIContext });
      });
    }
  }, [inputRef.current]);

  const UIContext = {
    screen,
    inputRef,
    setTool,
    addStep,
    resetTool,
  } as ToolUIContext;

  return (
    <>
      <button
        onClick={(e) =>
          ImageTool.onClick && ImageTool.onClick(e, { ...UIContext })
        }
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
        onChange={(e) =>
          ImageTool.onChange && ImageTool.onChange(e, { ...UIContext })
        }
      />
    </>
  );
};

export default ImageMedia;
