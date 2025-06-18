import { create } from "zustand";
import { API } from "@/utils/api";
import {
  researcherMetadataSchema,
  ResearcherMetadataSchemaType,
} from "@shared/user";
import { toast } from "sonner";
import { RestResponseSchemaType } from "@shared/apiResponse";
import { useAuthStore } from "../auth/useAuthStore";
import { useExperimentsStore } from "../experiments/experimentsStore";
import { z } from "zod";

export type FormatedScientistsType = {
  id: string;
  name: string;
  email: string;
  institution?: string;
  department?: string;
  isInExperiment: boolean;
  isOwner: boolean;
};

export const researcherSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  profile: z.object({
    fullName: z.string().nonempty(),
    profileType: z.enum(["researcher"]),
    metadata: z.object({
      researcher: researcherMetadataSchema,
    }),
  }),
});
export type ResearcherSchemaType = z.infer<typeof researcherSchema>;

interface ScientistState {
  scientists: ResearcherSchemaType[];
  setScientists: (scientists: ResearcherSchemaType[]) => void;
  getScientists: () => Promise<RestResponseSchemaType>;
  formatScientists: (
    scientists: ResearcherSchemaType[]
  ) => FormatedScientistsType[];
  formatScientistsInExperiment: (data: any[]) => FormatedScientistsType[];
  addScientistToExperiment: (
    experimentId: string,
    userId: string
  ) => Promise<RestResponseSchemaType>;
  removeScientist: (
    experimentId: string,
    scientistId: string
  ) => Promise<RestResponseSchemaType>;
}
export const useScientistsStore = create<ScientistState>((set, get) => ({
  scientists: [],
  setScientists: (scientists) => {
    set({ scientists });
  },
  getScientists: async () => {
    const { authState } = useAuthStore.getState();

    if (!authState.token) return;

    const request = await fetch(API.GET_SCIENTISTS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authState.token}`,
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    if (response.error) {
      set({ scientists: [] });
      return response;
    }
    set({ scientists: response.data });
    return response;
  },
  formatScientists: (scientists) => {
    const { selectedExperimentScientists, selectedExperiment } =
      useExperimentsStore.getState();
    if (!scientists || scientists.length === 0) return [];

    const formatedScientists = scientists.map((scientist) => ({
      id: scientist.id,
      name: scientist.profile.fullName,
      email: scientist.email,
      institution: scientist.profile.metadata.researcher?.institution,
      department: scientist.profile.metadata.researcher?.department,
      isInExperiment: selectedExperimentScientists
        ? selectedExperimentScientists?.some((p) => p.user.id === scientist.id)
        : false,
      isOwner: selectedExperiment?.experiment.creator?.id === scientist.id,
    }));
    return formatedScientists;
  },
  formatScientistsInExperiment: (data) => {
    const { selectedExperimentScientists, selectedExperiment } =
      useExperimentsStore.getState();
    const formatedScientists = data.map((d: any) => {
      const scientist = d.user;

      if (!scientist) return null;

      return {
        id: scientist.id,
        name: scientist.profile.fullName,
        email: scientist.email,
        institution: scientist.profile.metadata.researcher?.institution,
        department: scientist.profile.metadata.researcher?.department,
        isInExperiment: selectedExperimentScientists.some(
          (p) => p.user.id === scientist.id
        ),
        isOwner: selectedExperiment?.experiment.creator?.id === scientist.id,
        completedAt: d.completedAt,
      };
    });
    return formatedScientists as FormatedScientistsType[];
  },
  addScientistToExperiment: async (experimentId: string, userId: string) => {
    const { authState } = useAuthStore.getState();

    const request = await fetch(API.ADD_EXPERIMENT_SCIENTIST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
      body: JSON.stringify({
        experimentId,
        userId,
      }),
    });

    const response = await request.json();
    return response;
  },
  removeScientist: async (experimentId, scientistId) => {
    const { authState } = useAuthStore.getState();
    const request = await fetch(
      API.REMOVE_SCIENTIST_FROM_EXPERIMENT(experimentId, scientistId),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = await request.json();
    return response;
  },
}));
