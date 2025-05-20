"use client";
import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { useTimelineStore } from "@/stores/timeline/timelineStore";

import "../../../../tailwind.config";

const TimelineEditor = () => {
  const {
    nodes: timelineNodes,
    edges: timelineEdges,
    steps,
    sourceData,
    updateEdgesAndNodes,
  } = useTimelineStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(timelineNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(timelineEdges);

  const onConnect = async (params: Connection) => {
    setEdges((eds) => {
      const filtered = eds.filter(
        (e) => e.source !== params.source && e.target !== params.target
      );
      const updatedEdges = addEdge({ ...params, type: "custom" }, filtered);
      updateEdgesAndNodes(updatedEdges, nodes);

      return updatedEdges;
    });
  };

  useEffect(() => {
    const visited: Record<string, number> = {};
    let count = 1;

    const startNode = nodes.find(
      (node) => !edges.some((e) => e.target === node.id)
    );
    if (!startNode) return;

    const assignStepOrder = (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);

      // Handle conditional nodes here if needed, it will accept two connections
      // if (node?.data.type === "conditional") {
      // }

      if (!node || visited[nodeId]) return;
      visited[nodeId] = count++;
      const nextEdge = edges.find((e) => e.source === nodeId);
      if (nextEdge) assignStepOrder(nextEdge.target);
    };

    assignStepOrder(startNode.id);

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          step: visited[n.id] || "",
        },
      }))
    );
  }, [timelineNodes, edges]);

  useEffect(() => {
    const formattedNodes = timelineNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onEdit: handleEditStep,
        onDelete: handleDeleteStep,
      },
    }));

    setNodes(formattedNodes);
    setEdges(timelineEdges);
  }, [timelineNodes, timelineEdges]);

  const onNodeDrag = useCallback(() => {
    const buttons = document.querySelectorAll(".edge-remove-btn");
    buttons.forEach((button) => {
      button.classList.add("opacity-0");
    });
  }, []);

  const onNodeDragEnd = useCallback(() => {
    const buttons = document.querySelectorAll(".edge-remove-btn");
    buttons.forEach((button) => {
      button.classList.remove("opacity-0");
    });
  }, []);

  const openPreview = () => {
    const previewWindow = window.open(
      `/preview?id=${sourceData?.id}`,
      "_blank"
    );
    if (previewWindow) {
      previewWindow.name = JSON.stringify({ steps });
    }
  };

  const handleEditStep = (stepId: string) => {
    console.log("Edit step:", stepId);
  };

  const handleDeleteStep = (stepId: string) => {
    console.log("Delete step:", stepId);
  };

  return (
    <div className="w-full h-[600px] max-h-[calc(100vh-230px)] rounded-md border relative">
      <div className="absolute right-1 top-1 flex items-center gap-2">
        <button
          onClick={openPreview}
          className="text-xs cursor-pointer bg-white border p-2 rounded-md shadow-sm hover:bg-gray-50 transition z-20"
        >
          Preview
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={{ custom: CustomEdge }}
        nodeTypes={{ custom: CustomNode }}
        onNodeDragStart={onNodeDrag}
        onNodeDragStop={onNodeDragEnd}
        onConnect={onConnect}
        fitView
      >
        <Background gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TimelineEditor;
