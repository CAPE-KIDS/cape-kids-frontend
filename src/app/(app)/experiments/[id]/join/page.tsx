"use client";
import PageHeader from "@/components/PageHeader";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ExperimentParticipantJoin = () => {
  const { t } = useTranslation("common");
  const { t: tE } = useTranslation("experiments");
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

  const join = async () => {
    if (!authState.user?.id) return;
    const response = await joinExperiment(
      experimentId,
      authState.user.id,
      accessCode
    );

    if (response.error) {
      toast.error(t("failed_joining_experiment"));
      setAuthorized(false);
      return;
    }

    toast.success(t("sucess_joining_experiment"));
    setAuthorized(true);
    return;
  };

  const handleJoin = async () => {
    if (
      selectedExperiment?.experiment.accessCode &&
      accessCode !== selectedExperiment?.experiment.accessCode
    ) {
      toast.error(t("invalid_access_code"));
      setAuthorized(false);
      setAccessCode("");
      return;
    }

    join();
  };

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div>
      <PageHeader
        title={t("join_experiment_title")}
        subtitle={t("join_experiment_subtitle")}
      >
        <div className="button">
          <Link
            className="cursor-pointer text-white rounded-lg px-4 py-3 bg-blue-600 transition duration-200"
            href={"/experiments/create"}
          >
            {tE("create_experiment")}
          </Link>
        </div>
      </PageHeader>

      {authorized ? (
        <div className="px-6 py-4">
          <p>{t("sucessfully_joined_experiment")}</p>
          <p>{t("you_can_close_this_window")}</p>
        </div>
      ) : selectedExperiment?.experiment.accessCode ? (
        <div className="px-6 py-4">
          <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
            <span className="text-blue-700">{t("Experiment")}:</span>{" "}
            {selectedExperiment?.experiment.title}
          </div>
          <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
            <span className="text-blue-700">{t("description")}:</span>{" "}
            {selectedExperiment?.experiment.description}
          </div>
          <div className="max-w-[900px] w-full ">
            <p className="mb-2">{t("type_access_code_to_join")} </p>
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
              {t("join_experiment")}
            </button>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4">
          <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
            <span className="text-blue-700">{t("Experiment")}:</span>{" "}
            {selectedExperiment?.experiment.title}
          </div>
          <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
            <span className="text-blue-700">{t("description")}:</span>{" "}
            {selectedExperiment?.experiment.description}
          </div>

          <p className="text-lg font-medium text-gray-800 mb-4">
            {t("does_not_require_access_code")}
          </p>
          <button
            type="button"
            onClick={handleJoin}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200"
          >
            {t("join_experiment")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperimentParticipantJoin;
