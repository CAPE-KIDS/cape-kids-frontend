"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TimelineView from "@/modules/timeline/TimelineView";
import { useParams } from "next/navigation";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import StimuliConfigModal from "@/components/blockTypes/sequentialStimuli/SequentialStimuliConfigModal";
import { useAuth } from "@/hooks/useAuth";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import _ from "lodash";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { TimelineStep } from "@shared/timeline";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

// Schema de validação
const CreateExperimentsTimeline = () => {
  const { token } = useAuth();
  const { formatToTimeline, edges, steps, setLoading } = useTimelineStore();
  const {
    selectedExperiment,
    setSelectedExperiment,
    getExperimentById,
    experiments,
    setExperiments,
  } = useExperimentsStore();
  const router = useRouter();
  const params = useParams();
  const experimentId = params.id as string;
  const [fetched, setFetched] = useState(false);
  const { authState } = useAuthStore();
  const [localSteps, setLocalSteps] = useState<TimelineStep[]>(steps);

  const fetchExperiment = async () => {
    const experiment = await getExperimentById(experimentId);
    if (experiment) {
      setSelectedExperiment(experiment.data);
      formatToTimeline(experiment.data);
      setFetched(true);
    }
  };

  useEffect(() => {
    if (!authState.token) return;
    const selected = experiments.find(
      (exp) => exp.experiment.id === experimentId
    );

    if (selected) {
      formatToTimeline(selected);
      return;
    }

    fetchExperiment();
    return;
  }, [experimentId, authState]);

  const refreshExperiment = async () => {
    setLoading(true);
    const exp = await getExperimentById(experimentId);
    if (exp?.data) {
      setSelectedExperiment(exp.data);
      formatToTimeline(exp.data);
      const experimentsClone = _.cloneDeep(experiments);
      const updated = experimentsClone.map((d) =>
        d.experiment.id === experimentId ? exp.data : d
      );
      setExperiments(updated);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (steps.length === 0) return;

    if (!_.isEqual(steps, localSteps)) {
      refreshExperiment();
      setLocalSteps(steps);
    }
  }, [steps]);

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
        type="button"
        className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition cursor-pointer"
        onClick={() => {
          NProgress.start();
          router.push(`/experiments/${experimentId}/participants`);
        }}
      >
        Manage participants
      </button>

      <StimuliConfigModal />
    </div>
  );
};

export default CreateExperimentsTimeline;
