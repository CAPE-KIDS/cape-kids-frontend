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
import TimelineHeader from "@/modules/timeline/components/TimelineHeader";
import { title } from "process";
import TimelineView from "@/modules/timeline/TimelineView";
import { useParams } from "next/navigation";

// Schema de validação

const CreateExperimentsTimeline = () => {
  const params = useParams();
  const experimentId = params.id as string;
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Experiment Timeline"
        subtitle="Manage the flow of your experiment"
      >
        <div className="button">
          <Link
            className="cursor-pointer bg-[#EBEFFF]0 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
            href={"/experiments/create"}
          >
            Create Experiment
          </Link>
        </div>
      </PageHeader>

      <div className="flex-1 p-6">
        <TimelineView id={experimentId} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition cursor-pointer"
      >
        Save and continue
      </button>
    </div>
  );
};

export default CreateExperimentsTimeline;
