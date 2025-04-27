import { Toggle } from "@/components/Toggle";
import { Tooltip } from "@/components/Tooltip";
import { StimuliBlockConfig } from "@/modules/timeline/types";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import React from "react";

const SequentialStimuliConfigForm = () => {
  const { open, closeModal, config, setConfig } = useStimuliModal();

  if (!open) return null;

  const handleChange = (field: keyof StimuliBlockConfig, value: any) => {
    setConfig({ [field]: value });
  };

  return (
    <div className="flex w-full gap-16 border-b border-gray-300 pb-4">
      <div className="w-1/2 flex flex-col gap-2">
        <label className="flex items-center justify-between gap-4">
          <div className="flex min-w-[165px]">
            Number of Trials <Tooltip>This is the number of trials</Tooltip>
          </div>
          <input
            type="number"
            value={config.trials}
            onChange={(e) => handleChange("trials", Number(e.target.value))}
            className="w-full border rounded px-2 py-1 mt-1 flex-1"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <div className="flex min-w-[165px]">
            Stimuli Time (ms)
            <Tooltip>This is the time each stimulus is shown</Tooltip>
          </div>
          <input
            type="number"
            value={config.stimulusDuration}
            onChange={(e) =>
              handleChange("stimulusDuration", Number(e.target.value))
            }
            className="w-full border rounded px-2 py-1 mt-1 flex-1"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <div className="flex min-w-[165px]">
            Inter Stimuli Time (ms)
            <Tooltip>This is the time between stimuli</Tooltip>
          </div>
          <input
            type="number"
            value={config.interStimulusInterval}
            onChange={(e) =>
              handleChange("interStimulusInterval", Number(e.target.value))
            }
            className="w-full border rounded px-2 py-1 mt-1 flex-1"
          />
        </label>
      </div>

      <div className="w-1/2 flex flex-col gap-2">
        <label className="flex items-center gap-4 ">
          <div className="min-w-[140px]">
            Show Feedback
            <Tooltip>This is the feedback shown after each trial</Tooltip>
          </div>
          <Toggle
            checked={config.showFeedback}
            onChange={(value) => handleChange("showFeedback", value)}
          />
        </label>

        <label className="flex items-center gap-4">
          <div className="min-w-[140px]">
            Randomize Order
            <Tooltip>
              This will randomize the order of the stimuli in each trial
            </Tooltip>
          </div>
          <Toggle
            checked={config.randomize}
            onChange={(value) => handleChange("randomize", value)}
          />
        </label>
      </div>
    </div>
  );
};

export default SequentialStimuliConfigForm;
