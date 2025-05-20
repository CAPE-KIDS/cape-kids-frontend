import { create } from "zustand";
import { API } from "@/utils/api";
import { ParticipantSchemaType } from "@shared/user";
import { toast } from "sonner";
import { RestResponseSchemaType } from "@shared/apiResponse";
import { useAuthStore } from "../auth/useAuthStore";
import { useExperimentsStore } from "../experiments/experimentsStore";

export type FormatedParticipantsType = {
  id: string;
  name: string;
  age: number;
  gender: string;
  nativeLanguage: string | undefined;
  isInExperiment: boolean;
};

interface ParticipanteState {
  participants: ParticipantSchemaType[];
  setParticipants: (participants: ParticipantSchemaType[]) => void;
  getParticipants: () => Promise<RestResponseSchemaType>;
  formatParticipants: (
    participants: ParticipantSchemaType[]
  ) => FormatedParticipantsType[];
  removeParticipant: (
    experimentId: string,
    participantId: string
  ) => Promise<RestResponseSchemaType>;
}
export const useParticipantsStore = create<ParticipanteState>((set, get) => ({
  participants: [],
  setParticipants: (participants: ParticipantSchemaType[]) => {
    set({ participants });
  },
  getParticipants: async () => {
    const { authState } = useAuthStore.getState();

    const request = await fetch(API.GET_PARTICIPANTS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authState.token}`,
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    if (response.error) {
      set({ participants: [] });
      return response;
    }
    set({ participants: response.data });
    return response;
  },
  formatParticipants: (participants) => {
    const { selectedExperimentParticipants } = useExperimentsStore.getState();
    const formatedParticipans = participants.map((participant) => ({
      id: participant.id,
      name: participant.profile.fullName,
      age: participant.profile.metadata.participant.age,
      gender: participant.profile.metadata.participant.gender,
      nativeLanguage: participant.profile.metadata.participant.nativeLanguage,
      isInExperiment: selectedExperimentParticipants.some(
        (p) => p.id === participant.id
      ),
    }));
    return formatedParticipans;
  },
  removeParticipant: async (experimentId, participantId) => {
    const { authState } = useAuthStore.getState();
    const request = await fetch(
      API.REMOVE_PARTICIPANT_FROM_EXPERIMENT(experimentId, participantId),
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
