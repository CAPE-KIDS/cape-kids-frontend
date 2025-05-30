import React, { useEffect, useMemo } from "react";
import ModalBase from "./ModalBase";
import {
  StimuliBlockConfig,
  WrongAnswerOptions,
} from "@/modules/timeline/types";
import { Tooltip } from "../Tooltip";
import { Toggle } from "../Toggle";
import { toast } from "sonner";
import CustomSelect from "../CustomSelect";
import { useTimelineStore } from "@/stores/timeline/timelineStore";
import { TriggerActionType } from "@/modules/triggers/types";
import { TriggerActionsRegistry } from "@/modules/triggers/TriggerActionsRegistry";

interface LevelConfigModalProps {
  setShowLevelModal: (show: boolean) => void;
  config: StimuliBlockConfig;
  setConfig: (data: Partial<StimuliBlockConfig>) => void;
}

const LevelConfigModal = ({
  setShowLevelModal,
  setConfig,
  config,
}: LevelConfigModalProps) => {
  const { steps } = useTimelineStore();
  const handleChange = <K extends keyof StimuliBlockConfig>(
    field: K,
    value: StimuliBlockConfig[K]
  ) => {
    setConfig({ [field]: value });
  };

  const options = Object.values(TriggerActionsRegistry).map((action) => ({
    value: action.type,
    label: action.label,
  }));

  const formatedStep = useMemo(() => {
    return steps.map((step) => ({
      value: step.id,
      label: step.metadata.title || `Step ${step.id}`,
    }));
  }, [steps]);

  return (
    <ModalBase title="Levels" onClose={() => setShowLevelModal(false)}>
      <div>
        {/* <p className="text-sm text-gray-500 mb-2">
          Levels are used to pass different settings for 
        </p> */}
        <div>
          <label className="flex items-center gap-4">
            <div className="min-w-[180.5px]">Title</div>
            <input
              type="text"
              value={config.level?.level || ""}
              onChange={(e) =>
                handleChange("level", {
                  level: e.target.value,
                  repeatAmount: config.level?.repeatAmount || 1,
                  onWrongAnswer: config.level?.onWrongAnswer || "continue",
                  repeatOnWrong: config.level?.repeatOnWrong || false,
                })
              }
              className="w-full border rounded px-2 py-1 mt-1 flex-1"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-[180.5px]">
            Repeat on wrong answer
            <Tooltip>
              Defines if the step will be repeated after the wrong answer
            </Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.level?.repeatOnWrong || false}
              onChange={() => {
                if (!config.level?.repeatOnWrong) {
                  handleChange("level", {
                    level: config.level?.level || "",
                    onWrongAnswer: config.level?.onWrongAnswer || "continue",
                    repeatOnWrong: true,
                    repeatAmount: config.level?.repeatAmount || 1,
                  });
                } else {
                  handleChange("level", {
                    level: config.level?.level || "",
                    onWrongAnswer: config.level?.onWrongAnswer || "continue",
                    repeatOnWrong: false,
                    repeatAmount: config.level?.repeatAmount || 1,
                  });
                }
              }}
            />

            {config.level?.repeatOnWrong ? (
              <input
                type="number"
                value={config.level.repeatAmount}
                onChange={(e) => {
                  if (Number(e.target.value) < 1) {
                    toast.error("Repeat amount must be at least 1");
                    return;
                  }
                  handleChange("level", {
                    level: config.level?.level || "",
                    repeatAmount: Number(e.target.value),
                    onWrongAnswer: config.level?.onWrongAnswer || "continue",
                    repeatOnWrong: true,
                  });
                }}
                className="w-full border rounded px-2 py-1 mt-1 flex-1"
              />
            ) : (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                Disabled
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-[180.5px]">
            On wrong answer
            <Tooltip>
              Defines the action to be taken when the answer is wrong. This
              action will be performed after the last repeat.
            </Tooltip>
          </div>

          <CustomSelect
            options={options}
            value={config.level?.onWrongAnswer || "continue"}
            onChange={(value) => {
              handleChange("level", {
                level: config.level?.level || "",
                repeatAmount: config.level?.repeatAmount || 1,
                onWrongAnswer: value as WrongAnswerOptions,
                repeatOnWrong: config.level?.repeatOnWrong || true,
              });
            }}
            config={{
              wrapperStyle: "w-full",
              selectorStyle:
                "w-full border rounded px-2 py-1 mt-1 flex items-center justify-between truncate max-w-full cursor-pointer",
              optionsStyle:
                "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 truncate cursor-pointer max-w-full",
              dropdownStyle:
                "absolute z-10 bg-white border w-full mt-1 rounded-md shadow-sm max-h-60 overflow-y-auto",
              showToggle: true,
              placeholder: "Select an event",
            }}
          ></CustomSelect>
        </div>

        {config.level?.onWrongAnswer === "goToStep" && (
          <div className="w-full flex-1">
            <CustomSelect
              options={formatedStep}
              value={config.level?.goToStepId || ""}
              onChange={(value) => {
                handleChange("level", {
                  level: config.level?.level || "",
                  repeatAmount: config.level?.repeatAmount || 1,
                  onWrongAnswer: "goToStep",
                  repeatOnWrong: config.level?.repeatOnWrong || true,
                  goToStepId: value as string,
                });
              }}
              config={{
                wrapperStyle: "w-full",
                selectorStyle:
                  "w-full border rounded px-2 py-1 mt-1 flex items-center justify-between truncate max-w-full cursor-pointer",
                optionsStyle:
                  "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 truncate cursor-pointer max-w-full",
                dropdownStyle:
                  "absolute z-10 bg-white border w-full mt-1 rounded-md shadow-sm max-h-60 overflow-y-auto",
                showToggle: true,
                placeholder: "Select a step",
              }}
            ></CustomSelect>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={() => setShowLevelModal(false)}
          >
            Save
          </button>

          <button className="cancel">
            <span
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setShowLevelModal(false);
              }}
            >
              Close
            </span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default LevelConfigModal;
