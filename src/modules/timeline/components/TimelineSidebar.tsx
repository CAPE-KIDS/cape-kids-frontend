// components/TimelineSidebar.tsx
import ResizableSidebar from "@/components/ResizableSidebar";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import { useTimelineSidebar } from "@/stores/timeline/sidebarStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomSelect, { Option } from "@/components/CustomSelect";
import { ScreenEditor } from "@/components/ScreenEditor/ScreenEditor";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import TriggerButtons from "@/modules/triggers/components/TriggerButtons";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { toast, Toaster } from "sonner";
import { TimelineStepOrder } from "./TimelineStepOrder";
import TriggerManager from "@/modules/triggers/components/TriggerManager";
import { Trash } from "lucide-react";

const timelineStepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum([
    "custom_block",
    "task",
    "conditional",
    "sequential_stimuli",
    "simultaneous_stimuli",
  ]),
  task: z.string().optional(),
});
type TimelineStepFormData = z.infer<typeof timelineStepSchema>;

export const options: Option[] = [
  { value: "custom_block", label: "Custom block", color: "#333" },
  { value: "task", label: "Task", color: "#3B82F6" },
  { value: "conditional", label: "Conditional", color: "#34C759" },
  {
    value: "sequential_stimuli",
    label: "Sequential Stimuli",
    color: "#8F1D99",
  },
  {
    value: "simultaneous_stimuli",
    label: "Simultaneous Stimuli",
    color: "#1D8499",
  },
];

const TimelineSidebar = () => {
  const { steps, sourceData, updateSteps, removeStep } = useTimelineStore();
  const { sidebarOpen, currentStep, closeSidebar } = useTimelineSidebar();

  const {
    blocks,
    mountStep,
    calculateRenderPosititon,
    clearEditor,
    addScreenBlock,
    addStep,
  } = useEditorStore();

  const {
    register,
    setValue,
    watch,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimelineStepFormData>({
    resolver: zodResolver(timelineStepSchema),
  });

  const [taskList, setTaskList] = useState<any[]>([]);

  const onSubmit = () => {
    const { title, type } = getValues();
    const timelineId = steps[0]?.timelineId;
    const positions = currentStep
      ? {
          index: currentStep.orderIndex,
          x: currentStep.metadata.positionX,
          y: currentStep.metadata.positionY,
        }
      : calculateRenderPosititon(steps);

    const newStep = mountStep(timelineId, positions, type, title);
    newStep.id = currentStep?.id || newStep.id;

    updateSteps(newStep);
    toast.success(currentStep ? "Step updated!" : "Step created!");
    closeSidebar();
    clearEditor();
  };

  const handleRemove = () => {
    if (!currentStep) return;
    removeStep(currentStep.id);
    toast.success("Step removed!");
    closeSidebar();
    clearEditor();
    reset();
  };

  const openPreview = () => {
    const { title, type } = getValues();
    const timelineId = steps[0]?.timelineId;
    const step = mountStep(
      timelineId,
      calculateRenderPosititon(steps),
      type,
      title
    );
    if (step.metadata.blocks.length === 0) {
      toast.error("The screen is empty. Please add at least one block.");
      return;
    }

    const win = window.open(`/preview?id=${step.id}`, "_blank");
    if (win) win.name = JSON.stringify({ steps: [step] });
  };

  useEffect(() => {
    if (!sidebarOpen) {
      reset();
      clearEditor(); // limpa blocos antigos
      return;
    }

    addScreenBlock();

    if (currentStep) {
      setValue("title", currentStep.metadata.title || "");
      setValue("type", currentStep.type as any);

      if (currentStep.type === "task") {
        setValue("task", currentStep.metadata.taskId || "");
      }

      clearEditor();
      (currentStep.metadata.blocks || []).forEach((block) => {
        addStep(block);
      });
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (watch("type") === "task") {
      setTaskList([
        { id: "1", name: "Flanker Task" },
        { id: "2", name: "Go/No go" },
        { id: "3", name: "N-back digit span" },
      ]);
    } else {
      setTaskList([]);
      setValue("task", "");
    }
  }, [watch("type")]);

  return (
    <ResizableSidebar
      isOpen={sidebarOpen}
      onClose={() => {
        closeSidebar();
      }}
    >
      <div className="flex w-full h-full items-center gap-10">
        <div className="max-w-2xl w-full">
          <h2 className="text-2xl mb-4">
            {currentStep ? "Editing step" : "Adding step to the timeline"}
          </h2>
          <p className="mb-4">{sourceData?.title}</p>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-400">Title</label>
              <input
                {...register("title")}
                className="bg-[#EBEFFF] rounded-lg p-2"
                placeholder="Step title"
              />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Type */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-400">Type</label>
              <CustomSelect
                value={watch("type") || null}
                onChange={(val) => setValue("type", val)}
                options={options}
              />
              {errors.type && (
                <span className="text-red-500 text-xs">
                  {errors.type.message}
                </span>
              )}
            </div>

            {/* Task selector */}
            {watch("type") === "task" && (
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-gray-400">Task</label>
                <CustomSelect
                  value={watch("task") || null}
                  onChange={(val) => setValue("task", val)}
                  options={taskList.map((task) => ({
                    value: task.id,
                    label: task.name,
                  }))}
                />
              </div>
            )}

            {/* Editor */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-400">Screen</label>
              <ScreenEditor key={sourceData?.id} />
            </div>

            <div className="flex items-center mt-4 gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Media</span>
                <MediaTypeBlocks />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Triggers</span>
                <TriggerButtons />
              </div>
            </div>

            <div className="flex gap-1 mt-4 justify-between">
              {/* Submit */}
              <button
                onClick={handleSubmit(onSubmit)}
                className="mt-4 w-md bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm cursor-pointer"
              >
                {currentStep ? "Update" : "Save"}
              </button>

              {currentStep && (
                <button
                  onClick={handleRemove}
                  className="mt-2 w-fit flex items-center justify-center gap-2 text-red-600 hover:text-red-700 text-sm cursor-pointer"
                >
                  <Trash size={16} />
                  Remove step
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full max-w-96 bg-[#EBEFFF] h-full max-h-[660px] p-6 relative">
          <TimelineStepOrder
            draftTitle={watch("title")}
            draftType={watch("type")}
          />
          <TriggerManager />
        </div>
      </div>
    </ResizableSidebar>
  );
};

export default TimelineSidebar;
