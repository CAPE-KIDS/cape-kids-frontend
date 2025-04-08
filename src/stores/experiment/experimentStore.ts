import {
  StepColors,
  StepConnection,
  TimelineStep,
} from "@/modules/timeline/types";
import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";

type ExperimentData = {
  id: string;
  name: string;
  description: string;
  participantsLimit: number;
  allowExtraParticipants: boolean;
  accessCode: string;
};

interface ExperimentState {
  experimentData: ExperimentData | null;
  steps: TimelineStep[];
  connections: StepConnection[];
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: string | null;
  setExperimentData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getExperimentById: (id: string) => Promise<void>;
  formatNodeAndEdgeData: () => void;
}

export const useExperimentStore = create<ExperimentState>((set, get) => ({
  experimentData: null,
  steps: [],
  connections: [],
  nodes: [],
  edges: [],
  loading: false,
  error: null,

  setExperimentData: (data) => set({ experimentData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getExperimentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const experiment = {
        id,
        name: "Relationship between sports and executive function",
        description:
          "This experiment aims to investigate the relationship between sports and executive function.",
        participantsLimit: 100,
        allowExtraParticipants: true,
        accessCode: "5FRS-V4VQ-CHFE",
      };

      const steps: TimelineStep[] = [
        {
          id: "1",
          timelineId: "tl-1",
          orderIndex: 1,
          type: "start",
          metadata: { title: "Introduction", positionX: 0, positionY: 0 },
        },
        {
          id: "2",
          timelineId: "tl-1",
          orderIndex: 2,
          type: "task",
          metadata: { title: "Flanker task v1", positionX: 0, positionY: 150 },
        },
        {
          id: "3",
          timelineId: "tl-1",
          orderIndex: 3,
          type: "custom_block",
          metadata: { title: "Message", positionX: 0, positionY: 300 },
        },
        {
          id: "4",
          timelineId: "tl-1",
          orderIndex: 4,
          type: "end",
          metadata: { title: "Last screen", positionX: 0, positionY: 450 },
        },
      ];

      const connections: StepConnection[] = [
        { id: "e1-2", fromStepId: "1", toStepId: "2", condition: null },
        { id: "e2-3", fromStepId: "2", toStepId: "3", condition: null },
        { id: "e3-4", fromStepId: "3", toStepId: "4", condition: null },
      ];

      set({
        experimentData: experiment,
        steps,
        connections,
        loading: false,
      });

      get().formatNodeAndEdgeData();
    } catch (err: any) {
      set({ error: "Failed to fetch experiment data", loading: false });
    }
  },

  formatNodeAndEdgeData: () => {
    const { steps, connections } = get();
    const formatedNodes = steps.map((step, index) => {
      const stepType = step.type;

      return {
        id: step.id,
        type: "custom", // related to the CustomNode component not to the type of step
        position: {
          x: step.metadata.positionX,
          y: step.metadata.positionY,
        },
        data: {
          label: step.metadata.title,
          step: step.orderIndex,
          type: stepType,
        },
        style: {
          background: StepColors[stepType].background,
          color: StepColors[stepType].color,
          borderRadius: 8,
        },
      };
    });

    const formatedEdges = connections.map((connection) => {
      return {
        id: connection.id,
        source: connection.fromStepId,
        target: connection.toStepId,
        type: "custom", // related to the CustomEdge component not to the type of step
      };
    });

    set({
      nodes: formatedNodes,
      edges: formatedEdges,
    });
  },
}));
