import ModalBase from "@/components/modals/ModalBase";
import { ScreenEditor } from "@/components/ScreenEditor/ScreenEditor";
import { Toggle } from "@/components/Toggle";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import TriggerButtons from "@/modules/triggers/components/TriggerButtons";
import TriggerManager from "@/modules/triggers/components/TriggerManager";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { useMultiTriggerStimuliModal } from "@/stores/timeline/blockTypes/multiTriggerStimuliStore";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
type ExperimentFormData = z.infer<typeof formSchema>;

const MultiTriggerStimuliEditorModal = () => {
  const {
    multiTriggerStimulusEditorOpen,
    closeMultiTriggerStimulusEditorModal,
    config,
    mountStimulusStep,
    editingStep,
    setEditingStep,
    updateStimulusStep,
  } = useMultiTriggerStimuliModal();

  const { blocks, clearEditor, addStep } = useEditorStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExperimentFormData>({
    resolver: zodResolver(formSchema),
  });

  const [overrideConfig, setOverrideConfig] = useState({
    displayRate: 1,
    overrideStimulusDuration: false,
    isPractice: config.isPractice || false,
    stimulusDuration: config.stimulusDuration || 2000,
    overrideInterStimulusInterval: false,
    interStimulusInterval: config.interStimulusInterval || 1000,
    isLevel: config.isLevel || false,
    level: config.level || {
      level: "1",
      repeatOnWrong: false,
      repeatAmount: 1,
      onWrongAnswer: "goToNextStep",
    },
  });

  useEffect(() => {
    console.log("Editing step:", editingStep);
    if (editingStep) {
      const { title, config: stepConfig } = editingStep.metadata;

      setValue("title", title);
      clearEditor();
      (editingStep.metadata.blocks || []).forEach(addStep);

      setOverrideConfig({
        displayRate: stepConfig?.displayRate ?? 1,
        overrideStimulusDuration: stepConfig?.overrideStimulusDuration ?? false,
        isPractice: stepConfig?.isPractice ?? false,
        stimulusDuration:
          stepConfig?.stimulusDuration ?? config.stimulusDuration,
        overrideInterStimulusInterval:
          stepConfig?.overrideInterStimulusInterval ?? false,
        interStimulusInterval:
          stepConfig?.interStimulusInterval ?? config.interStimulusInterval,
        isLevel: stepConfig?.isLevel ?? false,
        level: stepConfig?.level || {
          level: "1",
          repeatOnWrong: false,
          repeatAmount: 1,
          onWrongAnswer: "goToNextStep",
        },
      });
    }
  }, [editingStep]);

  const handleChange = (field: string, value: any) => {
    setOverrideConfig((prev) => ({ ...prev, [field]: value }));
  };

  const resetOverrideConfig = () => {
    setOverrideConfig({
      displayRate: 1,
      overrideStimulusDuration: false,
      isPractice: config.isPractice || false,
      stimulusDuration: config.stimulusDuration || 2000,
      overrideInterStimulusInterval: false,
      interStimulusInterval: config.interStimulusInterval || 1000,
      isLevel: config.isLevel || false,
      level: config.level || {
        level: "1",
        repeatOnWrong: false,
        repeatAmount: 1,
        onWrongAnswer: "goToNextStep",
      },
    });
  };

  const handleSave = handleSubmit(({ title }) => {
    const hasBlocks = blocks.length > 1;
    const hasTrigger = blocks.some(
      (block) => block.triggers && block.triggers.length > 0
    );

    if (!hasBlocks) return toast.error("You must add at least one block.");
    if (!hasTrigger) return toast.error("You must add at least one trigger.");

    const commonMetadata = {
      title,
      blocks,
      config: {
        ...config,
        displayRate: overrideConfig.displayRate,
        stimulusDuration: overrideConfig.overrideStimulusDuration
          ? overrideConfig.stimulusDuration
          : config.stimulusDuration,
        interStimulusInterval: overrideConfig.overrideInterStimulusInterval
          ? overrideConfig.interStimulusInterval
          : config.interStimulusInterval,
        overrideStimulusDuration: overrideConfig.overrideStimulusDuration,
        overrideInterStimulusInterval:
          overrideConfig.overrideInterStimulusInterval,
      },
    };

    if (editingStep) {
      updateStimulusStep({
        ...editingStep,
        metadata: {
          ...editingStep.metadata,
          ...commonMetadata,
        },
      });
      setEditingStep(null);
    } else {
      mountStimulusStep(blocks, title, overrideConfig);
    }

    closeMultiTriggerStimulusEditorModal();
    clearEditor();
    reset();
    resetOverrideConfig();
    toast.success("Stimuli saved successfully.");
  });

  if (!multiTriggerStimulusEditorOpen) return null;

  return (
    <ModalBase
      title="Stimuli creation"
      onClose={() => {
        closeMultiTriggerStimulusEditorModal();
        setEditingStep(null);
        clearEditor();
        resetOverrideConfig();
        reset();
      }}
      styles="w-[900px]"
    >
      <div className="flex gap-8">
        <div className="w-lg">
          <div className="flex flex-col space-y-1 mb-4">
            <label className="font-light text-xs text-gray-400">Title</label>
            <input
              {...register("title")}
              className="bg-[#EBEFFF] rounded-lg p-2"
              placeholder="Stimuli title"
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-400">Screen</label>
            <ScreenEditor />
          </div>
        </div>

        <div className="flex-1">
          <label className="flex items-center gap-2 mb-4 relative w-fit">
            <span className="text-xs">Display rate</span>
            <input
              type="number"
              className="border border-gray-300 rounded-lg p-2 text-xs"
              value={overrideConfig.displayRate}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= config.trials) handleChange("displayRate", value);
              }}
              max={config.trials}
              min={1}
            />
            <span className="text-xs text-gray-400 absolute right-8">
              /{config.trials}
            </span>
          </label>

          {/* Stimulus duration toggle */}
          <div>
            <p className="text-xs mb-1">Override stimulus time?</p>
            <div className="flex gap-2">
              <Toggle
                checked={overrideConfig.overrideStimulusDuration}
                onChange={(value) => {
                  handleChange("overrideStimulusDuration", value);
                  if (!value)
                    handleChange("stimulusDuration", config.stimulusDuration);
                }}
              />
              {overrideConfig.overrideStimulusDuration && (
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 text-xs"
                  value={overrideConfig.stimulusDuration || 2000}
                  onChange={(e) =>
                    handleChange("stimulusDuration", Number(e.target.value))
                  }
                />
              )}
            </div>
          </div>

          {/* Inter-stimulus interval toggle */}
          <div className="mt-2">
            <p className="text-xs mb-1">Override inter stimulus time?</p>
            <div className="flex gap-2">
              <Toggle
                checked={overrideConfig.overrideInterStimulusInterval}
                onChange={(value) => {
                  handleChange("overrideInterStimulusInterval", value);
                  if (!value)
                    handleChange(
                      "interStimulusInterval",
                      config.interStimulusInterval
                    );
                }}
              />
              {overrideConfig.overrideInterStimulusInterval && (
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 text-xs"
                  value={overrideConfig.interStimulusInterval || 1000}
                  onChange={(e) =>
                    handleChange(
                      "interStimulusInterval",
                      Number(e.target.value)
                    )
                  }
                />
              )}
            </div>
          </div>

          <TriggerManager />
        </div>
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

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => {
            closeMultiTriggerStimulusEditorModal();
            setEditingStep(null);
            clearEditor();
            resetOverrideConfig();
            reset();
          }}
          className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </ModalBase>
  );
};

export default MultiTriggerStimuliEditorModal;
