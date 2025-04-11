// stores/useEditorStore.ts
import { create } from "zustand";
import { EditorState } from "@/types/editor.types";
import { TimelineStep } from "@/modules/timeline/types";
import _ from "lodash";

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
  addStep: (block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
    })),
  updateStep: (updatedBlock) => {
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
  calculateRenderPosititon: (steps) => {
    if (steps.length === 0 || !steps) {
      return {
        index: 1,
        x: 0,
        y: 0,
      };
    }

    const index = Math.max(...steps.map((step) => step.orderIndex));

    const indexValue = index + 1;

    if (indexValue === 2) {
      return {
        index: indexValue,
        x: 0,
        y: 150,
      };
    }

    const yPosition = steps.reduce((acc, step) => {
      const stepY = step.metadata.positionY || 0;
      if (stepY > acc) {
        return stepY + 150;
      }
      return acc;
    }, 0);

    return {
      index: indexValue,
      x: 0,
      y: yPosition,
    };
  },
  mountStep: (timelineId, positions, type, title): TimelineStep => {
    const { blocks, triggers } = get();
    const timelineStep: TimelineStep = {
      id: crypto.randomUUID(),
      timelineId,
      orderIndex: positions.index,
      type,
      metadata: {
        title,
        blocks,
        triggers,
        positionX: positions.x,
        positionY: positions.y,
      },
    };

    return timelineStep;
  },
  clearEditor: () => {
    set({
      currentTool: null,
      blocks: [],
      triggers: [],
    });
  },
}));
