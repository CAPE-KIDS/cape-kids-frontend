import { TextBlockData } from "@/modules/media/types";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { getAbsoluteSize, getRelativeSize } from "@/utils/functions";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect, useRef } from "react";

const InitialDataPlugin = ({ data }: { data: TextBlockData }) => {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);
  const { screen } = useEditorStore();

  useEffect(() => {
    console.log(screen);
    if (!data || hasInitialized.current) return;
    hasInitialized.current = true;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      const paragraph = $createParagraphNode();
      console.log("data", data);
      const textNode = $createTextNode(data.text || "");
      const fontSize = getAbsoluteSize(data.fontSize, screen?.width) || 16;

      const styles = [
        `color: ${data.color || "#000"}`,
        `font-size: ${fontSize}px`,
        `font-family: ${data.fontFamily || "Inter"}`,
        `font-weight: ${data.fontWeight || "normal"}`,
        `font-style: ${data.fontStyle || "normal"}`,
        `text-decoration: ${data.textDecoration || "none"}`,
        `text-align: ${data.textAlign || "left"}`,
      ].join("; ");
      textNode.setStyle(styles);

      paragraph.append(textNode);
      root.append(paragraph);
    });
  }, [editor, data]);

  return null;
};

export default InitialDataPlugin;
