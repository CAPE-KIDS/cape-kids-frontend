import ResizableSidebar from "@/components/ResizableSidebar";
import { useExperimentStore } from "@/stores/experimentStore";
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
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomSelect from "@/components/CustomSelect";

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

const TimelineSidebar = ({
  sidebarOpen,
  toggleSiderbarOpen,
}: {
  sidebarOpen: boolean;
  toggleSiderbarOpen: () => void;
}) => {
  const { experimentData } = useExperimentStore();
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

  return (
    <ResizableSidebar isOpen={sidebarOpen} onClose={toggleSiderbarOpen}>
      <div className="max-w-2xl">
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
            />
            {errors.type && (
              <span className="text-red-500 text-xs">
                {errors.type.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1 ">
            <label className="font-light text-xs text-gray-400">Screen</label>
            {/* Preview */}
            <div className="bg-[#E8EBFB] rounded-md p-4 h-[360px] flex flex-col gap-2">
              <div className="border border-dashed p-2 rounded-sm flex items-center justify-between text-sm text-black">
                For more information contact me
                <MoreVertical className="w-4 h-4 cursor-pointer" />
              </div>

              <div className="border border-dashed p-2 rounded-sm flex items-center justify-between text-sm text-black">
                matheus.felizardo2@gmail.com
                <MoreVertical className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center mt-4 gap-8">
            {/* Media */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Media</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer">
                  <Type size={20} />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer">
                  <Image size={20} />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer">
                  <Video size={20} />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer">
                  <Headphones size={20} />
                </button>
              </div>
            </div>

            {/* Triggers */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Triggers</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer text-xs">
                  <Mouse size={20} />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer">
                  <Keyboard size={20} />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer">
                  <Clock size={20} />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer">
                  <Mic size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm">
            Save
          </button>
        </div>
      </div>
    </ResizableSidebar>
  );
};

export default TimelineSidebar;
