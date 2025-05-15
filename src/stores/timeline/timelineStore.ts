import { StepColors, StepConnection } from "@/modules/timeline/types";
import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";
import { API } from "@/utils/api";
import {
  ExperimentSchemaType,
  ExperimentSchemaWithTimelineType,
} from "@shared/experiments";
import { TrainingSchemaType } from "@shared/training";
import { TaskSchemaType } from "@shared/task";
import { TimelineStep } from "@shared/timeline";
import { RestResponseSchemaType } from "@shared/apiResponse";
import _ from "lodash";
import { useAuthStore } from "../auth/useAuthStore";
import { StepConnectionSchemaType } from "@shared/stepConnections";

type SourceDataType = ExperimentSchemaWithTimelineType | null;
interface TimelineState {
  sourceData: SourceDataType;
  steps: TimelineStep[];
  connections: StepConnectionSchemaType[];
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: string | null;
  setTimelineData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  formatToTimeline: (data?: SourceDataType) => Promise<void>;
  updateSteps: (updatedStep: TimelineStep) => void;
  removeStep: (stepId: string) => void;
  formatNodes: () => Node[];
  formatedEdges: () => Edge[];
  edgesSaved: boolean;
  setEdgesSaved: (edgesSaved: boolean) => void;
  directConnections: () => any[];
  // requests api
  saveStep: (
    step: TimelineStep,
    token: string,
    stepFiles?: Record<string, File>
  ) => Promise<RestResponseSchemaType>;

  saveConnections: () => void;

  resetTimeline: () => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  sourceData: null,
  steps: [],
  connections: [],
  nodes: [],
  edges: [],
  loading: true,
  error: null,
  edgesSaved: false,
  setEdgesSaved: (edgesSaved) => set({ edgesSaved }),

  setTimelineData: (data) => set({ sourceData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  formatToTimeline: async (data) => {
    set({ loading: true, error: null });
    const formatedSourceData = {
      ...(data?.experiment as ExperimentSchemaType),
      timeline: data.timeline,
      connections: data.connections,
    };

    set({ sourceData: formatedSourceData });
    set({ steps: formatedSourceData?.timeline?.steps || [] });
    set({ connections: formatedSourceData?.timeline?.step_connections || [] });

    get().formatNodes();
    get().formatedEdges();
    set({ loading: false });
  },

  updateSteps: (updatedStep) => {
    const { steps, connections, saveConnections } = get();

    const isNewStep = !steps.some((step) => step.id === updatedStep.id);
    const updatedSteps = [
      ...steps.filter((step) => step.id !== updatedStep.id),
      updatedStep,
    ];

    let updatedConnections = [...connections];

    if (isNewStep && steps.length > 0) {
      const lastStep = steps[steps.length - 1];
      const newConnection = {
        timelineId: updatedStep.timeline.id,
        fromStepId: lastStep.id || "",
        toStepId: updatedStep.id || "",
        condition: "",
        id: crypto.randomUUID(),
      };
      updatedConnections.push(newConnection);
    }

    set({
      steps: updatedSteps,
      connections: updatedConnections,
    });

    get().formatNodes();
    get().formatedEdges();
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

  formatNodes: () => {
    const { steps } = get();
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
      } as Node;
    });

    set({
      nodes: [...formatedNodes],
    });
    return formatedNodes;
  },

  directConnections: () => {
    const { sourceData } = get();

    if (!sourceData) return [];
    const order = [] as any[];
    sourceData.timeline.steps?.forEach((step: TimelineStep, index) => {
      if (index === sourceData.timeline.steps.length - 1) return;
      const object = {
        id: crypto.randomUUID(),
        timelineId: sourceData.timeline.id,
        fromStepId: step.id,
        toStepId: sourceData?.timeline?.steps[index + 1]?.id,
        condition: "",
      };
      order.push(object);
    });
    set({ connections: order });
    return order;
  },

  formatedEdges: () => {
    const {
      connections,
      directConnections,
      saveConnections,
      edgesSaved,
      setEdgesSaved,
    } = get();

    let isToSave = false;
    let connectionsToUse = connections;
    if (connectionsToUse.length > 0) {
      setEdgesSaved(true);
      isToSave = false;
    }

    if (!connectionsToUse || connectionsToUse.length === 0) {
      connectionsToUse = directConnections();
      isToSave = true;
    }

    const formatedEdges = connectionsToUse.map((connection) => {
      return {
        id: connection.id,
        source: connection.fromStepId,
        target: connection.toStepId,
        type: "custom", // related to the CustomEdge component not to the type of step
      };
    });

    set({ edges: formatedEdges });

    if (!edgesSaved && isToSave) {
      const response = saveConnections();
      if (!response.error) {
        setEdgesSaved(true);
      }
    }
    return formatedEdges;
  },

  // requests api

  saveStep: async (step, token, stepFiles) => {
    const formData = new FormData();

    const blocks = step.metadata.blocks?.map((block) => {
      const tmpId = block.id;
      const hasFile = stepFiles && stepFiles[tmpId];

      return {
        ...block,
        data: hasFile ? { fileField: `files[${tmpId}]` } : block.data,
      };
    });

    let updatedGroup = step.metadata.group;
    if (step.metadata.group?.steps?.length) {
      const updatedGroupSteps = step.metadata.group.steps.map((groupStep) => {
        const updatedBlocks = groupStep.metadata.blocks?.map((block) => {
          const tmpId = block.id;
          const hasFile = stepFiles && stepFiles[tmpId];

          return {
            ...block,
            data: hasFile ? { fileField: `files[${tmpId}]` } : block.data,
          };
        });

        return {
          ...groupStep,
          metadata: {
            ...groupStep.metadata,
            blocks: updatedBlocks,
          },
        };
      });

      updatedGroup = {
        ...step.metadata.group,
        steps: updatedGroupSteps,
      };
    }

    const stepData = {
      timelineId: step.timelineId,
      orderIndex: step.orderIndex || null,
      type: step.type,
      taskVersionId: step?.taskVersionId || null,
      metadata: {
        ...step.metadata,
        blocks,
        group: updatedGroup,
      },
    };

    formData.append("step", JSON.stringify(stepData));

    if (stepFiles && step.metadata.blocks?.length) {
      step.metadata.blocks.forEach((block) => {
        if (block.id && stepFiles[block.id]) {
          formData.append(`files[${block.id}]`, stepFiles[block.id]);
        }
      });
    }

    if (stepFiles && step.metadata.group?.steps?.length) {
      step.metadata.group.steps.forEach((groupStep) => {
        groupStep.metadata.blocks.forEach((block) => {
          if (block.id && stepFiles[block.id]) {
            formData.append(`files[${block.id}]`, stepFiles[block.id]);
          }
        });
      });
    }

    const request = await fetch(API.SAVE_STEP, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const response = await request.json();
    return response;
  },

  saveConnections: async () => {
    const { connections } = get();
    const { authState } = useAuthStore.getState();

    const request = await fetch(API.SAVE_CONNECTIONS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(connections),
    });

    const response = await request.json();
    return response;
  },

  resetTimeline: () => {
    set({
      sourceData: null,
      steps: [],
      connections: [],
      nodes: [],
      edges: [],
      loading: true,
      error: null,
      edgesSaved: false,
    });
  },
}));
