import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  MarkerType,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: any) => {
  const { setEdges } = useReactFlow();

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeEdge = () => {
    setEdges((edges) => {
      const targetToRemove = edges.find((e) => e.id === id)?.target;

      if (!targetToRemove) return edges;

      const nodesToRemove: Set<string> = new Set();
      function collect(nodeId: string) {
        nodesToRemove.add(nodeId);
        edges
          .filter((e) => e.source === nodeId)
          .forEach((e) => collect(e.target));
      }
      collect(targetToRemove);

      return edges.filter(
        (e) =>
          !nodesToRemove.has(e.source) &&
          !nodesToRemove.has(e.target) &&
          e.id !== id
      );
    });
  };

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd="url(#arrow)"
        style={{
          stroke: "#000",
          strokeWidth: 2,
        }}
      />

      {/* Botão de remover */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${
              labelY - 2
            }px)`,
            pointerEvents: "all",
          }}
          className="edge-remove-btn flex items-center justify-center bg-gray-200 rounded-full w-4 h-4 cursor-pointer hover:bg-gray-300 transition "
          onClick={removeEdge}
        >
          <X size={8} />
        </div>
      </EdgeLabelRenderer>

      {/* Definição da seta */}
      <svg>
        <marker
          id="arrow"
          markerWidth="20"
          markerHeight="20"
          refX="8"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L10,5 L0,10 L2,5 z" fill="#000" />
        </marker>
      </svg>
    </>
  );
};

export default CustomEdge;
