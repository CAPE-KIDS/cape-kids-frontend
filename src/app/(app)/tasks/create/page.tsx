"use client";

import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import DataTable from "@/components/DataTable";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "nextjs-toploader/app";
import { CreateTaskSchemaType, createTaskSchema } from "@shared/tasks";
import { API } from "@/utils/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useTasksStore } from "@/stores/tasks/tasksStore";
import _ from "lodash";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const CreateTasks = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { authState } = useAuthStore();
  const { createTask } = useTasksStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      isTemplate: true,
      createdBy: user?.id,
    },
  });

  const onSubmit = async () => {
    const data = watch();

    const response = await createTask(data);

    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success("Task created successfully");
    router.push(`/tasks/${response.data.task.id}/timeline`);
  };

  useEffect(() => {
    if (errors) {
      console.log("errors", errors);
    }
  }, [errors]);

  useEffect(() => {
    if (!authState.token) return;
    if (authState.user?.profile.profileType === "participant") {
      router.push("/experiments");
      return;
    }
  }, [authState]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Create task" subtitle="Create your new task">
        <div className="button">
          <Link
            className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
            href={"/tasks/create"}
          >
            Create Task
          </Link>
        </div>
      </PageHeader>

      <form className="flex flex-col justify-between h-full">
        <div>
          <div className="space-y-6 p-8">
            {/* Title */}
            <div className="flex flex-col space-y-1">
              <label className="font-light text-xs text-gray-400">Title*</label>
              <input
                {...register("title")}
                className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Task title"
              />
              {errors.title?.message && (
                <span className="text-red-500 text-xs">
                  {errors.title.message.replace("String", "Title")}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-1">
              <label className="font-light text-xs text-gray-400">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description")}
                className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Task description"
              />
              {errors.description?.message && (
                <span className="text-red-500 text-xs">
                  {errors.description.message.replace("String", "Description")}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-indigo-200 my-4 mx-8" />

          {/* Scientists */}
          <div className="px-8 space-y-4 mb-8">
            <SectionHeader
              title="Scientists"
              actionLabel="Add Scientist"
              onAction={() => console.log("open modal")}
            />
            {user && (
              <DataTable
                headers={[
                  { key: "name", label: "NAME" },
                  { key: "email", label: "EMAIL" },
                  { key: "profile", label: "PROFILE" },
                  { key: "role", label: "ROLE" },
                ]}
                rows={[
                  {
                    id: user?.id,
                    name: user?.profile.fullName,
                    email: user?.email,
                    profile: _.capitalize(user?.profile?.profileType),
                    role: "Owner",
                  },
                ]}
                withQuickActions
                actions={[
                  {
                    label: "Edit",
                    onClick: (row) => alert(`Edit ${row.name}`),
                  },
                  {
                    label: "Remove",
                    onClick: (row) => alert(`Remove ${row.name}`),
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition cursor-pointer"
        >
          Save and continue
        </button>
      </form>
    </div>
  );
};

export default CreateTasks;
