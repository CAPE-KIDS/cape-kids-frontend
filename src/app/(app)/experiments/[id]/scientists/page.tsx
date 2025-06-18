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
import ScientistModal from "@/components/modals/ScientistModal";
import {
  FormatedScientistsType,
  useScientistsStore,
} from "@/stores/scientists/scientistsStore";
import { confirm } from "@/components/confirm/confirm";
import { useTranslation } from "react-i18next";
import ScientistTable from "@/components/tables/ScientistTable";

const ExperimentScientists = () => {
  const { t } = useTranslation("common");
  const { t: tE } = useTranslation("experiments");
  const params = useParams();
  const experimentId = params.id as string;
  const {
    experiments,
    getExperimentById,
    setSelectedExperiment,
    selectedExperiment,
    getExperimentScientists,
  } = useExperimentsStore();
  const { getScientists, removeScientist, formatScientistsInExperiment } =
    useScientistsStore();
  const { authState } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<FormatedScientistsType[] | []>([]);
  const [fecthingScientists, setFecthingScientists] = useState(false);
  const router = useRouter();

  const fetchExperiment = async () => {
    const experiment = await getExperimentById(experimentId);
    if (experiment) {
      setSelectedExperiment(experiment.data);
    }
  };

  const fetchScientists = async () => {
    setFecthingScientists(true);

    const response = await getScientists();
    setFecthingScientists(false);
    if (response?.error) {
      console.log("Error fetching scientists: ", response.error);
      return;
    }
  };

  const fetchExperimentScientists = async () => {
    if (!authState.token || !experimentId) return;
    const response = await getExperimentScientists(experimentId);
    console.log("experiment scientists response", response);
    if (response?.error) {
      console.log("Error fetching experiment scientists: ", response.error);
      return;
    }

    const formatedScientists =
      response?.data && formatScientistsInExperiment(response?.data);
    setRows(formatedScientists);
  };

  useEffect(() => {
    if (!authState.token) return;

    if (authState.user?.profile.profileType === "participant") {
      router.push("/experiments");
      return;
    }

    fetchScientists();
    fetchExperimentScientists();

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

  const removeScientistFromExperiment = async (id: string) => {
    const response = await removeScientist(experimentId, id);
    if (response.error) {
      toast.error(t("error_removing_scientist"));
      return;
    }

    toast.success(t("scientist_removed_from_experiment"));
    await fetchExperimentScientists();
  };

  if (loading) return <div>{t("loading")}</div>;

  const experimentUrl = `${window?.location.origin}/experiments/${experimentId}/join`;

  return (
    <div>
      <PageHeader
        title={t("experiment_scientists_title")}
        subtitle={t("experiment_scientists_subtitle")}
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

      <div className="px-6 ">
        <div className="mt-4 text-lg font-medium text-gray-800 mb-4">
          {selectedExperiment?.experiment.title}
        </div>
      </div>

      <div className="mx-6">
        <div className="border-t border-indigo-200 my-4" />
        <div>
          <SectionHeader
            title={t("Scientists")}
            actionLabel={t("add_scientist")}
            onAction={() => setIsModalOpen(true)}
          />
        </div>
        {fecthingScientists ? (
          <div>{t("loading")}</div>
        ) : (
          <>
            {rows?.length > 0 ? (
              <ScientistTable
                headers={[
                  { key: "name", label: t("name") },
                  { key: "email", label: t("email") },
                  { key: "institution", label: t("institution") },
                  { key: "department", label: t("department") },
                  { key: "isOwner", label: t("creator") },
                ]}
                rows={rows}
                pagination={true}
                actions={(row) => {
                  if (row.isOwner) return [];
                  return [
                    {
                      label: t("remove"),
                      onClick: async (r) => {
                        const ok = await confirm({
                          title: t("scientist_remove_confirmation"),
                          message: "",
                        });
                        if (ok) {
                          await removeScientistFromExperiment(`${r.id}`);
                        }
                      },
                    },
                  ];
                }}
              />
            ) : (
              <div className="flex h-full w-full">
                <p className="text-gray-500">{t("no_scientists_found")}</p>
              </div>
            )}
          </>
        )}
      </div>
      <ScientistModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        fetchExperimentScientists={fetchExperimentScientists}
      />
    </div>
  );
};

export default ExperimentScientists;
