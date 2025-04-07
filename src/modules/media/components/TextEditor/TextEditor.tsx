// components/TextEditor/TextEditor.tsx

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TextStylePlugin } from "./plugins/TextStylePlugin";
import { TextToolbar } from "./TextToolbar";
import InitialDataPlugin from "./plugins/InitialDataPlugin";
import { TextBlockData } from "@/modules/media/types";
import { $getRoot } from "lexical";
import { debounce } from "lodash";
import { OnChangeDebounce } from "./hooks/OnChangeDebounce";

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
          <OnChangeDebounce
            wait={500}
            onChange={(json, plainText) => {
              onChange && onChange(plainText);
            }}
          />
        </div>
      </div>
    </LexicalComposer>
  );
};
