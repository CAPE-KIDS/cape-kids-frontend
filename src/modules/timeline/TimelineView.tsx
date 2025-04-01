import React, { useEffect } from "react";
import TimelineHeader from "./components/TimelineHeader";
import { useExperimentStore } from "@/stores/experimentStore";
import TimelineEditor from "./components/TimelineEditor";

type TimelineViewProps = {
  id: string;
};

const TimelineView: React.FC<TimelineViewProps> = ({ id }) => {
  const { experimentData, loading, error, getExperimentById } =
    useExperimentStore();

  useEffect(() => {
    if (id) {
      getExperimentById(id);
    }
  }, [id, getExperimentById]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!experimentData) {
    return <div>No experiment data found</div>;
  }

  return (
    <div>
      <TimelineHeader
        title={experimentData.name}
        key={experimentData.id}
        onAddStep={() => console.log("modal")}
      />
      <TimelineEditor />
    </div>
  );
};

export default TimelineView;
