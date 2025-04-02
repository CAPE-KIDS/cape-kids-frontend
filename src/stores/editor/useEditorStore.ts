// stores/useEditorStore.ts
import { create } from "zustand";
import { EditorState } from "@/types/editor.types";

export const useEditorStore = create<EditorState>((set, get) => ({
  currentTool: null,
  setTool: (tool) => {
    const currentTool = get().currentTool;
    if (currentTool?.type === tool?.type) {
      set({ currentTool: null });
      return;
    }
    set({ currentTool: tool });
  },
  blocks: [],
  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
    })),
}));
