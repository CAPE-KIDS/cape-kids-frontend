"use client";

import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import DataTable from "@/components/DataTable";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "nextjs-toploader/app";
import {
  CreateExperimentSchemaType,
  createExperimentSchema,
} from "@shared/experiments";
import { API } from "@/utils/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import { useTranslation } from "react-i18next";

const CreateExperiments = () => {
  const { t: tC } = useTranslation("common");
  const { t: tE } = useTranslation("experiments");
  const router = useRouter();
  const { token } = useAuth();
  const { createExperiment } = useExperimentsStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateExperimentSchemaType>({
    resolver: zodResolver(createExperimentSchema),
    defaultValues: {
      allowToJoinAfterFull: true,
      accessCode: "",
      participantTarget: 0,
    },
  });

  const onSubmit = async (data: CreateExperimentSchemaType) => {
    console.log("Submitting experiment data:", data);
    if (!token) return;
    const response = await createExperiment(token, data);

    if (response.error) {
      toast.error(tE("experiment_creation_error"));
      return;
    }
    toast.success(tE("experiment_created_message"));
    router.push(`/experiments/${response.data.experiment.id}/timeline`);
  };

  const generateCode = async () => {
    if (watch("accessCode") || !token) return;

    const request = await fetch(API.GENERATE_ACCESS_CODE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await request.json();
    if (response.error) {
      toast.error(tC("access_code_error"));
      return;
    }

    setValue("accessCode", response.data.accessCode);
    toast.success(tC("access_code_generated_message"));
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={tE("create_experiment")}
        subtitle={tE("create_experiment_subtitle")}
      >
        <div className="button">
          <Link
            className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
            href={"/experiments/create"}
          >
            {tE("create_experiment")}
          </Link>
        </div>
      </PageHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col justify-between h-full"
      >
        <div>
          <div className="space-y-6 p-8">
            {/* Title */}
            <div className="flex flex-col space-y-1">
              <label className="font-light text-xs text-gray-400">
                {tC("title")}*
              </label>
              <input
                {...register("title")}
                className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder={tC("title")}
              />
              {errors.title?.message && (
                <span className="text-red-500 text-xs">
                  {tC("error_title_required")}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-1">
              <label className="font-light text-xs text-gray-400">
                {tC("description")}*
              </label>
              <textarea
                rows={3}
                {...register("description")}
                className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder={tE("placeholder_experiment_description")}
              />
              {errors.description?.message && (
                <span className="text-red-500 text-xs">
                  {tC("error_description_required")}
                </span>
              )}
            </div>

            {/* Participants Limit & Access Code */}
            <div className="flex gap-4 items-start max-w-3xl">
              {/* Participant Target */}
              <div className="flex-1 flex flex-col space-y-1">
                <label className="font-light text-xs text-gray-400">
                  {tC("participant_target")}
                </label>
                <input
                  type="number"
                  {...register("participantTarget", { valueAsNumber: true })}
                  className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder={tC("number_of_participants")}
                />
                {errors.participantTarget?.message && (
                  <span className="text-red-500 text-xs">
                    {tC("error_participant_target_invalid")}
                  </span>
                )}
              </div>

              {/* Access Code */}
              <div className="flex-1 flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-light text-xs text-gray-400">
                    {tC("access_code")}
                  </label>
                  <button
                    type="button"
                    onClick={generateCode}
                    className={`text-xs text-gray-500 hover:text-blue-500 cursor-pointer pr-8 ${
                      watch("accessCode") ? "hidden" : "block"
                    }`}
                  >
                    {tC("generate")}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    {...register("accessCode")}
                    className="bg-[#EBEFFF] rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder={tC("placeholder_access_code")}
                    disabled
                  />
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(String(watch("accessCode")))
                    }
                  >
                    <Copy
                      size={20}
                      className="text-gray-500 hover:text-blue-500 cursor-pointer"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Allow extra participants */}
            <div className="flex items-center space-x-2">
              <input
                type="hidden"
                {...register("allowToJoinAfterFull")}
                className="accent-blue-500"
                id="allowToJoinAfterFull"
              />
              {/* <label
                className="text-sm cursor-pointer"
                htmlFor="allowToJoinAfterFull"
              >
                {tC("allow_entry_after_reaching_target")}
              </label> */}
            </div>
          </div>

          {/* Divider */}
          {/* <div className="border-t border-indigo-200 my-4 mx-8" /> */}

          {/* Scientists */}
          {/* <div className="px-8 space-y-4 mb-8">
            <SectionHeader
              title={tC("scientists")}
              actionLabel={tC("add_scientist")}
              onAction={() => console.log("open modal")}
            />

            <DataTable
              headers={[
                { key: "name", label: tC("NAME") },
                { key: "email", label: tC("EMAIL") },
                { key: "profile", label: tC("PROFILE") },
                { key: "role", label: tC("ROLE") },
              ]}
              rows={[
                {
                  id: 1,
                  name: "Matheus Rodrigues Felizardo",
                  email: "matheus.felizardo2@gmail.com",
                  profile: tC("Researcher"),
                  role: tC("Owner"),
                },
              ]}
              withQuickActions
              actions={[
                {
                  label: tC("edit"),
                  onClick: (row) => alert(`${tC("edit")} ${row.name}`),
                },
                {
                  label: tC("remove"),
                  onClick: (row) => alert(`${tC("remove")} ${row.name}`),
                },
              ]}
            />
          </div> */}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition cursor-pointer"
        >
          {tC("save_and_continue")}
        </button>
      </form>
    </div>
  );
};

export default CreateExperiments;
