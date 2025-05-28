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
import { TimelineSchemaType, TimelineStep } from "@shared/timeline";
import { RestResponseSchemaType } from "@shared/apiResponse";
import _ from "lodash";
import { useAuthStore } from "../auth/useAuthStore";
import { StepConnectionSchemaType } from "@shared/stepConnections";
import { toast } from "sonner";

let debouncedUpdate: (...args: any[]) => void;

type SourceDataType = ExperimentSchemaWithTimelineType | TaskSchemaType | null;
interface TimelineState {
  timelineId: string;
  timeline: TimelineSchemaType;
  sourceData: SourceDataType;
  steps: TimelineStep[];
  connections: StepConnectionSchemaType[];
  nodes: Node[];
  edges: Edge[];
  tasks: TaskSchemaType[];
  setTasks: (tasks: TaskSchemaType[]) => void;
  loading: boolean;
  error: string | null;
  setTimelineData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  formatToTimeline: (data?: SourceDataType) => Promise<void>;
  updateSteps: (updatedStep: TimelineStep) => void;
  removeStep: (stepId: string) => Promise<void>;
  formatNodes: () => Node[];
  formatedEdges: () => Edge[];
  edgesSaved: boolean;
  setEdgesSaved: (edgesSaved: boolean) => void;
  // requests api
  saveStep: (
    step: TimelineStep,
    token: string,
    stepFiles?: Record<string, File>
  ) => Promise<RestResponseSchemaType>;
  getTasks: () => Promise<void>;
  saveConnections: () => void;
  getTimelineBySourceId: (sourceId: string) => Promise<RestResponseSchemaType>;
  recalculateOrderFromEdges: (
    edges: Edge[],
    nodes: Node[]
  ) => { id: string; orderIndex: number }[];
  updateEdgesAndNodes: (edges: Edge[], nodes: Node[]) => void;
  resetTimeline: () => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  timelineId: "",
  timeline: {} as TimelineSchemaType,
  sourceData: null,
  steps: [],
  connections: [],
  nodes: [],
  edges: [],
  tasks: [],
  setTasks: (tasks: TaskSchemaType[]) => set({ tasks }),
  loading: true,
  error: null,
  edgesSaved: false,
  setEdgesSaved: (edgesSaved) => set({ edgesSaved }),

  setTimelineData: (data) => set({ sourceData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  formatToTimeline: async (data) => {
    set({ loading: true, error: null });
    set({ sourceData: data[Object.keys(data)[0]] });
    set({ steps: data?.timeline?.steps || [] });
    set({ connections: data?.timeline?.step_connections || [] });
    set({ timelineId: data?.timeline?.id || "" });
    set({ timeline: data?.timeline || {} });
    get().formatNodes();
    get().formatedEdges();
    set({ loading: false });

    console.log("sourceData", data);
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

  removeStep: async (stepId: string) => {
    const { steps, connections } = get();
    set({ loading: true });

    const request = await fetch(API.DELETE_STEP(stepId), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().authState.token}`,
      },
    });
    const response = await request.json();
    if (response.error) {
      toast.success(response.error);
      set({ error: response.error });
      set({ loading: false });
      return;
    }

    set({ error: null });
    set({ loading: false });
    toast.success("Step deleted successfully");
    const updatedSteps = steps.filter((step) => step.id !== stepId);

    const updatedConnections = connections.filter(
      (conn) => conn.fromStepId !== stepId && conn.toStepId !== stepId
    );

    set({
      steps: updatedSteps,
      connections: updatedConnections,
    });

    get().formatNodes();
    get().formatedEdges();
  },

  formatNodes: () => {
    const { steps } = get();

    const nodeWidth = 180;
    const nodeHeight = 100;
    const verticalSpacing = 50;
    const horizontalSpacing = 100;
    const groupSize = 3;
    const stepsOrderedByIndex = _.orderBy(steps, ["orderIndex"], ["asc"]);
    const formatedNodes = stepsOrderedByIndex.map((step, index) => {
      const groupIndex = Math.floor(index / groupSize);
      const positionInGroup = index % groupSize;

      const x = groupIndex * (nodeWidth + horizontalSpacing);
      const y = positionInGroup * (nodeHeight + verticalSpacing);

      const stepType = step.type;

      return {
        id: step.id,
        type: "custom",
        position: { x, y },
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

  formatedEdges: () => {
    const { connections, timeline } = get();
    if (!connections.length) {
      console.warn(
        "Nenhuma conexão carregada do backend. Evitando fallback automático."
      );
      set({ edges: [] });
      return [];
    }

    const formatedEdges = connections.map((connection) => ({
      id: connection.id,
      source: connection.fromStepId,
      target: connection.toStepId,
      type: "custom",
    })) as Edge[];

    set({ edges: formatedEdges });
    return formatedEdges;
  },

  // requests api

  saveStep: async (step, token, stepFiles) => {
    const { sourceData, timelineId, getTimelineBySourceId } = get();
    let timelineDataId = timelineId;
    if (!timelineDataId) {
      const response = await getTimelineBySourceId(sourceData?.id as string);
      if (response.error) {
        set({ error: response.message });
        set({ loading: false });
        return;
      }
      timelineDataId = response.data.id;
    }
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
      timelineId: timelineDataId,
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

  getTimelineBySourceId: async (sourceId: string) => {
    const request = await fetch(API.GET_TIMELINE_ID_BY_SOURCE_ID(sourceId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().authState.token}`,
      },
    });
    const response = await request.json();

    return response;
  },

  recalculateOrderFromEdges(edges: Edge[], nodes: Node[]) {
    const nodeMap = _.keyBy(nodes, "id");
    const edgesMap = _.groupBy(edges, "source");

    const visited = new Set<string>();
    const ordered: { id: string; orderIndex: number }[] = [];
    let index = 1;

    function visit(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      ordered.push({ id: nodeId, orderIndex: index++ });
      const nextEdges = edgesMap[nodeId] || [];
      nextEdges.forEach((e) => visit(e.target));
    }

    const targetIds = new Set(edges.map((e) => e.target));
    const startNodes = nodes.filter((n) => !targetIds.has(n.id));

    const nodesToVisit = startNodes.length ? startNodes : nodes;

    nodesToVisit.forEach((n) => visit(n.id));

    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        ordered.push({ id: n.id, orderIndex: index++ });
      }
    });

    return ordered;
  },

  updateEdgesAndNodes: (edges: Edge[], nodes: Node[]) => {
    if (!debouncedUpdate) {
      debouncedUpdate = _.debounce(async (edges: Edge[], nodes: Node[]) => {
        const { timelineId } = get();
        const updatedEdges = edges.map((edge) => ({
          id: edge.id.includes("xy-edge") ? null : edge.id,
          fromStepId: edge.source,
          toStepId: edge.target,
          condition: "",
        }));

        const ordered = get().recalculateOrderFromEdges(edges, nodes);

        const request = await fetch(API.UPDATE_CONNECTIONS, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timelineId,
            steps: ordered,
            connections: updatedEdges,
          }),
        });

        const response = await request.json();
        if (response.error) {
          set({ error: response.message });
          return;
        }

        set({ error: null });
      }, 100);
    }

    debouncedUpdate(edges, nodes);
  },

  getTasks: async () => {
    const { authState } = useAuthStore.getState();

    try {
      const request = await fetch(API.GET_TASKS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (!request.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const response = await request.json();
      set({ tasks: response.data || [] });
    } catch (error) {
      set({ error: error.message || "An error occurred while fetching tasks" });
    }
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
