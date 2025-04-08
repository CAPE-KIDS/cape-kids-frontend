import { TextBlockData } from "@/modules/media/types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import React, { useEffect, useRef } from "react";

const InitialDataPlugin = ({ data }: { data: TextBlockData }) => {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!data || hasInitialized.current) return;

    hasInitialized.current = true;
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        selection.insertText(data.text);
      }
    });
  }, [editor, data]);

  return null;
};

export default InitialDataPlugin;
