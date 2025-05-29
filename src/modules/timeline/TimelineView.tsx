import React, { useEffect } from "react";
import TimelineHeader from "./components/TimelineHeader";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import TimelineEditor from "./components/TimelineEditor";
import TimelineSidebar from "./components/TimelineSidebar";
import { Loader2 } from "lucide-react";
import { useTimelineSidebar } from "@/stores/timeline/sidebarStore";

const TimelineView = () => {
  const { sourceData, loading } = useTimelineStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-4">
        <Loader2 className="animate-spin" size={24} />
        <span>Loading...</span>
      </div>
    );
  }

  if (!sourceData) {
    return <div>No data found</div>;
  }

  return (
    <div className="w-full overflow-hidden relative h-full">
      <div className="p-6">
        <TimelineHeader
          title={sourceData?.title || ""}
          key={sourceData?.id || ""}
          onAddStep={() => useTimelineSidebar.getState().openSidebar(null)}
        />
        <TimelineEditor />
      </div>
      <TimelineSidebar />
    </div>
  );
};

export default TimelineView;
