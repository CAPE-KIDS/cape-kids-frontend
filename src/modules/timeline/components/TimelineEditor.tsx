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
import { useExperimentStore } from "@/stores/experiment/experimentStore";

import "../../../../tailwind.config";

const TimelineEditor = () => {
  const { nodes: initialNodes, edges: initialEdges } = useExperimentStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    setEdges((eds) => {
      const filtered = eds.filter(
        (e) => e.source !== params.source && e.target !== params.target
      );
      return addEdge({ ...params, type: "custom" }, filtered);
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
  }, [edges]);

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

  return (
    <div className="w-full h-[600px] rounded-md border">
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
