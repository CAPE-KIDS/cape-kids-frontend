import ResizableSidebar from "@/components/ResizableSidebar";
import { useExperimentStore } from "@/stores/experiment/experimentStore";
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomSelect, { Option } from "@/components/CustomSelect";
import { ScreenEditor } from "@/components/ScreenEditor/ScreenEditor";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import TriggerButtons from "@/modules/triggers/components/TriggerButtons";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { mockSteps } from "@/modules/canvas/mock";

const timelineStepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum([
    "start",
    "task",
    "conditional",
    "sequential_stimuli",
    "simultaneos_stimuli",
    "block",
    "end",
  ]),
  metadata: z
    .record(
      z.object({
        name: z.string(),
        positionX: z.number().optional(),
        positionY: z.number().optional(),
      })
    )
    .optional(),
  orderIndex: z.number().optional(),
});
type TimelineStepFormData = z.infer<typeof timelineStepSchema>;

const options: Option[] = [
  { value: "start", label: "Start", color: "#1E1E1E" },
  { value: "task", label: "Task", color: "#3B82F6" },
  { value: "custom_block", label: "Custom block", color: "#F97316" },
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
  { value: "end", label: "End", color: "#EF4444" },
];

const TimelineSidebar = ({
  sidebarOpen,
  toggleSiderbarOpen,
}: {
  sidebarOpen: boolean;
  toggleSiderbarOpen: () => void;
}) => {
  const { experimentData } = useExperimentStore();
  const { blocks, mountStep } = useEditorStore();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TimelineStepFormData>({
    resolver: zodResolver(timelineStepSchema),
    defaultValues: {},
  });

  const onSubmit = (data: TimelineStepFormData) => {
    console.log(data);
  };

  const openPreview = () => {
    const mountedScreen = mountStep();
    const previewWindow = window.open("/preview?id=custom", "_blank");
    if (previewWindow) {
      // previewWindow.name = JSON.stringify({ steps: blocks });
      previewWindow.name = JSON.stringify({ steps: [mountedScreen] });
    }
  };

  return (
    <ResizableSidebar isOpen={sidebarOpen} onClose={toggleSiderbarOpen}>
      <div className="flex w-full h-full items-center gap-10">
        {/* Lefftside */}
        <div className="max-w-2xl w-full">
          {/* Header */}
          <h2 className="text-2xl mb-4">Adding step to the timeline</h2>
          <p className=" mb-4">{experimentData?.name}</p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1">
              <label className="font-light text-xs text-gray-400">Title</label>
              <input
                {...register("title")}
                className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Experiment title"
              />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Type com React-Select */}
            <div className="flex flex-col space-y-1">
              <label className="font-light text-xs text-gray-400">Type</label>
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

            <div className="flex flex-col space-y-1 ">
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
              <ScreenEditor key={experimentData?.id} />
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
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm">
              Save
            </button>
          </div>
        </div>

        {/* Rightside */}
        <div className="w-full max-w-96 bg-[#EBEFFF] h-full max-h-[660px] p-6">
          <h2>Step order</h2>
        </div>
      </div>
    </ResizableSidebar>
  );
};

export default TimelineSidebar;
