// stores/useEditorStore.ts
import { create } from "zustand";
import { EditorState } from "@/types/editor.types";

export const useEditorStore = create<EditorState>((set, get) => ({
  screen: null,
  setEditorContainer: (screenData) => {
    set({
      screen: { ...screenData },
    });
  },
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
    set({ currentTool: null });
  },
  blocks: [],
  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
    })),

  updateBlock: (block) => {
    set((state) => ({
      blocks: [...state.blocks.map((b) => (b.id === block.id ? block : b))],
    }));
  },
  getRelativeSize: (px: number, total: number) => {
    return (px / total) * 100;
  },

  getAbsoluteSize: (px: number, total: number) => {
    return (px * total) / 100;
  },
}));
