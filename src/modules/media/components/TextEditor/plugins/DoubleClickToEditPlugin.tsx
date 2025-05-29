// components/TextEditor/plugins/DoubleClickToEditPlugin.tsx

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

type Props = {
  isEditable: boolean;
  setIsEditable: (editable: boolean) => void;
  wrapperRef: React.RefObject<HTMLElement | null>;
};

export function DoubleClickToEditPlugin({
  isEditable,
  setIsEditable,
  wrapperRef,
}: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const wrapper = wrapperRef?.current;
    if (!wrapper) return;

    function handleDoubleClick() {
      setIsEditable(true);
      setTimeout(() => {
        editor.focus();
      }, 0);
    }

    function handleBlur(event: FocusEvent) {
      if (!wrapperRef.current?.contains(event.relatedTarget as Node)) {
        setIsEditable(false);
        editor.blur();
      }
    }

    wrapper.addEventListener("dblclick", handleDoubleClick);
    wrapper.addEventListener("focusout", handleBlur);

    return () => {
      wrapper.removeEventListener("dblclick", handleDoubleClick);
      wrapper.removeEventListener("focusout", handleBlur);
    };
  }, [editor, setIsEditable, wrapperRef]);

  return null;
}
