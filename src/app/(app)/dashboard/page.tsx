"use client";
import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useParticipantsStore } from "@/stores/participants/participantsStore";
import { ExperimentSchemaWithTimelineType } from "@shared/experiments";
import ExperimentsTable from "@/components/tables/ExperimentsTable";
import _ from "lodash";
import { useTasksStore } from "@/stores/tasks/tasksStore";
import Link from "next/link";

const Dashboard = () => {
  const { t } = useTranslation("common");
  const { t: tE } = useTranslation("experiments");
  const { authState } = useAuthStore();
  const { experiments, getUserExperiments } = useExperimentsStore();
  const { participants, getParticipants } = useParticipantsStore();
  const { tasks, getUserTasks } = useTasksStore();
  const [loading, setLoading] = useState(true);
  const [lastExperiments, setLastExperiments] = useState<
    ExperimentSchemaWithTimelineType[] | null
  >(null);

  const fetchAll = async () => {
    if (!authState.token) return;

    setLoading(true);
    await Promise.all([
      getUserExperiments(authState.token),
      getParticipants(),
      getUserTasks(authState.token),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (!authState.token) return;

    fetchAll();
  }, [authState]);

  useEffect(() => {
    if (experiments.length > 0) {
      const lastExperiments = experiments.map((experiment) => {
        return experiment;
      });
      const lastThreeExperiments = _.takeRight(lastExperiments, 3);

      setLastExperiments(lastThreeExperiments);
    }
  }, [experiments]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={t("dashboard_title")}
        subtitle={t("dashboard_subtitle")}
      />

      {loading ? (
        <div className="flex items-center justify-center h-full">
          {t("loading")}
        </div>
      ) : (
        <div className="p-6 flex-1 overflow-auto h-full">
          <div className="flex flex-col justify-between gap-6 h-full">
            <div>
              <div className="flex flex-row gap-6 flex-1">
                <div className="card bg-base-100 shadow-xl p-6 text-center">
                  <span>{t("experiments_total")}</span>
                  <h1 className="text-3xl font-bold">{experiments.length}</h1>
                </div>

                <div className="card bg-base-100 shadow-xl p-6 text-center">
                  <span>{t("participants_total")}</span>
                  <h1 className="text-3xl font-bold">{participants.length}</h1>
                </div>

                <div className="card bg-base-100 shadow-xl p-6 text-center">
                  <span>{t("tasks_total")}</span>
                  <h1 className="text-3xl font-bold">{tasks.length}</h1>
                </div>
              </div>

              <div className="mt-12">
                {lastExperiments && lastExperiments.length > 0 ? (
                  <>
                    <h4 className="mb-3">{t("last_experiments")}</h4>
                    <ExperimentsTable
                      pagination={false}
                      experiments={lastExperiments.map(
                        ({ experiment }) => experiment
                      )}
                    />
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    {tE("no_experiments")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-6">
              {authState.user?.profile.profileType !== "participant" && (
                <div className="mt-6">
                  <Link
                    className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
                    href={"/experiments"}
                  >
                    {t("manage_experiments")}
                  </Link>
                </div>
              )}

              {authState.user?.profile.profileType !== "participant" && (
                <div className="mt-6">
                  <Link
                    className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
                    href={"/participants"}
                  >
                    {t("manage_participants")}
                  </Link>
                </div>
              )}

              {authState.user?.profile.profileType !== "participant" && (
                <div className="mt-6">
                  <Link
                    className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
                    href={"/tasks"}
                  >
                    {t("manage_tasks")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
