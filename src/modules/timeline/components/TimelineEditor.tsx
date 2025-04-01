"use client";
import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Position,
  MarkerType,
  EdgeMarkerType,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import CustomNode from "./CustomNode";

import "../../../../tailwind.config";
import CustomEdge from "./CustomEdge";

const nodeTypes = {
  custom: CustomNode,
};

const defaultNodeStyle = {
  borderRadius: 8,
};

const nodeTypeConfig = "custom";
// ---- Nodes de exemplo ----
const initialNodes: Node[] = [
  {
    id: "1",
    type: nodeTypeConfig,
    position: { x: 0, y: 0 },
    data: { label: "Introduction", step: 1, type: "start" },
    style: {
      background: "#1f1f1f",
      color: "white",
      ...defaultNodeStyle,
    },
  },
  {
    id: "2",
    type: nodeTypeConfig,
    position: { x: 0, y: 150 },
    data: { label: "Flanker task v1", step: 2, type: "task" },
    style: {
      background: "#3B82F6",
      color: "white",
      ...defaultNodeStyle,
    },
  },
  {
    id: "3",
    type: nodeTypeConfig,
    position: { x: 0, y: 300 },
    data: { label: "Message", step: 3, type: "custom_block" },
    style: {
      background: "#F97316",
      color: "white",
      ...defaultNodeStyle,
    },
  },
  {
    id: "4",
    type: nodeTypeConfig,
    position: { x: 0, y: 450 },
    data: { label: "Last screen", step: 4, type: "end" },
    style: {
      background: "#EF4444",
      color: "white",
      ...defaultNodeStyle,
    },
  },
];

const defaultEdgeStyle = {
  type: "custom",
  style: {
    stroke: "#000",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#000",
  } as EdgeMarkerType,
};
const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    ...defaultEdgeStyle,
  },
  { id: "e2-3", source: "2", target: "3", ...defaultEdgeStyle },
  { id: "e3-4", source: "3", target: "4", ...defaultEdgeStyle },
];

// ---- Componente Timeline Editor ----
const TimelineEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    setEdges((eds) => {
      const filtered = eds.filter(
        (e) => e.source !== params.source && e.target !== params.target
      );
      return addEdge({ ...params, ...defaultEdgeStyle }, filtered);
    });
  };

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

  useEffect(() => {
    const visited: Record<string, number> = {};
    let count = 1;

    function dfs(nodeId: string) {
      const node = nodes.find((n) => n.id === nodeId);

      // Handle conditional nodes here if needed, it will accept two connections
      // if (node?.data.type === "conditional") {
      // }

      if (!node || visited[nodeId]) return;
      visited[nodeId] = count++;
      const nextEdge = edges.find((e) => e.source === nodeId);
      if (nextEdge) dfs(nextEdge.target);
    }

    dfs("1");

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
