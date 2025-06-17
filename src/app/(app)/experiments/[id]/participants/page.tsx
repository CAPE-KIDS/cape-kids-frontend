"use client";
import PageHeader from "@/components/PageHeader";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { confirm } from "@/components/confirm/confirm";
import { useTranslation } from "react-i18next";
import { exportRawJson, exportResultsToExcel } from "@/utils/functions";
import ParticipantTable from "@/components/tables/ParticipantTable";

const ExperimentParticipants = () => {
  const { t } = useTranslation("common");
  const { t: tE } = useTranslation("experiments");
  const params = useParams();
  const experimentId = params.id as string;
  const {
    experiments,
    getExperimentById,
    setSelectedExperiment,
    selectedExperiment,
    getExperimentParticipants,
    getUserExperimentResult,
  } = useExperimentsStore();
  const { getParticipants, removeParticipant, formatParticipantsInExperiment } =
    useParticipantsStore();
  const { authState } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<FormatedParticipantsType[] | []>([]);
  const [fecthingParticipants, setFecthingParticipants] = useState(false);
  const router = useRouter();

  const fetchExperiment = async () => {
    const experiment = await getExperimentById(experimentId);
    if (experiment) {
      setSelectedExperiment(experiment.data);
    }
  };

  const fetchParticipants = async () => {
    setFecthingParticipants(true);

    const response = await getParticipants();
    setFecthingParticipants(false);
    if (response?.error) {
      console.log("Error fetching participants: ", response.error);
      return;
    }
  };

  const fetchExperimentParticipants = async () => {
    if (!authState.token || !experimentId) return;
    const response = await getExperimentParticipants(experimentId);
    if (response?.error) {
      console.log("Error fetching experiment participants: ", response.error);
      return;
    }

    const formatedParticipants =
      response?.data && formatParticipantsInExperiment(response?.data);
    setRows(formatedParticipants);
  };

  useEffect(() => {
    if (!authState.token) return;

    if (authState.user?.profile.profileType === "participant") {
      router.push("/experiments");
      return;
    }

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

  const getUserResults = async (
    user: FormatedParticipantsType,
    type: string
  ) => {
    const results = await getUserExperimentResult(experimentId, user.id);
    if (results.error) {
      toast.error(t("error_fetching_results"));
      return;
    }

    if (results.data.length === 0) {
      toast.error(t("sucess_fetching_results_empty"));
      return;
    }

    if (type === "xlsx") {
      exportResultsToExcel(results.data, user);
    }
    if (type === "json") {
      exportRawJson(results.data, user);
    }
  };

  const removeParticipantFromExperiment = async (id: string) => {
    const response = await removeParticipant(experimentId, id);
    if (response.error) {
      toast.error(t("error_removing_participant"));
      return;
    }

    toast.success(t("participant_removed_from_experiment"));
    await fetchExperimentParticipants();
  };

  if (loading) return <div>{t("loading")}</div>;

  const experimentUrl = `${window?.location.origin}/experiments/${experimentId}/join`;

  return (
    <div>
      <PageHeader
        title={t("experiment_participants_title")}
        subtitle={t("experiment_participants_subtitle")}
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

      <div className="px-6 py-4">
        <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
          {selectedExperiment?.experiment.title}
        </div>

        <div className="flex gap-4 max-w-[900px] w-full ">
          {/* Access url */}
          <div className="flex flex-col space-y-1 flex-1 max-w-[625px]">
            <div className="flex justify-between items-center">
              <label className="font-light text-xs text-gray-400">
                {t("access_url")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="bg-[#EBEFFF] rounded-lg p-2 flex-1 cursor-pointer select-none overflow-hidden focus:outline-none focus:ring focus:ring-blue-300  overlfow-hidden "
                tabIndex={0}
                onClick={() => {
                  navigator.clipboard.writeText(String(experimentUrl));
                  toast.success(t("access_url_copied"));
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
                  toast.success(t("access_url_copied"));
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
          {selectedExperiment?.experiment.accessCode && (
            <div className="flex flex-col space-y-1 max-w-[190px]">
              <div className="flex justify-between items-center">
                <label className="font-light text-xs text-gray-400">
                  {t("access_code")}
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
                    toast.success(t("access_code_copied"));
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
                    toast.success(t("access_code_copied"));
                  }}
                >
                  <Copy
                    size={20}
                    className="text-gray-500 hover:text-blue-500 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-6">
        <div className="border-t border-indigo-200 my-4" />
        <div>
          <SectionHeader
            title={t("Participants")}
            actionLabel={t("add_participant")}
            onAction={() => setIsModalOpen(true)}
          />
        </div>
        {fecthingParticipants ? (
          <div>{t("loading")}</div>
        ) : (
          <>
            {rows?.length > 0 ? (
              <ParticipantTable
                headers={[
                  { key: "name", label: t("name") },
                  { key: "age", label: t("age") },
                  { key: "gender", label: t("gender") },
                  { key: "nativeLanguage", label: t("language") },
                ]}
                rows={rows}
                pagination={true}
                actions={(row) => {
                  if (row.completedAt) {
                    return [
                      {
                        label: t("results_xlsx"),
                        onClick: async (r) => {
                          await getUserResults(
                            r as FormatedParticipantsType,
                            "xlsx"
                          );
                        },
                      },
                      {
                        label: t("results_json"),
                        onClick: async (r) => {
                          await getUserResults(
                            r as FormatedParticipantsType,
                            "json"
                          );
                        },
                      },
                      {
                        label: t("remove"),
                        onClick: async (r) => {
                          const ok = await confirm({
                            title: t("participant_remove_confirmation"),
                            message: t(
                              "participant_remove_confirmation_data_lost_message"
                            ),
                          });
                          if (ok) {
                            await removeParticipantFromExperiment(`${r.id}`);
                          }
                        },
                      },
                    ];
                  } else {
                    return [
                      {
                        label: t("remove"),
                        onClick: async (r) => {
                          const ok = await confirm({
                            title: t("participant_remove_confirmation"),
                            message: "",
                          });
                          if (ok) {
                            await removeParticipantFromExperiment(`${r.id}`);
                          }
                        },
                      },
                    ];
                  }
                }}
              />
            ) : (
              <div className="flex h-full w-full">
                <p className="text-gray-500">{t("no_participants_found")}</p>
              </div>
            )}
          </>
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
