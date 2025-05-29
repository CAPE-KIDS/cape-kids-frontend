// components/TimelineSidebar.tsx
import ResizableSidebar from "@/components/ResizableSidebar";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import { useTimelineSidebar } from "@/stores/timeline/sidebarStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomSelect, { Option } from "@/components/CustomSelect";
import { ScreenEditor } from "@/components/ScreenEditor/ScreenEditor";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import TriggerButtons from "@/modules/triggers/components/TriggerButtons";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { toast } from "sonner";
import { TimelineStepOrder } from "./TimelineStepOrder";
import TriggerManager from "@/modules/triggers/components/TriggerManager";
import { MonitorPlay, Settings, Trash } from "lucide-react";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { useMultiTriggerStimuliModal } from "@/stores/timeline/blockTypes/multiTriggerStimuliStore";
import { StepType, stepTypeEnum } from "@shared/timeline";
import _, { get } from "lodash";
import { useAuth } from "@/hooks/useAuth";

const timelineStepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: stepTypeEnum,
  task: z.string().optional(),
});
type TimelineStepFormData = z.infer<typeof timelineStepSchema>;

export const options: Option[] = [
  {
    value: "custom_block",
    label: "Custom block",
    color: "#333",
    showScreen: true,
  },
  { value: "task", label: "Task", color: "#3B82F6", showScreen: false },
  {
    value: "conditional",
    label: "Conditional",
    color: "#34C759",
    showScreen: false,
  },
  {
    value: "sequential_stimuli",
    label: "Sequential Stimuli",
    color: "#8F1D99",
    onSelect: () => {
      const { openModal } = useStimuliModal.getState();
      openModal();
    },
    showScreen: false,
  },
  // {
  //   value: "simultaneous_stimuli",
  //   label: "Simultaneous Stimuli",
  //   color: "#1D8499",
  //   showScreen: false,
  // },
  {
    value: "multi_trigger_stimuli",
    label: "Multi Trigger Stimuli",
    color: "#FF8C00",
    onSelect: () => {
      const { openModal } = useMultiTriggerStimuliModal.getState();
      openModal();
    },
    showScreen: false,
  },
];

const TimelineSidebar = () => {
  const { token } = useAuth();
  const {
    steps,
    sourceData,
    updateSteps,
    removeStep,
    saveStep,
    timelineId,
    resetTimeline,
    tasks,
  } = useTimelineStore();
  const { sidebarOpen, currentStep, closeSidebar } = useTimelineSidebar();

  const {
    blocks,
    mountStep,
    calculateRenderPosititon,
    clearEditor,
    addScreenBlock,
    addStep,
    pushHistory,
    historyStack,
    stepFiles,
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

  const onSubmit = async () => {
    if (!token) return;

    const { title, type } = getValues();
    const positions = currentStep
      ? {
          index: currentStep.orderIndex,
          x: currentStep.metadata.positionX,
          y: currentStep.metadata.positionY,
        }
      : calculateRenderPosititon(steps);

    const newStep = mountStep(timelineId, positions, type, title);

    if (type === "sequential_stimuli") {
      const { config, steps } = useStimuliModal.getState();
      newStep.metadata.group = {
        config,
        steps,
      };
    }

    if (type === "multi_trigger_stimuli") {
      const { config, steps } = useMultiTriggerStimuliModal.getState();
      newStep.metadata.group = {
        config,
        steps,
      };
    }

    if (type === "task") {
      newStep.metadata.taskId = watch("task");
    }

    if (currentStep) {
      console.log("newStep", newStep);
      // const updatedStep = await updatedStep(newStep, token);
      // updateSteps(updatedStep.data);
      // toast.success(
      //   currentStep ? "Step updated sucessfully!" : "Step created sucessfully!"
      // );
      // closeSidebar();
      // clearEditor();
      return;
    }

    const savedStep = await saveStep(newStep, token, stepFiles);
    if (savedStep.error) {
      toast.error("Error saving step");
      return;
    }
    updateSteps(savedStep.data);
    toast.success("Step created sucessfully!");
    closeSidebar();
    clearEditor();

    reset();
  };

  const handleRemove = async () => {
    if (!currentStep) return;

    await removeStep(currentStep.id);
    closeSidebar();
    clearEditor();
    resetTimeline();
    reset();
  };

  useEffect(() => {
    if (!sidebarOpen) {
      reset();
      clearEditor();
      return;
    }

    addScreenBlock();

    if (currentStep) {
      setValue("title", currentStep.metadata.title || "");
      setValue("type", currentStep.type as any);

      if (currentStep.type === "task") {
        setValue("task", currentStep.metadata.taskId || "");
      }

      if (currentStep.metadata.group) {
        const { config, steps } = currentStep.metadata.group;

        if (currentStep.type === "multi_trigger_stimuli") {
          const { setConfig } = useMultiTriggerStimuliModal.getState();
          setConfig(config);
          useMultiTriggerStimuliModal.setState({
            steps,
          });
        }

        if (currentStep.type === "sequential_stimuli") {
          const { setConfig } = useStimuliModal.getState();

          setConfig(config);
          useStimuliModal.setState({
            steps,
          });
        }
      }

      clearEditor();
      (currentStep.metadata.blocks || []).forEach((block) => {
        addStep(block);
      });

      pushHistory(currentStep.type);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const type = watch("type");

    if (type === "sequential_stimuli") {
      useEditorStore.setState({
        blocks: [],
        editorContext: "stimuli",
      });
      return;
    }

    if (type === "multi_trigger_stimuli") {
      useEditorStore.setState({
        blocks: [],
        editorContext: "multi_trigger_stimuli",
      });
      return;
    }

    const historySnapshot = historyStack.find((step) => step.stepType === type);

    if (historySnapshot) {
      useEditorStore.setState({
        blocks: _.cloneDeep(historySnapshot.blocks),
      });
    } else {
      useEditorStore.setState({
        blocks: [],
      });
    }
  }, [watch("type")]);

  const handleConfig = () => {
    const selectedModal = options.find((opt) => opt.value === watch("type"));
    if (selectedModal?.onSelect) {
      selectedModal.onSelect();
    }
  };

  return (
    <ResizableSidebar
      isOpen={sidebarOpen}
      onClose={() => {
        closeSidebar();
      }}
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex gap-10 p-6 flex-col lg:flex-row flex-1 ">
          {/* Right Panel */}
          <div className="max-w-2xl pr-4 w-full flex-1">
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
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400">Type</label>
                  {options.find((opt) => opt.value === watch("type"))
                    ?.onSelect && (
                    <Settings
                      width={16}
                      className="cursor-pointer"
                      onClick={handleConfig}
                    />
                  )}
                </div>
                <CustomSelect
                  value={watch("type") || null}
                  onChange={(val) => {
                    const { blocks } = useEditorStore.getState();
                    const currentStepType = watch("type");

                    pushHistory(currentStepType as StepType);

                    const selected = options.find((opt) => opt.value === val);
                    if (selected?.onSelect) {
                      selected.onSelect();
                    }

                    setValue("type", val);
                  }}
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
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">Task</label>

                      {watch("task") && (
                        <div>
                          <button
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => {
                              window.open(
                                `/preview?id=${watch("task")}`,
                                "_blank"
                              );
                            }}
                          >
                            <MonitorPlay
                              size={16}
                              className="text-gray-500 hover:text-gray-700"
                            />
                            <span className="text-xs ">Preview</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <CustomSelect
                    value={watch("task") || null}
                    onChange={(val) => setValue("task", val)}
                    options={tasks.map((t) => {
                      return {
                        value: t.task.id,
                        label: t.task.title,
                      };
                    })}
                  />
                </div>
              )}

              {/* Editor */}
              {options.find((opt) => opt.value === watch("type"))
                ?.showScreen && (
                <>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">Screen</label>
                    </div>
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
                </>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:max-w-96 bg-[#EBEFFF] h-full max-h-[660px] p-6 relative flex-1">
            <TimelineStepOrder
              draftTitle={watch("title")}
              draftType={watch("type")}
            />
            {options.find((opt) => opt.value === watch("type"))?.showScreen && (
              <TriggerManager />
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-between items-center mb-6 max-w-96 mx-6">
          {/* Submit */}
          <button
            onClick={handleSubmit(onSubmit)}
            className="w-md flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm cursor-pointer"
          >
            {currentStep ? "Update" : "Save"}
          </button>

          {currentStep && (
            <button
              onClick={handleRemove}
              className="group w-fit flex items-center justify-center gap-2 text-red-600 hover:text-red-700 text-sm cursor-pointer"
            >
              <Trash size={16} className="group-hover:animate-bounce" />
              Remove step
            </button>
          )}
        </div>
      </div>
    </ResizableSidebar>
  );
};

export default TimelineSidebar;
