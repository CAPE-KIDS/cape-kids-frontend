import ModalBase from "@/components/ModalBase";
import { ScreenEditor } from "@/components/ScreenEditor/ScreenEditor";
import { Toggle } from "@/components/Toggle";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import TriggerButtons from "@/modules/triggers/components/TriggerButtons";
import TriggerManager from "@/modules/triggers/components/TriggerManager";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { randomUUID } from "crypto";
import { Settings } from "lucide-react";
import React, { useEffect, useState } from "react";

const SequentialStimuliEditorModal = () => {
  const {
    stimulusEditorOpen,
    closeStimulusEditorModal,
    config,
    mountStimulusStep,
  } = useStimuliModal();
  const { blocks, clearEditor } = useEditorStore();
  const [overrideConfig, setOverrideConfig] = useState({
    displayRate: 1,
    overrideStimulus: false,
    stimulusDuration: config.stimulusDuration,
  });

  const handleChange = (field: string, value: any) => {
    setOverrideConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    mountStimulusStep(blocks);
    closeStimulusEditorModal();
    clearEditor();
  };

  if (!stimulusEditorOpen) return null;

  return (
    <ModalBase
      title="Stimuli creation"
      onClose={closeStimulusEditorModal}
      styles="w-[900px]"
    >
      <div className="flex flex-col space-y-1">
        <div className="flex gap-8">
          <div className="w-lg">
            <ScreenEditor key={JSON.stringify(blocks || randomUUID())} />
          </div>

          <div className="flex-1">
            <label className="flex items-center gap-2 mb-4 relative w-fit">
              <span className="text-xs">Display rate</span>
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-2 text-xs"
                placeholder="Display rate"
                value={overrideConfig?.displayRate}
                onChange={(e) => {
                  if (+e.target.value > config.trials) {
                    return config.trials;
                  }
                  handleChange("displayRate", Number(e.target.value));
                }}
                max={config.trials}
                min={1}
              />
              <span className="text-xs text-gray-400 absolute right-8">
                /{config.trials}
              </span>
            </label>

            <div className="">
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
                      placeholder="Display rate"
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
            onClick={() => {
              closeStimulusEditorModal();
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
      </div>
    </ModalBase>
  );
};

export default SequentialStimuliEditorModal;
