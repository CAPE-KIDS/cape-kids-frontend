// stores/useEditorStore.ts
import { create } from "zustand";
import { EditorState } from "@/types/editor.types";

export const useEditorStore = create<EditorState>((set, get) => ({
  currentTool: null,
  setTool: (tool) => {
    const currentTool = get().currentTool;
    if (currentTool?.type === tool?.type) {
      set({ currentTool: null });
      return null;
    }
    set({ currentTool: tool });

    return tool;
  },
  resetTool: () => {
    console.log("remove tool");
    set({ currentTool: null });
  },
  blocks: [],
  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
    })),
}));
