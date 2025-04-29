// components/SequentialStimuliEditorModal.tsx
import ModalBase from "@/components/ModalBase";
import { ScreenEditor } from "@/components/ScreenEditor/ScreenEditor";
import { Toggle } from "@/components/Toggle";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import TriggerButtons from "@/modules/triggers/components/TriggerButtons";
import TriggerManager from "@/modules/triggers/components/TriggerManager";
import { useEditorStore } from "@/stores/editor/useEditorStore";
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

const SequentialStimuliEditorModal = () => {
  const {
    stimulusEditorOpen,
    closeStimulusEditorModal,
    config,
    mountStimulusStep,
    editingStep,
    setEditingStep,
    updateStimulusStep,
  } = useStimuliModal();

  const { blocks, clearEditor, addStep } = useEditorStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExperimentFormData>({
    resolver: zodResolver(formSchema),
  });

  const [overrideConfig, setOverrideConfig] = useState({
    displayRate: 1,
    overrideStimulus: false,
    stimulusDuration: config.stimulusDuration,
  });

  useEffect(() => {
    if (editingStep) {
      setValue("title", editingStep.metadata.title);
      clearEditor();
      (editingStep.metadata.blocks || []).forEach(addStep);
    }
  }, [editingStep]);

  const handleChange = (field: string, value: any) => {
    setOverrideConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = handleSubmit(({ title }) => {
    const hasBlocks = blocks.length > 1;
    const hasTrigger = blocks.some(
      (block) => block.triggers && block.triggers.length > 0
    );

    if (!hasBlocks) {
      toast.error("You must add at least one block.");
      return;
    }

    if (!hasTrigger) {
      toast.error("You must add at least one trigger.");
      return;
    }

    if (editingStep) {
      const updatedStep = {
        ...editingStep,
        metadata: {
          ...editingStep.metadata,
          title,
          blocks,
        },
      };
      updateStimulusStep(updatedStep);
      setEditingStep(null);
    } else {
      mountStimulusStep(blocks, title);
    }

    closeStimulusEditorModal();
    clearEditor();
    reset();
  });

  if (!stimulusEditorOpen) return null;

  return (
    <ModalBase
      title="Stimuli creation"
      onClose={() => {
        closeStimulusEditorModal();
        setEditingStep(null);
        clearEditor();
      }}
      styles="w-[900px]"
    >
      <div className="flex gap-8">
        <div className="w-lg">
          <div className="flex flex-col space-y-1 mb-4">
            <label className="font-light text-xs text-gray-400">Title</label>
            <input
              {...register("title")}
              className="bg-[#EBEFFF] rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Stimuli title"
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Screen</label>
            </div>
            <ScreenEditor />
          </div>
        </div>

        <div className="flex-1">
          <label className="flex items-center gap-2 mb-4 relative w-fit">
            <span className="text-xs">Display rate</span>
            <input
              type="number"
              className="border border-gray-300 rounded-lg p-2 text-xs"
              value={overrideConfig?.displayRate}
              onChange={(e) => {
                if (+e.target.value > config.trials) return;
                handleChange("displayRate", Number(e.target.value));
              }}
              max={config.trials}
              min={1}
            />
            <span className="text-xs text-gray-400 absolute right-8">
              /{config.trials}
            </span>
          </label>

          <div>
            <p className="text-xs mb-1">Override stimulus time?</p>
            <div className="flex gap-2">
              <Toggle
                checked={overrideConfig.overrideStimulus}
                onChange={(value) => handleChange("overrideStimulus", value)}
              />
              {overrideConfig.overrideStimulus && (
                <div>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-lg p-2 text-xs"
                    value={overrideConfig?.stimulusDuration}
                    onChange={(e) =>
                      handleChange("stimulusDuration", Number(e.target.value))
                    }
                  />
                </div>
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
            closeStimulusEditorModal();
            setEditingStep(null);
            clearEditor();
          }}
          className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          Save
        </button>
      </div>
    </ModalBase>
  );
};

export default SequentialStimuliEditorModal;
