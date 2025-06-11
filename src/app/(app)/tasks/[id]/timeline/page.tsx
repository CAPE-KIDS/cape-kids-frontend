"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TimelineView from "@/modules/timeline/TimelineView";
import { useParams } from "next/navigation";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import SequentialStimuliConfigModal from "@/components/blockTypes/sequentialStimuli/SequentialStimuliConfigModal";
import MultiTriggerConfigModal from "@/components/blockTypes/multiTriggerStimuli/MultiTriggerConfigModal";
import { useAuth } from "@/hooks/useAuth";
import { useTasksStore } from "@/stores/tasks/tasksStore";
import _ from "lodash";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { TimelineStep } from "@shared/timeline";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useTranslation } from "react-i18next";

// Schema de validação
const CreateTasksTimeline = () => {
  const { t } = useTranslation("common");
  const { token } = useAuth();
  const { formatToTimeline, edges, steps, setLoading, resetTimeline } =
    useTimelineStore();
  const { selectedTask, setSelectedTask, getTaskById, tasks, setTasks } =
    useTasksStore();
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const { authState } = useAuthStore();
  const [localSteps, setLocalSteps] = useState<TimelineStep[]>(steps);

  const fetchTask = async () => {
    const task = await getTaskById(taskId);
    if (task) {
      setSelectedTask(task.data);
      formatToTimeline(task.data);
    }
  };

  useEffect(() => {
    if (!authState.token) return;

    fetchTask();
  }, [taskId, authState]);

  useEffect(() => {
    return () => {
      resetTimeline();
    };
  }, []);

  const refreshTask = async () => {
    setLoading(true);
    const task = await getTaskById(taskId);
    if (task?.data) {
      setSelectedTask(task.data);
      formatToTimeline(task.data);
      const tasksClone = _.cloneDeep(tasks);
      const updated = tasksClone.map((d) =>
        d.task.id === taskId ? task.data : d
      );
      setTasks(updated);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (steps.length === 0) return;

    if (!_.isEqual(steps, localSteps)) {
      refreshTask();
      setLocalSteps(steps);
    }
  }, [steps]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t("task_title")} subtitle={t("task_subtitle")}>
        <div className="button">
          <Link
            className="cursor-pointer text-white rounded-lg px-4 py-3 bg-blue-600 transition duration-200"
            href={"/tasks/create"}
          >
            {t("create_task")}
          </Link>
        </div>
      </PageHeader>

      <div className="flex-1 ">
        <TimelineView />
      </div>

      {/* Submit */}
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition cursor-pointer"
        onClick={() => {
          NProgress.start();
          router.push(`/tasks`);
        }}
      >
        {t("check_other_tasks")}
      </button>

      <SequentialStimuliConfigModal />
      <MultiTriggerConfigModal />
    </div>
  );
};

export default CreateTasksTimeline;
