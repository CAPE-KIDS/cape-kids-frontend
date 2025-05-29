// components/TextEditor/TextEditor.tsx

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TextStylePlugin } from "./plugins/TextStylePlugin";
import { TextToolbar } from "./TextToolbar";
import InitialDataPlugin from "./plugins/InitialDataPlugin";
import { MediaBlock } from "@/modules/media/types";
import { OnChangeDebounce } from "./hooks/OnChangeDebounce";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { DoubleClickToEditPlugin } from "./plugins/DoubleClickToEditPlugin";
import { useRef } from "react";

type Props = {
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
  onChange?: (html: string, text: string) => void;
  block: MediaBlock;
};

export const TextEditor = ({
  isEditable,
  setIsEditable,
  onChange,
  block,
}: Props) => {
  const editorConfig = {
    namespace: "TextEditor",
    nodes: [],
    theme: {
      text: {},
    },
    onError: (error: any) => console.error(error),
  };

  const editorWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        ref={editorWrapperRef}
        className={`flex flex-col w-full h-full ${
          isEditable ? "" : "select-none"
        }
        `}
      >
        <TextToolbar />
        <div className="flex-1 p-1 rounded relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`outline-none w-full h-full leading-none ${
                  isEditable ? "" : "pointer-events-none select-none"
                }`}
              />
            }
            placeholder={
              <span className="text-xs font-light left-1 top-1 absolute">
                Double-click to edit
              </span>
            }
          />
          <HistoryPlugin />
          <InitialDataPlugin data={block.data} />
          <TextStylePlugin block={block} />
          <DoubleClickToEditPlugin
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            wrapperRef={editorWrapperRef}
          />
          <OnChangeDebounce
            wait={100}
            onChange={(json, plainText, htmlString) => {
              onChange && onChange(htmlString, plainText);
            }}
          />
        </div>
      </div>
    </LexicalComposer>
  );
};
