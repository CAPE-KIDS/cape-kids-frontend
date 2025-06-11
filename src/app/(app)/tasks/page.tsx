"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect } from "react";
import { useTasksStore } from "@/stores/tasks/tasksStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useTranslation } from "react-i18next";

const Tasks = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { token, user } = useAuth();
  const { tasks, getUserTasks } = useTasksStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      await getUserTasks(token);
      setLoading(false);
    };
    fetchTasks();
  }, [token]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {tasks.map((e) => (
              <div
                key={e.task.id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h2 className="text-lg font-semibold">{e.task.title}</h2>
                <p className="text-gray-500 h-12 line-clamp-2 overflow-hidden">
                  {e.task.description}
                </p>
                <button
                  type="button"
                  href={`/tasks/${e.task.id}/timeline`}
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setTimeout(() => {
                      NProgress.start();
                      router.push(`/tasks/${e.task.id}/timeline`);
                    }, 100);
                  }}
                >
                  {t("view_timeline")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
