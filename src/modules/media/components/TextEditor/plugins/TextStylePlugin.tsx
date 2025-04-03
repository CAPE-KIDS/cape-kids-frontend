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

export interface StringStyle {
  [key: string]: string;
}

export const FORMAT_TEXT_STYLE_COMMAND: LexicalCommand<
  Partial<StringStyle | CSSStyleDeclaration>
> = createCommand();

export const TextStylePlugin = () => {
  const { resetTool } = useEditorStore();
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    resetTool();
    editor.focus();

    return editor.registerCommand(
      FORMAT_TEXT_STYLE_COMMAND,
      (styles) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            if (node instanceof TextNode) {
              const styleMap = Object.entries(styles)
                .map(([k, v]) => `${k}:${v}`)
                .join(";");
              const dom = editor.getElementByKey(node.getKey());

              if (dom) {
                const style = dom.style;
                Object.entries(styles).forEach(([key, value]) => {
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
