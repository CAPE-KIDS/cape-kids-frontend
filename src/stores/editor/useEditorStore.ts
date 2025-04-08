// stores/useEditorStore.ts
import { create } from "zustand";
import { EditorState } from "@/types/editor.types";
import { StepType, TimelineStep } from "@/modules/timeline/types";
import _ from "lodash";

export const useEditorStore = create<EditorState>((set, get) => ({
  isUpdating: false,
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
  updateBlock: (updatedBlock) => {
    set((state) => {
      const existingBlock = state.blocks.find((b) => b.id === updatedBlock.id);
      if (!existingBlock) return { blocks: state.blocks };

      const isEqual = _.isEqual(existingBlock, updatedBlock);
      if (isEqual) return { blocks: state.blocks };

      return {
        blocks: state.blocks.map((b) =>
          b.id === updatedBlock.id ? updatedBlock : b
        ),
      };
    });
  },
  deleteBlock: (blockId) => {
    set((state) => {
      const existingBlock = state.blocks.find((b) => b.id === blockId);
      if (!existingBlock) return { blocks: state.blocks };

      return {
        blocks: state.blocks.filter((b) => b.id !== blockId),
      };
    });
  },

  triggers: [],
  addTrigger: (trigger) =>
    set((state) => ({
      triggers: [...state.triggers, trigger],
    })),
  updateTrigger: (updatedTrigger) => {
    set((state) => {
      const existingTrigger = state.triggers.find(
        (t) => t.id === updatedTrigger.id
      );
      if (!existingTrigger) return { triggers: state.triggers };

      const isEqual =
        JSON.stringify(existingTrigger) === JSON.stringify(updatedTrigger);
      if (isEqual) return { triggers: state.triggers };

      return {
        triggers: state.triggers.map((t) =>
          t.id === updatedTrigger.id ? updatedTrigger : t
        ),
      };
    });
  },
  mountStep: (timelineId, orderIndex, type): TimelineStep => {
    const { blocks, triggers } = get();
    const timelineStep: TimelineStep = {
      id: crypto.randomUUID(),
      timelineId,
      orderIndex,
      type,
      metadata: {
        blocks,
        triggers,
      },
    };

    return timelineStep;
  },
}));
