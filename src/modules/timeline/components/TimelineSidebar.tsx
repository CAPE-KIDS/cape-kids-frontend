import ResizableSidebar from "@/components/ResizableSidebar";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock,
  Headphones,
  Image,
  Keyboard,
  Mic,
  MoreVertical,
  Mouse,
  Type,
  Video,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomSelect, { Option } from "@/components/CustomSelect";
import { ScreenEditor } from "@/components/ScreenEditor/ScreenEditor";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import TriggerButtons from "@/modules/triggers/components/TriggerButtons";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import { TimelineStep } from "../types";
import _, { merge } from "lodash";
import { TimelineStepOrder } from "./TimelineStepOrder";

const mockTasks = [
  { id: "1", name: "Flanker Task" },
  { id: "2", name: "Go/No go" },
  { id: "3", name: "N-back digit span" },
];

const timelineStepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum([
    "custom_block",
    "task",
    "conditional",
    "sequential_stimuli",
    "simultaneos_stimuli",
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

const TimelineSidebar = ({
  sidebarOpen,
  toggleSiderbarOpen,
}: {
  sidebarOpen: boolean;
  toggleSiderbarOpen: () => void;
}) => {
  const searchParams = useSearchParams();
  const timelineId = searchParams.get("id");
  const { sourceData, steps, updateSteps } = useTimelineStore();
  const {
    blocks,
    mountStep,
    calculateRenderPosititon,
    clearEditor,
    addScreenBlock,
  } = useEditorStore();
  const {
    register,
    control,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TimelineStepFormData>({
    resolver: zodResolver(timelineStepSchema),
    defaultValues: {},
  });
  const [taskList, setTaskList] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<Option[]>(options);

  const openPreview = () => {
    const { title, type } = getValues();
    const timelineId = steps[0]?.timelineId;
    const positions = calculateRenderPosititon(steps);

    const timelineStepScreen = mountStep(timelineId, positions, type, title);
    console.log("timelineStepScreen", timelineStepScreen);

    if (timelineStepScreen.metadata.blocks.length === 0) {
      toast.error("The screen is empty. Please add at least one block.");
      return;
    }

    const previewWindow = window.open(
      `/preview?id=${timelineStepScreen.id}`,
      "_blank"
    );
    if (previewWindow) {
      // previewWindow.name = JSON.stringify({ steps: blocks });
      previewWindow.name = JSON.stringify({ steps: [timelineStepScreen] });
    }
  };

  const onSubmit = () => {
    const { title, type } = getValues();
    const timelineId = steps[0]?.timelineId;
    const positions = calculateRenderPosititon(steps);

    const timelineStepScreen = mountStep(timelineId, positions, type, title);

    if (timelineStepScreen.metadata.blocks.length === 0) {
      toast.error("The screen is empty. Please add at least one block.");
      return;
    }

    // update to save in the backend
    updateSteps(timelineStepScreen);
    toggleSiderbarOpen();
    toast.success("Step added successfully!");
    setValue("title", "");
    setValue("type", "");
    setValue("task", "");
    setTaskList([]);
    setTypeOptions(options);
    clearEditor();
  };

  useEffect(() => {
    addScreenBlock();
  }, [steps]);

  useEffect(() => {
    if (watch("type") === "task") {
      // getTasks
      setTaskList(mockTasks);
      return;
    }

    setTaskList([]);
    setValue("task", "");
  }, [watch("type")]);

  return (
    <ResizableSidebar isOpen={sidebarOpen} onClose={toggleSiderbarOpen}>
      <Toaster position="top-right" richColors />
      <div className="flex w-full h-full items-center gap-10">
        {/* Lefftside */}
        <div className="max-w-2xl w-full">
          {/* Header */}
          <h2 className="text-2xl mb-4">Adding step to the timeline</h2>
          <p className=" mb-4">{sourceData?.title}</p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-light text-xs text-gray-400">
                  Title
                </label>
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    Title is required
                  </span>
                )}
              </div>
              <input
                {...register("title")}
                className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Step title"
              />
            </div>

            {/* Type  */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-light text-xs text-gray-400">Type</label>

                {errors.type && (
                  <span className="text-red-500 text-xs">
                    Type is requireds
                  </span>
                )}
              </div>
              <CustomSelect
                value={watch("type") || null}
                onChange={(val) => {
                  setValue("type", val);
                  if (errors.type) {
                    delete errors.type;
                  }
                }}
                options={typeOptions}
              />
            </div>

            {/* Custom Input depending on type */}

            {watch("type") === "task" && taskList && (
              <>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-light text-xs text-gray-400">
                      Task
                    </label>
                    {errors.task && (
                      <span className="text-red-500 text-xs">
                        Task is required
                      </span>
                    )}
                  </div>
                  <CustomSelect
                    value={watch("task") || null}
                    onChange={(val) => {
                      setValue("task", val);
                      if (errors.task) {
                        delete errors.task;
                      }
                    }}
                    options={taskList.map((task) => ({
                      value: task.id,
                      label: task.name,
                    }))}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col space-y-1 relative">
              <div className="flex items-center justify-between">
                <label className="font-light text-xs text-gray-400">
                  Screen
                </label>
                <div>
                  <button
                    onClick={openPreview}
                    className="text-xs cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>
              {/* Preview */}
              <ScreenEditor key={sourceData?.id} />
            </div>

            {/* Footer */}
            <div className="flex items-center mt-4 gap-8">
              {/* Media */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Media</span>

                <MediaTypeBlocks />
              </div>

              {/* Triggers */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Triggers</span>
                <TriggerButtons />
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSubmit(onSubmit)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>

        {/* Rightside */}
        <div className="w-full max-w-96 bg-[#EBEFFF] h-full max-h-[660px] p-6 relative">
          <TimelineStepOrder
            draftTitle={watch("title")}
            draftType={watch("type")}
          />
        </div>
      </div>
    </ResizableSidebar>
  );
};

export default TimelineSidebar;
