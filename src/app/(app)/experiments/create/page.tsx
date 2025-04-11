"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import DataTable from "@/components/DataTable";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "nextjs-toploader/app";

// Schema de validação
const experimentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  participantTarget: z
    .number({ invalid_type_error: "Participants limit must be a number" })
    .min(1, "Must be at least 1"),
  allowExtraParticipants: z.boolean(),
  accessCode: z.string().optional(),
});

type ExperimentFormData = z.infer<typeof experimentSchema>;

const CreateExperiments = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperimentFormData>({
    resolver: zodResolver(experimentSchema),
    defaultValues: {
      allowExtraParticipants: false,
      accessCode: "",
    },
  });

  const onSubmit = (data: ExperimentFormData) => {
    router.push("/experiments/1234-5678-9101/timeline");
  };

  const generateCode = () => {
    // todo: call api to generate code
    if (watch("accessCode")) return;

    const code = Array(3)
      .fill(0)
      .map(() => Math.random().toString(36).substring(2, 6).toUpperCase())
      .join("-");
    setValue("accessCode", code);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Create experiment"
        subtitle="Create your new experiment"
      >
        <div className="button">
          <Link
            className="cursor-pointer text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
            href={"/experiments/create"}
          >
            Create Experiment
          </Link>
        </div>
      </PageHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full"
      >
        <div>
          <div className="space-y-6 p-8">
            {/* Title */}
            <div className="flex flex-col space-y-1">
              <label className="font-light text-xs text-gray-400">Title</label>
              <input
                {...register("title")}
                className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Experiment title"
              />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
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
                placeholder="Experiment description"
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Participants Limit and Access Code */}
            <div className="flex gap-4 items-start max-w-3xl">
              {/* Participants Limit */}
              <div className="flex-1 flex flex-col space-y-1">
                <label className="font-light text-xs text-gray-400">
                  Participant target
                </label>
                <input
                  type="number"
                  {...register("participantTarget", { valueAsNumber: true })}
                  className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Number of participants"
                  min="1"
                />
                {errors.participantTarget && (
                  <span className="text-red-500 text-xs">
                    {errors.participantTarget.message}
                  </span>
                )}
              </div>

              {/* Access Code */}
              <div className="flex-1 flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-light text-xs text-gray-400">
                    Access code
                  </label>
                  <button
                    type="button"
                    onClick={generateCode}
                    className={`text-xs text-gray-500 hover:text-blue-500 cursor-pointer pr-8 ${
                      watch("accessCode") ? "hidden" : "block"
                    }`}
                  >
                    generate
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    {...register("accessCode")}
                    className="bg-[#EBEFFF] rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Click to generate"
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
                type="checkbox"
                {...register("allowExtraParticipants")}
                className="accent-blue-500"
                id="allowExtraParticipants"
              />
              <label
                className="text-sm cursor-pointer"
                htmlFor="allowExtraParticipants"
              >
                Allow entry after reaching target
              </label>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-indigo-200 my-4 mx-8" />

          {/* Scientist */}
          <div className="px-8 space-y-4 mb-8">
            <SectionHeader
              title="Scientists"
              actionLabel="Add Scientist"
              onAction={() => console.log("open modal")}
            />

            <DataTable
              headers={[
                { key: "name", label: "NAME" },
                { key: "email", label: "EMAIL" },
                { key: "profile", label: "PROFILE" },
                { key: "role", label: "ROLE" },
              ]}
              rows={[
                {
                  id: 1,
                  name: "Matheus Rodrigues Felizardo",
                  email: "matheus.felizardo2@gmail.com",
                  profile: "Researcher",
                  role: "Owner",
                },
              ]}
              withQuickActions
              actions={[
                { label: "Edit", onClick: (row) => alert(`Edit ${row.name}`) },
                {
                  label: "Remove",
                  onClick: (row) => alert(`Remove ${row.name}`),
                },
              ]}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition cursor-pointer"
        >
          Save and continue
        </button>
      </form>
    </div>
  );
};

export default CreateExperiments;
