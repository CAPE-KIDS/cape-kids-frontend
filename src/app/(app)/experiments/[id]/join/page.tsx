"use client";
import PageHeader from "@/components/PageHeader";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ExperimentParticipantJoin = () => {
  const params = useParams();
  const experimentId = params.id as string;
  const {
    experiments,
    getExperimentById,
    setSelectedExperiment,
    selectedExperiment,
    joinExperiment,
  } = useExperimentsStore();
  const { authState } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const fetchExperiment = async () => {
    const experiment = await getExperimentById(experimentId);
    if (experiment) {
      setSelectedExperiment(experiment.data);
    }
  };

  useEffect(() => {
    if (!authState.token) return;
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

  const handleJoin = async () => {
    if (!authState.user?.id) return;

    if (accessCode === selectedExperiment?.experiment.accessCode) {
      const response = await joinExperiment(
        experimentId,
        authState.user.id,
        accessCode
      );

      if (response.error) {
        toast.error(response.message);
        setAuthorized(false);
        return;
      }

      toast.success("You have joined the experiment successfully");
      setAuthorized(true);
      return;
    }

    toast.error("Invalid access code");
    setAuthorized(false);
    setAccessCode("");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <PageHeader
        title="Joining Experiment"
        subtitle="You can join the experiment using the access code"
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

      {authorized ? (
        <div className="px-6 py-4">
          <p>You have successfully joined.</p>
          <p>You can close this tab.</p>
        </div>
      ) : (
        <div className="px-6 py-4">
          <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
            <span className="text-blue-700">Experiment:</span>{" "}
            {selectedExperiment?.experiment.title}
          </div>
          <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
            <span className="text-blue-700">Description:</span>{" "}
            {selectedExperiment?.experiment.description}
          </div>
          <div className="max-w-[900px] w-full ">
            <p className="mb-2">To join the experiment type the access code </p>
            <input
              className="bg-[#EBEFFF] border border-blue-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="XXXX-XXXX-XXXX"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleJoin}
              className="mt-4 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200"
            >
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentParticipantJoin;
