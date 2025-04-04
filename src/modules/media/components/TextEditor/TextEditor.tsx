// components/TextEditor/TextEditor.tsx

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TextStylePlugin } from "./plugins/TextStylePlugin";
import { TextToolbar } from "./TextToolbar";
import InitialDataPlugin from "./plugins/InitialDataPlugin";
import { TextBlockData } from "@/types/media.types";

export const TextEditor = ({
  onChange,
  data,
}: {
  onChange?: (value: string) => void;
  data: TextBlockData;
}) => {
  const editorConfig = {
    namespace: "TextEditor",
    nodes: [],
    theme: {
      text: {},
    },
    onError: (error: any) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="flex flex-col w-full h-full">
        <TextToolbar />
        <div className="flex-1 p-1 rounded ">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none w-full h-full" />
            }
            placeholder={null}
          />
          <HistoryPlugin />
          <InitialDataPlugin data={data} />
          <TextStylePlugin />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const plainText = editorState.toJSON();
                onChange && onChange(JSON.stringify(plainText));
              });
            }}
          />
        </div>
      </div>
    </LexicalComposer>
  );
};
