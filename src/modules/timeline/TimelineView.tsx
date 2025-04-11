import React, { useEffect, useState } from "react";
import TimelineHeader from "./components/TimelineHeader";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import TimelineEditor from "./components/TimelineEditor";
import TimelineSidebar from "./components/TimelineSidebar";
import { Experiment } from "@/stores/timeline/timelineStore";
import { Loader2 } from "lucide-react";

type TimelineViewProps = {
  data: Experiment | null;
};

const TimelineView: React.FC<TimelineViewProps> = ({ data }) => {
  const { sourceData, loading } = useTimelineStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSiderbarOpen = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-4">
        <Loader2 className="animate-spin" size={24} />
        <span>Loading...</span>
      </div>
    );
  }

  if (!sourceData) {
    return <div>No experiment data found</div>;
  }

  return (
    <div>
      <TimelineHeader
        title={sourceData?.title || ""}
        key={sourceData?.id || ""}
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
