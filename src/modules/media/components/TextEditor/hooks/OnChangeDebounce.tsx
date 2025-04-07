import { $getRoot } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useRef } from "react";

const CAN_USE_DOM =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

const useLayoutEffectImpl = CAN_USE_DOM
  ? React.useLayoutEffect
  : React.useEffect;

const useLayoutEffect = useLayoutEffectImpl;

type OnChangeFunction = (editorStateJson: string, editorText: string) => void;

export const OnChangeDebounce: React.FC<{
  ignoreInitialChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange: OnChangeFunction;
  wait?: number;
}> = ({
  ignoreInitialChange = true,
  ignoreSelectionChange = false,
  onChange,
  wait = 167,
}) => {
  const [editor] = useLexicalComposerContext();
  const timerId = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    const unsubscribe = editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves, prevEditorState }) => {
        if (
          ignoreSelectionChange &&
          dirtyElements.size === 0 &&
          dirtyLeaves.size === 0
        ) {
          return;
        }

        if (ignoreInitialChange && prevEditorState.isEmpty()) {
          return;
        }

        if (timerId.current) clearTimeout(timerId.current);

        timerId.current = setTimeout(() => {
          editorState.read(() => {
            const root = $getRoot();
            onChange(JSON.stringify(editorState), root.getTextContent());
          });
        }, wait);
      }
    );

    return () => {
      unsubscribe();
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [editor, ignoreInitialChange, ignoreSelectionChange, onChange, wait]);

  return null;
};
