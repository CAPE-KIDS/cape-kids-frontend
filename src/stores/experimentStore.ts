import { create } from "zustand";

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
  loading: boolean;
  error: string | null;
  setExperimentData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getExperimentById: (id: string) => Promise<void>;
}

export const useExperimentStore = create<ExperimentState>((set) => ({
  experimentData: null,
  loading: false,
  error: null,
  setExperimentData: (data) => set({ experimentData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getExperimentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = {
        id,
        name: "Relationship between sports and executive function",
        description:
          "This experiment aims to investigate the relationship between sports and executive function.",
        participantsLimit: 100,
        allowExtraParticipants: true,
        accessCode: "5FRS-V4VQ-CHFE",
      };
      set({ experimentData: data, loading: false });
    } catch (err: any) {
      set({ error: "Failed to fetch experiment data", loading: false });
    }
  },
}));
