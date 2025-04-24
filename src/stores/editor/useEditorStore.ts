// stores/useEditorStore.ts
import { create } from "zustand";
import { EditorState } from "@/types/editor.types";
import { TimelineStep } from "@/modules/timeline/types";
import _ from "lodash";
import { MediaBlock } from "@/modules/media/types";
import { Trigger } from "@/modules/triggers/types";

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
  addScreenBlock: () => {
    const { blocks } = get();
    const existingScreenBlock = blocks.find((block) => block.type === "screen");
    if (existingScreenBlock) return;

    const screenBlock = {
      id: crypto.randomUUID(),
      type: "screen",
      data: null,
    } as MediaBlock;

    set((state) => ({
      blocks: [...state.blocks, screenBlock],
    }));
  },
  getTriggersForBlock: (blockId: string) => {
    const block = get().blocks.find((b) => b.id === blockId);
    return block?.triggers || [];
  },
  addTriggerToBlock: (blockIdOrNull: string | null, trigger: Trigger) => {
    set((state) => {
      const blocks = state.blocks;
      const targetBlockId =
        blockIdOrNull ?? blocks.find((b) => b.type === "screen")?.id;

      if (!targetBlockId) return {};

      const block = blocks.find((b) => b.id === targetBlockId);
      if (!block) return {};

      const updatedBlock = {
        ...block,
        triggers: [...(block.triggers || []), trigger],
      };

      return {
        blocks: blocks.map((b) => (b.id === targetBlockId ? updatedBlock : b)),
      };
    });
  },

  getAllTriggers: () => {
    const { blocks } = get();
    return blocks.flatMap((b) =>
      (b.triggers || []).map((trigger) => ({
        ...trigger,
        blockId: b.id,
        blockLabel: b.type === "screen" ? "Screen" : `${b.type} Media`,
        blockData: b.data?.text || "",
      }))
    );
  },
  removeTriggerFromBlock: (blockId, triggerId) => {
    set((state) => {
      const block = state.blocks.find((b) => b.id === blockId);
      if (!block) return {};

      const updatedTriggers = (block.triggers || []).filter(
        (t) => t.id !== triggerId
      );

      const updatedBlock = { ...block, triggers: updatedTriggers };

      return {
        blocks: state.blocks.map((b) => (b.id === blockId ? updatedBlock : b)),
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
    const { blocks } = get();
    const timelineStep: TimelineStep = {
      id: crypto.randomUUID(),
      timelineId,
      orderIndex: positions.index,
      type,
      metadata: {
        title,
        blocks,
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
    });
  },
}));
