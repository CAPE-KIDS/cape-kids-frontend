"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import StimuliConfigModal from "@/components/blockTypes/sequentialStimuli/SequentialStimuliConfigModal";
import { useAuth } from "@/hooks/useAuth";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import _ from "lodash";

// Schema de validação
const CreateExperimentsTimeline = () => {
  const { token } = useAuth();
  const { formatToTimeline, edges } = useTimelineStore();
  const { selectedExperiment, setSelectedExperiment, getExperimentById } =
    useExperimentsStore();
  const params = useParams();
  const experimentId = params.id as string;

  const fetchExperiment = async () => {
    const experiment = await getExperimentById(experimentId, token);
    if (experiment) {
      setSelectedExperiment(experiment.data);
      formatToTimeline(experiment.data);
    }
  };

  useEffect(() => {
    if (!token || !experimentId) return;
    if (selectedExperiment) {
      formatToTimeline(selectedExperiment);
      return;
    }

    fetchExperiment();
  }, [token, experimentId, selectedExperiment]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Experiment Timeline"
        subtitle="Manage the flow of your experiment"
      >
        <div className="button">
          <Link
            className="cursor-pointer text-white rounded-lg px-4 py-3 bg-blue-600 transition duration-200"
            href={"/experiments/create"}
          >
            Create Experiment
          </Link>
        </div>
      </PageHeader>

      <div className="flex-1 p-6">
        <TimelineView />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition cursor-pointer"
      >
        Save and continue
      </button>

      <StimuliConfigModal />
    </div>
  );
};

export default CreateExperimentsTimeline;
