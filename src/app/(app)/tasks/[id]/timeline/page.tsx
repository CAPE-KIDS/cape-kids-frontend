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

// Schema de validação
const CreateTasksTimeline = () => {
  const { token } = useAuth();
  const { formatToTimeline, edges, steps, setLoading } = useTimelineStore();
  const { selectedTask, setSelectedTask, getTaskById, tasks, setTasks } =
    useTasksStore();
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const [fetched, setFetched] = useState(false);
  const { authState } = useAuthStore();
  const [localSteps, setLocalSteps] = useState<TimelineStep[]>(steps);

  const fetchTask = async () => {
    const task = await getTaskById(taskId);
    if (task) {
      setSelectedTask(task.data);
      formatToTimeline(task.data);
      setFetched(true);
    }
  };

  useEffect(() => {
    if (!authState.token) return;
    const selected = tasks.find((task) => task.id === taskId);

    if (selected) {
      formatToTimeline(selected);
      return;
    }

    fetchTask();
    return;
  }, [taskId, authState]);

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
      <PageHeader title="Task Timeline" subtitle="Manage the flow of your task">
        <div className="button">
          <Link
            className="cursor-pointer text-white rounded-lg px-4 py-3 bg-blue-600 transition duration-200"
            href={"/tasks/create"}
          >
            Create Task
          </Link>
        </div>
      </PageHeader>

      <div className="flex-1 p-6">
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
        Check other tasks
      </button>

      <SequentialStimuliConfigModal />
      <MultiTriggerConfigModal />
    </div>
  );
};

export default CreateTasksTimeline;
