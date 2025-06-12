import React, { useState } from "react";
import ModalBase from "../../../../components/modals/ModalBase";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import CustomSelect, { Option } from "@/components/CustomSelect";
import { MediaBlock } from "@/modules/media/types";
import { capitalize, random } from "lodash";
import { Trigger } from "../../types";
import { TriggerActionsRegistry } from "../../TriggerActionsRegistry";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
}

const mouseEvents = [
  { value: "click", label: "click" },
  // { value: "hover", label: "Hover" },
  // { value: "wheel", label: "Wheel" },
  // { value: "rightClick", label: "Right Click" },
  // { value: "dragStart", label: "Drag Start" },
  // { value: "dragEnd", label: "Drag End" },
];

const mouseActions = Object.values(TriggerActionsRegistry).map((action) => ({
  value: action.type,
  label: action.label,
}));

const MouseTriggerModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation("common");
  const { blocks, addTriggerToBlock, updateStep } = useEditorStore();
  const [eventType, setEventType] = useState(mouseEvents[0].value);
  const [target, setTarget] = useState("");
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    const isBlock = blocks.find((block) => block.id === target);

    if (!target) {
      toast.error(t("please_add_target"));
      return;
    }

    if (!action) {
      toast.error(t("please_add_action"));
      return;
    }

    const triggerData = {
      id: random(1000, 9999).toString(),
      timeline_step_id: "1234-5678-9101",
      stimulus_id: target,
      metadata: {
        type: eventType,
        description,
        action,
      },
    } as Trigger;

    if (isBlock) {
      addTriggerToBlock(target, triggerData);
    }
    onClose();
  };

  const formatDisplay = (block: MediaBlock) => {
    if (block.type === "screen") {
      return {
        value: block.id,
        label: t("screen"),
      };
    }
    return {
      value: block.id,
      label: `${capitalize(block.type)} Media: ${block.data.text}`,
    };
  };

  return (
    <ModalBase title="Mouse Trigger" onClose={onClose}>
      <div className="flex flex-col gap-3 text-sm">
        {/* Event type */}
        <div>
          <label>{t("type")}</label>
          <CustomSelect
            options={mouseEvents.map((ev) => ({
              value: ev.value,
              label: t(ev.label) || ev.label,
            }))}
            value={eventType}
            onChange={(value) => setEventType(value)}
            config={{
              wrapperStyle: "w-full",
              selectorStyle:
                "w-full border rounded px-2 py-1 mt-1 flex items-center justify-between truncate max-w-full cursor-pointer",
              optionsStyle:
                "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 truncate cursor-pointer max-w-full",
              dropdownStyle:
                "absolute z-10 bg-white border w-full mt-1 rounded-md shadow-sm max-h-60 overflow-y-auto",
              showToggle: true,
              placeholder: t("select_event"),
            }}
          />
        </div>

        {/* Target */}
        <div>
          <label>{t("target")}</label>
          <CustomSelect
            options={[...(blocks.map((t) => formatDisplay(t)) as Option[])]}
            value={target}
            onChange={(value) => setTarget(value)}
            config={{
              wrapperStyle: "w-full",
              selectorStyle:
                "w-full border rounded px-2 py-1 mt-1 flex items-center justify-between truncate max-w-full cursor-pointer",
              optionsStyle:
                "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 truncate cursor-pointer max-w-full",
              dropdownStyle:
                "absolute z-10 bg-white border w-full mt-1 rounded-md shadow-sm max-h-60 overflow-y-auto",
              showToggle: true,
              placeholder: t("select_target"),
            }}
          />
        </div>

        {/* Actions */}
        <div>
          <label>{t("action")}</label>
          <CustomSelect
            options={mouseActions.map((action) => ({
              value: action.value,
              label: t(action.label),
            }))}
            value={action}
            onChange={(value) => setAction(value)}
            config={{
              wrapperStyle: "w-full",
              selectorStyle:
                "w-full border rounded px-2 py-1 mt-1 flex items-center justify-between truncate max-w-full cursor-pointer",
              optionsStyle:
                "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 truncate cursor-pointer max-w-full",
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

export default MouseTriggerModal;
