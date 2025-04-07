import {
  $getSelection,
  $isRangeSelection,
  TextNode,
  LexicalCommand,
  createCommand,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { MediaBlock, TextBlockData } from "@/modules/media/types";
import { getRelativeSize } from "@/utils/functions";

export interface StringStyle {
  [key: string]: string;
}

export const FORMAT_TEXT_STYLE_COMMAND: LexicalCommand<
  Partial<StringStyle | CSSStyleDeclaration>
> = createCommand();

const styleMap: { [key: string]: string } = {
  ["font-size"]: "fontSize",
  ["font-family"]: "fontFamily",
  ["color"]: "color",
  ["font-weight"]: "fontWeight",
  ["font-style"]: "fontStyle",
  ["text-decoration"]: "textDecoration",
  ["text-align"]: "textAlign",
};

export const TextStylePlugin = ({ block }: { block: MediaBlock }) => {
  const { resetTool, updateBlock, screen } = useEditorStore();
  const [editor] = useLexicalComposerContext();

  const updateBlockStyle = (key: string, value: any) => {
    if (key === "font-size") {
      const relativeSize = getRelativeSize(
        +value.replace("px", ""),
        screen.width
      );
      block.data.fontSize = relativeSize;
    } else {
      block.data[styleMap[key]] = value;
    }

    updateBlock({
      ...block,
    });
  };

  useEffect(() => {
    resetTool();

    return editor.registerCommand(
      FORMAT_TEXT_STYLE_COMMAND,
      (styles) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            if (node instanceof TextNode) {
              const dom = editor.getElementByKey(node.getKey());
              if (dom) {
                const style = dom.style;
                Object.entries(styles).forEach(([key, value]) => {
                  updateBlockStyle(key, value);
                  style.setProperty(key, value);
                });
              }
            }
          });
        });

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
};
