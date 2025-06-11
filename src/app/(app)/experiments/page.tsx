"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useTranslation } from "react-i18next";

const Experiments = () => {
  const router = useRouter();
  const { authState } = useAuthStore();
  const { experiments, getUserExperiments } = useExperimentsStore();
  const [loading, setLoading] = React.useState(true);
  const { getTasks } = useTimelineStore();
  const { t: tC } = useTranslation("common");
  const { t: tE } = useTranslation("experiments");

  const fetchExperiments = async () => {
    if (!authState.token) return;
    await getUserExperiments(authState.token);
    setLoading(false);
  };

  const fetchTasks = async () => {
    if (!authState.token) return;
    await getTasks();
  };

  useEffect(() => {
    if (!authState.token) return;

    fetchExperiments();
    fetchTasks();
  }, [authState.token]);

  return (
    <div>
      <PageHeader
        title={tE("experiment_title")}
        subtitle={tE("experiment_subtitle")}
      >
        <div className="search">
          <input
            type="text"
            placeholder={tE("search_experiments")}
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {authState.user?.profile.profileType !== "participant" && (
          <div className="button">
            <Link
              className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
              href={"/experiments/create"}
            >
              {tE("create_experiment")}
            </Link>
          </div>
        )}
      </PageHeader>

      <div>
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">{tC("loading")}</p>
          </div>
        )}

        {!loading &&
          experiments.length === 0 &&
          (authState.user?.profile.profileType === "participant" ? (
            <div className="p-6">
              <p className="text-gray-500">{tE("not_part_experiment")}</p>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-500">No experiments found</p>
              <Link
                className="cursor-pointer font-semibold text-blue-500 mt-4 block"
                href={"/experiments/create"}
              >
                {tE("create_first_experiment")}
              </Link>
            </div>
          ))}

        {!loading && experiments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {experiments.map((e) => (
              <div
                key={e.experiment.id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h2 className="text-lg font-semibold">{e.experiment.title}</h2>
                <p className="text-gray-500">{e.experiment.description}</p>
                {authState.user?.profile.profileType === "participant" ? (
                  <Link
                    className="cursor-pointer text-blue-500 mt-4 block"
                    href={`/experiments/${e.experiment.id}/play`}
                    target="_blank"
                  >
                    {tE("view_experiment")}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setTimeout(() => {
                        NProgress.start();
                        router.push(`/experiments/${e.experiment.id}/timeline`);
                      }, 100);
                    }}
                  >
                    {tC("view_timeline")}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiments;
