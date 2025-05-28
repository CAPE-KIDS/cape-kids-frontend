"use client";
import PageHeader from "@/components/PageHeader";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/DataTable";
import SectionHeader from "@/components/SectionHeader";
import ParticipantModal from "@/components/modals/ParticipantModal";
import {
  FormatedParticipantsType,
  useParticipantsStore,
} from "@/stores/participants/participantsStore";

const ExperimentParticipants = () => {
  const params = useParams();
  const experimentId = params.id as string;
  const {
    experiments,
    getExperimentById,
    setSelectedExperiment,
    selectedExperiment,
    getExperimentParticipants,
  } = useExperimentsStore();
  const { getParticipants, formatParticipants, removeParticipant } =
    useParticipantsStore();
  const { authState } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<FormatedParticipantsType[] | []>([]);

  const fetchExperiment = async () => {
    const experiment = await getExperimentById(experimentId);
    if (experiment) {
      setSelectedExperiment(experiment.data);
    }
  };

  const fetchParticipants = async () => {
    const response = await getParticipants();
    if (response.error) {
      console.log("Error fetching participants: ", response.error);
      return;
    }
  };

  const fetchExperimentParticipants = async () => {
    const response = await getExperimentParticipants(experimentId);
    if (response.error) {
      console.log("Error fetching experiment participants: ", response.error);
      return;
    }

    const formatedParticipants = formatParticipants(response.data);
    setRows(formatedParticipants);
  };

  useEffect(() => {
    if (!authState.token) return;

    fetchParticipants();
    fetchExperimentParticipants();

    const selected = experiments.find(
      (exp) => exp.experiment.id === experimentId
    );
    if (selected) {
      setSelectedExperiment(selected);
      setLoading(false);
      return;
    }

    fetchExperiment();
    setLoading(false);
    return;
  }, [experimentId, authState]);

  useEffect(() => {
    if (selectedExperiment) {
      console.log("Selected Experiment: ", selectedExperiment);
    }
  }, [selectedExperiment]);

  const editParticipant = (id: string) => {
    console.log("Edit participant with id: ", id);
  };

  const removeParticipantFromExperiment = async (id: string) => {
    const response = await removeParticipant(experimentId, id);
    if (response.error) {
      toast.error("Error removing participant from experiment");
      return;
    }

    toast.success("Participant removed from experiment");
    await fetchExperimentParticipants();
  };

  if (loading) return <div>Loading...</div>;

  const experimentUrl = `http://localhost:3001/experiments/${experimentId}/join`;

  return (
    <div>
      <PageHeader
        title="Experiment Participants"
        subtitle="Manage your experiment participants"
      >
        <div className="button">
          <Link
            className="cursor-pointer text-white rounded-lg px-4 py-3 bg-blue-600 transition duration-200"
            href={"/experiments/create"}
          >
            Create Experiment
          </Link>
        </div>
      </PageHeader>

      <div className="px-6 py-4">
        <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
          {selectedExperiment?.experiment.title}
        </div>

        <div className="flex gap-4 max-w-[900px] w-full ">
          {/* Access url */}
          <div className="flex flex-col space-y-1 flex-1 max-w-[625px]">
            <div className="flex justify-between items-center">
              <label className="font-light text-xs text-gray-400">
                Access url
              </label>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="bg-[#EBEFFF] rounded-lg p-2 flex-1 cursor-pointer select-none overflow-hidden focus:outline-none focus:ring focus:ring-blue-300  overlfow-hidden "
                tabIndex={0}
                onClick={() => {
                  navigator.clipboard.writeText(String(experimentUrl));
                  toast.success("Access url copied to clipboard");
                }}
              >
                <span className="line-clamp-1 overlfow-hidden">
                  {experimentUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(String(experimentUrl));
                  toast.success("Access url copied to clipboard");
                }}
              >
                <Copy
                  size={20}
                  className="text-gray-500 hover:text-blue-500 cursor-pointer"
                />
              </button>
            </div>
          </div>

          {/* Access code */}
          <div className="flex flex-col space-y-1 max-w-[190px]">
            <div className="flex justify-between items-center">
              <label className="font-light text-xs text-gray-400">
                Access code
              </label>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="bg-[#EBEFFF] rounded-lg p-2 flex-1 select-none truncate whitespace-nowrap overflow-hidden focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
                tabIndex={0}
                onClick={() => {
                  navigator.clipboard.writeText(
                    String(selectedExperiment?.experiment.accessCode)
                  );
                  toast.success("Access code copied to clipboard");
                }}
              >
                {selectedExperiment?.experiment.accessCode}
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    String(selectedExperiment?.experiment.accessCode)
                  );
                  toast.success("Access code copied to clipboard");
                }}
              >
                <Copy
                  size={20}
                  className="text-gray-500 hover:text-blue-500 cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-6">
        <div className="border-t border-indigo-200 my-4" />
        <div>
          <SectionHeader
            title="Participants"
            actionLabel="Add Participant"
            onAction={() => setIsModalOpen(true)}
          />
        </div>
        {rows.length > 0 ? (
          <DataTable
            headers={[
              { key: "name", label: "Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender" },
              { key: "nativeLanguage", label: "Language" },
            ]}
            rows={rows}
            withQuickActions
            actions={[
              // { label: "Edit", onClick: (row) => editParticipant(row.id) },
              {
                label: "Remove",
                onClick: async (row) =>
                  await removeParticipantFromExperiment(`${row.id}`),
              },
            ]}
            onReorder={(newOrder) => console.log("Reordered: ", newOrder)}
          />
        ) : (
          <div className="flex h-full w-full">
            <p className="text-gray-500">No participants found</p>
          </div>
        )}
      </div>
      <ParticipantModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        fetchExperimentParticipants={fetchExperimentParticipants}
      />
    </div>
  );
};

export default ExperimentParticipants;
