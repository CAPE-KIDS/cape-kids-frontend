import React, { useState } from "react";
import ModalBase from "../../../../components/modals/ModalBase";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import CustomSelect from "@/components/CustomSelect";
import { random } from "lodash";
import { Trigger } from "../../types";
import { TriggerActionsRegistry } from "../../TriggerActionsRegistry";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
}

const timerActions = Object.values(TriggerActionsRegistry).map((action) => ({
  value: action.type,
  label: action.label,
}));

const TimerTriggerModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation("common");
  const { blocks, updateStep } = useEditorStore();
  const [delay, setDelay] = useState(3000); // em ms
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");

  const screenBlock = blocks.find((b) => b.type === "screen");

  const handleSave = () => {
    if (!screenBlock) return;

    if (!action) {
      toast.error(t("please_add_action"));
      return;
    }

    const triggerData = {
      id: random(1000, 9999).toString(),
      timeline_step_id: "1234-5678-9101",
      stimulus_id: screenBlock.id,
      metadata: {
        type: "timer",
        delay,
        description,
        action,
      },
    } as Trigger;

    updateStep({
      ...screenBlock,
      triggers: [...(screenBlock.triggers || []), triggerData],
    });

    onClose();
  };

  return (
    <ModalBase title="Timer Trigger" onClose={onClose}>
      <div className="flex flex-col gap-3 text-sm">
        {/* Delay */}
        <label>
          Delay (ms):
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="3000"
          />
        </label>

        {/* Action */}
        <div>
          <label>{t("action")}</label>
          <CustomSelect
            options={timerActions.map((action) => ({
              value: action.value,
              label: t(action.label),
            }))}
            value={action}
            onChange={setAction}
            config={{
              wrapperStyle: "w-full",
              selectorStyle:
                "w-full border rounded px-2 py-1 mt-1 flex items-center justify-between truncate max-w-full cursor-pointer",
              optionsStyle:
                "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 truncate max-w-full",
              dropdownStyle:
                "absolute z-10 bg-white border w-full mt-1 rounded-md shadow-sm max-h-60 overflow-y-auto",
              showToggle: true,
              placeholder: t("select_action"),
            }}
          />
        </div>

        {/* Description */}
        <label>
          {t("description")} ({t("optional")}):
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
            rows={2}
            placeholder={t("describe_trigger_action")}
          />
        </label>

        {/* Botões */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSave}
            className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default TimerTriggerModal;
