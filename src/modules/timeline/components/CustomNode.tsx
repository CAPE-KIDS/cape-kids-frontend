import React, { memo, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { MoreVertical } from "lucide-react";
import { useTimelineSidebar } from "@/stores/timeline/sidebarStore";

const CustomNode = ({ data }: { data: any }) => {
  const { openSidebar } = useTimelineSidebar();

  return (
    <div className="relative px-3 py-3 shadow-md rounded-lg w-40 h-24">
      {/* Node label */}
      <div
        className=" text-white text-sm truncate max-w-11/12"
        title={data.label}
      >
        {data.label}
      </div>

      {/* Quick action button (3 dots) */}
      <div className="absolute top-3 right-1 text-white cursor-pointer">
        <button
          onClick={() => {
            openSidebar(data.stepData);
          }}
          className="text-white cursor-pointer"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Step indicator */}
      <div className="absolute bottom-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-white text-black font-semibold">
        {data.step}
      </div>

      {/* Handles for connecting edges */}
      {data.type !== "start" && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            width: 8,
            height: 8,
            background: "#D2D6DB",
            borderColor: "#000",
          }}
        />
      )}
      {data.type !== "end" && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            width: 8,
            height: 8,
            background: "#D2D6DB",
            borderColor: "#000",
          }}
        />
      )}
    </div>
  );
};

export default memo(CustomNode);
