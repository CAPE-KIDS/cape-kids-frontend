import React, { useEffect, useState } from "react";
import TimelineHeader from "./components/TimelineHeader";
import { useExperimentStore } from "@/stores/experimentStore";
import TimelineEditor from "./components/TimelineEditor";
import TimelineSidebar from "./components/TimelineSidebar";

type TimelineViewProps = {
  id: string;
};

const TimelineView: React.FC<TimelineViewProps> = ({ id }) => {
  const { experimentData, loading, error, getExperimentById } =
    useExperimentStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSiderbarOpen = () => {
    setSidebarOpen((prev) => !prev);
  };

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
        onAddStep={toggleSiderbarOpen}
      />
      <TimelineEditor />
      <TimelineSidebar
        sidebarOpen={sidebarOpen}
        toggleSiderbarOpen={toggleSiderbarOpen}
      />
    </div>
  );
};

export default TimelineView;
