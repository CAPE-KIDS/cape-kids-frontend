"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect } from "react";
import { useTasksStore } from "@/stores/tasks/tasksStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useTranslation } from "react-i18next";
import TasksTable from "@/components/tables/TasksTable";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const Tasks = () => {
  const { t } = useTranslation("common");
  const { authState } = useAuthStore();
  const router = useRouter();
  const { token, user } = useAuth();
  const { tasks, getUserTasks } = useTasksStore();
  const [loading, setLoading] = React.useState(true);

  const fetchTasks = async () => {
    if (!authState.token) return;
    await getUserTasks(authState.token);
    setLoading(false);
  };

  useEffect(() => {
    if (!authState.token) return;

    if (authState.user?.profile.profileType === "participant") {
      router.push("/experiments");
      return;
    }

    fetchTasks();
  }, [authState]);

  return (
    <div>
      <PageHeader title={t("tasks_title")} subtitle={t("tasks_subtitle")}>
        <div className="search">
          <input
            type="text"
            placeholder={t("search_tasks")}
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {user?.profile.profileType !== "participant" && (
          <div className="button">
            <Link
              className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
              href={"/tasks/create"}
            >
              {t("create_task")}
            </Link>
          </div>
        )}
      </PageHeader>

      <div>
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">{t("loading")}</p>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="p-6">
            <p className="text-gray-500">{t("no_tasks_found")}</p>
            <Link
              className="cursor-pointer font-semibold text-blue-500 mt-4 block"
              href={"/tasks/create"}
            >
              {t("create_first_task")}
            </Link>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="p-6">
            <TasksTable
              pagination={true}
              tasks={tasks.map(({ task }) => task)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
