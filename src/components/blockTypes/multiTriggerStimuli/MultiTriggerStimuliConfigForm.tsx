import LevelConfigModal from "@/components/modals/LevelConfigModal";
import ModalBase from "@/components/modals/ModalBase";
import { Toggle } from "@/components/Toggle";
import { Tooltip } from "@/components/Tooltip";
import { StimuliBlockConfig } from "@/modules/timeline/types";
import { useMultiTriggerStimuliModal } from "@/stores/timeline/blockTypes/multiTriggerStimuliStore";
import { Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const MultiTriggerStimuliConfigForm = () => {
  const { t } = useTranslation("common");
  const { open, config, setConfig, updateStimulusStepsConfigField } =
    useMultiTriggerStimuliModal();

  const [showLevelModal, setShowLevelModal] = useState(false);

  if (!open) return null;

  const handleChange = <K extends keyof StimuliBlockConfig>(
    field: K,
    value: StimuliBlockConfig[K]
  ) => {
    setConfig({ [field]: value });
    updateStimulusStepsConfigField(field, value);
  };

  useEffect(() => {
    console.log("current config", config);
  }, [config]);

  return (
    <div className="flex w-full gap-x-16 gap-y-4 border-b border-gray-300 pb-4 flex-wrap">
      <div className="max-w-full lg:max-w-[45%] flex flex-col gap-2">
        <label className="flex items-center justify-between gap-4">
          <div className="flex max-w-[215px] w-full">
            {t("number_of_trials")}
            <Tooltip>{t("tooltip_number_of_trials")}</Tooltip>
          </div>
          <input
            type="number"
            value={config.trials}
            onChange={(e) => handleChange("trials", Number(e.target.value))}
            className="w-full border rounded px-2 py-1 mt-1 flex-1"
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <div className="flex max-w-[215px] w-full">
            {t("stimuli_duration")} (ms)
            <Tooltip>{t("tooltip_stimuli_duration")}</Tooltip>
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
                {t("disabled")}
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
          <div className="flex max-w-[215px] w-full">
            {t("inter_stimuli_interval")} (ms)
            <Tooltip>{t("tooltip_inter_stimuli_interval")}</Tooltip>
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
                {t("disabled")}
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

        <div className="flex items-center justify-between gap-4 max-w-[380px]">
          <div className="flex max-w-[215px] w-full">
            Level
            <Tooltip>{t("tooltip_level")}</Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.isLevel !== false}
              onChange={() => {
                if (!config.isLevel) {
                  handleChange("isLevel", true);
                } else {
                  handleChange("isLevel", false);
                  handleChange("level", {
                    level: "",
                    repeatAmount: undefined,
                    onWrongAnswer: undefined,
                    repeatOnWrong: undefined,
                    goToStepId: undefined,
                  });
                }
              }}
            />

            {config.isLevel ? (
              <button
                className="w-full border rounded px-2 py-1 mt-1 flex-1 cursor-pointer flex items-center justify-center gap-1"
                onClick={() => setShowLevelModal(true)}
              >
                <span>{t("settings")}</span>
                <Settings className="inline ml-1 h-4 w-4" />
              </button>
            ) : (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                {t("disabled")}
              </div>
            )}

            {showLevelModal && (
              <LevelConfigModal
                setShowLevelModal={setShowLevelModal}
                config={config}
                setConfig={setConfig}
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-full w-full md:w-auto md:min-w-[408px] flex flex-col gap-2">
        <label className="flex items-center gap-4">
          <div className="max-w-[210px] w-full">
            {t("practice")}
            <Tooltip>{t("tooltip_practice")}</Tooltip>
          </div>
          <Toggle
            checked={config.isPractice}
            onChange={(value) => handleChange("isPractice", value)}
          />
        </label>

        <label className="flex items-center gap-4">
          <div className="max-w-[210px] w-full">
            {t("advance_on_wrong")}
            <Tooltip>{t("tooltip_advance_on_wrong")}</Tooltip>
          </div>
          <Toggle
            checked={config.advanceOnWrong}
            onChange={(value) => handleChange("advanceOnWrong", value)}
          />
        </label>

        <div className="flex items-center gap-4 ">
          <div className="max-w-[210px] w-full">
            {t("show_feedback")}
            <Tooltip>{t("tooltip_show_feedback")}</Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.feedbackDuration !== null}
              onChange={(value) => {
                if (!config.feedbackDuration) {
                  handleChange("feedbackDuration", 1000);
                } else {
                  handleChange("feedbackDuration", null);
                }
              }}
            />
            {config.feedbackDuration === null ? (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                {t("disabled")}
              </div>
            ) : (
              <div className="relative flex-1 max-w-26">
                <input
                  type="number"
                  value={config.feedbackDuration}
                  onChange={(e) => {
                    if (+e.target.value > 10000) {
                      toast.error(
                        "Feedback duration cannot be greater than 10 seconds"
                      );
                      handleChange("feedbackDuration", Number(10000));
                      return;
                    }
                    handleChange("feedbackDuration", Number(e.target.value));
                  }}
                  className="w-full border rounded px-2 py-1 mt-1 flex-1 "
                />
                <span className="text-sm text-gray-500 absolute right-8 bottom-[5px] pointer-events-none">
                  ms
                </span>
              </div>
            )}
          </div>
        </div>

        <label className="flex items-center gap-4">
          <div className="max-w-[210px] w-full">
            {t("randomize_order")}
            <Tooltip>{t("tooltip_randomize_order")}</Tooltip>
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

export default MultiTriggerStimuliConfigForm;
