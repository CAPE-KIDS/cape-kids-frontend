// components/TextEditor/TextEditor.tsx

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TextStylePlugin } from "./plugins/TextStylePlugin";
import { TextToolbar } from "./TextToolbar";
import InitialDataPlugin from "./plugins/InitialDataPlugin";
import { MediaBlock, TextBlockData } from "@/modules/media/types";
import { OnChangeDebounce } from "./hooks/OnChangeDebounce";

export const TextEditor = ({
  onChange,
  block,
}: {
  onChange?: (html: string, text: string) => void;
  block: MediaBlock;
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
              <ContentEditable className="outline-none w-full h-full leading-none" />
            }
            placeholder={null}
          />
          <HistoryPlugin />
          <InitialDataPlugin data={block.data} />
          <TextStylePlugin block={block} />
          <OnChangeDebounce
            wait={500}
            onChange={(json, plainText, htmlString) => {
              onChange && onChange(htmlString, plainText);
            }}
          />
        </div>
      </div>
    </LexicalComposer>
  );
};
