import { Toggle } from "@/components/Toggle";
import { Tooltip } from "@/components/Tooltip";
import { StimuliBlockConfig } from "@/modules/timeline/types";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import React from "react";

const SequentialStimuliConfigForm = () => {
  const { open, config, setConfig, updateStimulusStepsConfigField } =
    useStimuliModal();

  if (!open) return null;

  const handleChange = <K extends keyof StimuliBlockConfig>(
    field: K,
    value: StimuliBlockConfig[K]
  ) => {
    setConfig({ [field]: value });
    updateStimulusStepsConfigField(field, value);
  };

  return (
    <div className="flex w-full gap-16 border-b border-gray-300 pb-4">
      <div className="w-1/2 flex flex-col gap-2">
        <label className="flex items-center justify-between gap-4">
          <div className="flex min-w-[182px]">
            Number of Trials{" "}
            <Tooltip>
              Number of time that this block of stimulus will be repeated
            </Tooltip>
          </div>
          <input
            type="number"
            value={config.trials}
            onChange={(e) => handleChange("trials", Number(e.target.value))}
            className="w-full border rounded px-2 py-1 mt-1 flex-1"
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-[182px]">
            Stimuli Duration (ms)
            <Tooltip>Time that each stimulus is shown on the screen</Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.stimulusDuration !== null}
              onChange={() => {
                if (!config.stimulusDuration) {
                  handleChange("stimulusDuration", 2000);
                } else {
                  handleChange("stimulusDuration", null);
                }
              }}
            />
            {config.stimulusDuration === null ? (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                Disabled
              </div>
            ) : (
              <input
                type="number"
                value={config.stimulusDuration}
                onChange={(e) =>
                  handleChange("stimulusDuration", Number(e.target.value))
                }
                className="w-full border rounded px-2 py-1 mt-1 flex-1"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-[165px]">
            Inter Stimuli Interval (ms)
            <Tooltip>Time between one stimuli and another</Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.interStimulusInterval !== null}
              onChange={() => {
                if (!config.interStimulusInterval) {
                  handleChange("interStimulusInterval", 1000);
                } else {
                  handleChange("interStimulusInterval", null);
                }
              }}
            />

            {config.interStimulusInterval === null ? (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                Disabled
              </div>
            ) : (
              <input
                type="number"
                value={config.interStimulusInterval}
                onChange={(e) =>
                  handleChange("interStimulusInterval", Number(e.target.value))
                }
                className="w-full border rounded px-2 py-1 mt-1 flex-1"
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col gap-2">
        <label className="flex items-center gap-4">
          <div className="min-w-[192px]">
            Advance on wrong answer
            <Tooltip>
              If enabled, the block will advance to the next trial if the
              participant answers incorrectly. If disabled, the block will wait
              for the participant to answer correctly before advancing.
            </Tooltip>
          </div>
          <Toggle
            checked={config.advanceOnWrong}
            onChange={(value) => handleChange("advanceOnWrong", value)}
          />
        </label>

        <label className="flex items-center gap-4 ">
          <div className="min-w-[192px]">
            Show Feedback
            <Tooltip>This is the feedback shown after each trial</Tooltip>
          </div>
          <Toggle
            checked={config.showFeedback}
            onChange={(value) => handleChange("showFeedback", value)}
          />
        </label>

        <label className="flex items-center gap-4">
          <div className="min-w-[192px]">
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
