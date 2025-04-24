import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import { useTimelineSidebar } from "@/stores/timeline/sidebarStore";
import { TimelineStep } from "@/modules/timeline/types";
import { options } from "./TimelineSidebar";
import { Grip } from "lucide-react";

interface TimelineStepOrderProps {
  draftTitle: string;
  draftType: string;
}

export function TimelineStepOrder({
  draftTitle,
  draftType,
}: TimelineStepOrderProps) {
  const { steps } = useTimelineStore();
  const { currentStep } = useTimelineSidebar();
  const [items, setItems] = useState<TimelineStep[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const draftStep: TimelineStep | null =
    !currentStep && draftType
      ? {
          id: "__draft__",
          timelineId: "preview",
          orderIndex: -1,
          type: draftType as any,
          metadata: {
            title: draftTitle || "",
            positionX: 0,
            positionY: 0,
            blocks: [],
          },
        }
      : null;

  useEffect(() => {
    const sorted = [...steps].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    );
    setItems(draftStep ? [...sorted, draftStep] : sorted);
  }, [steps, draftTitle, draftType, currentStep]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    setItems(newItems);
    setActiveId(null);
  };

  return (
    <div className="bg-[#e6ecff] rounded-xl space-y-4">
      <h2 className="text-lg font-semibold mb-2">Timeline order</h2>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {items.map((step) => (
              <SortableStep
                key={step.id}
                step={step}
                isDraft={step.id === "__draft__"}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableStep({
  step,
  isDraft,
}: {
  step: TimelineStep;
  isDraft: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDraft
      ? "#fff"
      : options.find((o) => o.value === step.type)?.color ?? "#ccc",
    border: isDraft
      ? "2px dashed black"
      : step.type === "custom_block"
      ? "1px dashed #000"
      : "none",
    color: isDraft ? "#000" : "#fff",
    cursor: "grab",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 truncate"
      style={style}
    >
      <Grip className="w-4 h-4" />
      <span className="truncate">
        {step.metadata.title || (
          <em className="text-gray-400">Untitled step</em>
        )}
      </span>
    </div>
  );
}
