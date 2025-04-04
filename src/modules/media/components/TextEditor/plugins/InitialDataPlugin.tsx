import { TextBlockData } from "@/types/media.types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import React, { useEffect } from "react";

const InitialDataPlugin = ({ data }: { data: TextBlockData }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!data) return;
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
