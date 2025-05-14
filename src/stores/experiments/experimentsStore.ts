import { create } from "zustand";
import { API } from "@/utils/api";
import { ExperimentSchemaType } from "@shared/experiments";
import { toast } from "sonner";

interface ExperimentsState {
  experiments: ExperimentSchemaType[];
  setExperiments: (experiments: ExperimentSchemaType[]) => void;
  createExperiment: (
    token: string,
    data: ExperimentSchemaType
  ) => Promise<ExperimentSchemaType | null>;
  getUserExperiments: (token: string) => Promise<ExperimentSchemaType[]>;
  getExperimentById: (
    id: string,
    token: string
  ) => Promise<ExperimentSchemaType>;
  selectedExperiment: ExperimentSchemaType | null;
  setSelectedExperiment: (experiment: ExperimentSchemaType | null) => void;
  clearExperiments: () => void;
}
export const useExperimentsStore = create<ExperimentsState>((set, get) => ({
  experiments: [],
  setExperiments: (experiments: ExperimentSchemaType[]) => {
    set({ experiments });
  },
  selectedExperiment: null,
  setSelectedExperiment: (experiment: ExperimentSchemaType | null) => {
    set({ selectedExperiment: experiment });
  },
  createExperiment: async (
    token: string,
    data: ExperimentSchemaType
  ): Promise<ExperimentSchemaType | null> => {
    const request = await fetch(API.CREATE_EXPERIMENT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.error) {
      set({ selectedExperiment: null });
      return response;
    }
    set({ selectedExperiment: response.data });
    set({ experiments: [...get().experiments, response.data] });
    return response;
  },
  getUserExperiments: async (token: string) => {
    const { experiments } = get();
    if (experiments.length > 0) return experiments;

    try {
      const request = await fetch(API.GET_USER_EXPERIMENTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await request.json();

      if (response.error) {
        set({ experiments: [] });
        return experiments;
      }
      set({ experiments: response.data });
      return response.data;
    } catch (error) {
      set({ experiments: [] });
      toast.error("Error fetching experiments");
      return [];
    }
  },

  getExperimentById: async (id: string, token: string) => {
    const request = await fetch(`${API.EXPERIMENT_BY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await request.json();
    return response;
  },
  clearExperiments: () => set({ experiments: [], selectedExperiment: null }),
}));
