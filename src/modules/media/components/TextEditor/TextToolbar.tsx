// components/TextEditor/TextToolbar.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import {
  FORMAT_TEXT_STYLE_COMMAND,
  StringStyle,
} from "./plugins/TextStylePlugin";
import { Bold, ChevronRight, Italic, Underline } from "lucide-react";
import { useState } from "react";

export const TextToolbar = () => {
  const [showToobar, setShowToolbar] = useState(false);
  const [editor] = useLexicalComposerContext();

  const applyStyle = (style: Partial<CSSStyleDeclaration | StringStyle>) => {
    editor.dispatchCommand(FORMAT_TEXT_STYLE_COMMAND, style);
  };

  // default method to apply style
  // const toggleFormat = (format: "bold" | "italic" | "underline") => {
  //   editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  // };

  const fontSizes = [12, 14, 16, 18, 24, 32, 40, 48, 56, 64, 72, 80, 96];
  const fontFamilies = ["Arial", "Inter", "Georgia", "Times New Roman"];

  return (
    <div className=" drag-handle absolute flex bg-gray p-1 shadow text-sm bg-white px-2 -top-9 h-8 left-0">
      <div
        className={`flex items-center gap-1 cursor-pointer hover:bg-gray-200 rounded-sm p-1 ${
          showToobar ? "" : ""
        }`}
        onClick={() => setShowToolbar((prev) => !prev)}
      >
        <ChevronRight
          size={16}
          className={` ${showToobar ? "rotate-180" : ""}`}
        />
      </div>

      <div
        className={`flex items-center gap-2 origin-left transition-all duration-300 ease-in-out ${
          showToobar
            ? "opacity-100 scale-x-100  max-w-[450px]"
            : "opacity-0 scale-x-0 max-w-0"
        }`}
      >
        {/* Font Size */}
        <select
          onChange={(e) => applyStyle({ ["font-size"]: `${e.target.value}px` })}
          defaultValue=""
        >
          <option disabled value="">
            Font Size
          </option>
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>

        {/* Font Family */}
        <select
          onChange={(e) =>
            applyStyle({
              ["font-family"]: `${e.target.value}`,
            })
          }
          defaultValue=""
        >
          <option disabled value="">
            Font Family
          </option>
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        {/* Font Color */}
        <input
          type="color"
          onChange={(e) => applyStyle({ color: e.target.value })}
        />

        {/* Bold */}
        <button
          className="bg-gray-200 rounded-sm p-1 cursor-pointer hover:bg-gray-300"
          onClick={() =>
            applyStyle({
              ["font-weight"]: "bold",
            })
          }
        >
          <Bold size={16} />
        </button>

        {/* Italic */}
        <button
          className="bg-gray-200 rounded-sm p-1 cursor-pointer hover:bg-gray-300"
          onClick={() =>
            applyStyle({
              ["font-style"]: "italic",
            })
          }
        >
          <Italic size={16} />
        </button>

        {/* Underline */}
        <button
          className="bg-gray-200 rounded-sm p-1 cursor-pointer hover:bg-gray-300"
          onClick={() =>
            applyStyle({
              ["text-decoration"]: "underline",
            })
          }
        >
          <Underline size={18} />
        </button>

        {/* Bold - Using default method */}
        {/* <button onClick={() => toggleFormat("bold")}>
          <b>B</b>
        </button> */}
      </div>
    </div>
  );
};
