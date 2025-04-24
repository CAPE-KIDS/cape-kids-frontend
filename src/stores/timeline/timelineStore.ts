import {
  StepColors,
  StepConnection,
  TimelineStep,
} from "@/modules/timeline/types";
import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";
import { update } from "lodash";

export type StatusType = "draft" | "active" | "closed" | "archived";

export interface Experiment {
  id: string;
  creatorId: string;
  status: StatusType;
  title: string;
  description: string;
  participantTarget: number;
  allowExtraParticipants: boolean;
  accessCode: string;
  timeline: {
    id: string;
    steps: TimelineStep[];
    connections: StepConnection[];
  };
}

export interface Training {
  id: string;
  scientistId: string;
  title: string;
  description: string;
  status: StatusType;
  sessionsLimit: number | null;
  accessCode: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  isTemplate: boolean;
}

interface TimelineState {
  sourceData: Experiment | Task | Training | null;
  steps: TimelineStep[];
  connections: StepConnection[];
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: string | null;
  setTimelineData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getExperimentById: (id: string) => Promise<Experiment>;
  getExperimentData: (id: string) => Promise<void>;
  updateSteps: (updatedStep: TimelineStep) => void;
  removeStep: (stepId: string) => void;
  formatNodeAndEdgeData: () => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  sourceData: null,
  steps: [],
  connections: [],
  nodes: [],
  edges: [],
  loading: true,
  error: null,

  setTimelineData: (data) => set({ sourceData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getExperimentById: async (id: string) => {
    return {
      id,
      title: "Relationship between sports and executive function",
      description:
        "This experiment aims to investigate the relationship between sports and executive function.",
      creatorId: "1234-5678-9101",
      status: "draft",
      participantTarget: 100,
      allowExtraParticipants: true,
      accessCode: "5FRS-V4VQ-CHFE",
      timeline: {
        id: "1234-5678-9101",
        steps: [],
        connections: [],
      },
    };
  },

  getExperimentData: async (id: string) => {
    set({ loading: true, error: null });

    const experiment = await get().getExperimentById(id);
    const sourceData = experiment.timeline;

    set({ sourceData: experiment });
    set({ steps: sourceData.steps || [] });
    set({ connections: sourceData.connections || [] });

    get().formatNodeAndEdgeData();
    set({ loading: false });
  },

  updateSteps: (updatedStep: TimelineStep) => {
    const { steps, connections } = get();

    const isNewStep = !steps.some((step) => step.id === updatedStep.id);
    const updatedSteps = [
      ...steps.filter((step) => step.id !== updatedStep.id),
      updatedStep,
    ];

    let updatedConnections = [...connections];

    if (isNewStep && steps.length > 0) {
      const lastStep = steps[steps.length - 1];

      updatedConnections.push({
        id: `${lastStep.id}-${updatedStep.id}`,
        fromStepId: lastStep.id,
        toStepId: updatedStep.id,
        condition: "",
      });
    }

    set({
      steps: updatedSteps,
      connections: updatedConnections,
    });

    get().formatNodeAndEdgeData();
  },

  removeStep: (stepId: string) => {
    const { steps, connections } = get();
    const updatedSteps = steps.filter((step) => step.id !== stepId);

    const updatedConnections = connections.filter(
      (conn) => conn.fromStepId !== stepId && conn.toStepId !== stepId
    );

    set({
      steps: updatedSteps,
      connections: updatedConnections,
    });

    get().formatNodeAndEdgeData();
  },

  updateConnections: () => {
    const { steps, connections } = get();
    if (steps.length === 1) {
      set({ connections: [] });
      return;
    }

    if (steps.length === 2) {
      const connection = {
        id: "1",
        fromStepId: `${steps[0].orderIndex}`,
        toStepId: `${steps[1].orderIndex}`,
        condition: "",
      } as StepConnection;

      set({ connections: [connection] });
      return;
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
          stepData: step,
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
      nodes: [...formatedNodes],
      edges: [...formatedEdges],
    });
  },
}));
