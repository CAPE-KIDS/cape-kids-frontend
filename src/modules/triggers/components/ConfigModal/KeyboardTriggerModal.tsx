import React, { useState } from "react";
import ModalBase from "../../../../components/ModalBase";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import CustomSelect from "@/components/CustomSelect";
import { MediaBlock } from "@/modules/media/types";
import { capitalize, random } from "lodash";
import { Trigger } from "../../types";
import { TriggerActionsRegistry } from "../../TriggerActionsRegistry";
import KeyCaptureInput from "@/components/KeyCaptureInput";

interface Props {
  onClose: () => void;
}

const keyboardActions = Object.values(TriggerActionsRegistry).map((action) => ({
  value: action.type,
  label: action.label,
}));

const KeyboardTriggerModal: React.FC<Props> = ({ onClose }) => {
  const { blocks, addTriggerToBlock, updateStep } = useEditorStore();
  const [keyCombo, setKeyCombo] = useState("");
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    const isBlock = blocks.find((block) => block.type === "screen");

    const triggerData = {
      id: random(1000, 9999).toString(),
      timeline_step_id: "1234-5678-9101",
      stimulus_id: isBlock?.id || "screen",
      metadata: {
        type: "keydown",
        key: keyCombo,
        description,
        action,
      },
    } as Trigger;

    if (isBlock) {
      addTriggerToBlock(null, triggerData);
    }

    onClose();
  };

  return (
    <ModalBase title="Keyboard Trigger" onClose={onClose}>
      <div className="flex flex-col gap-3 text-sm">
        {/* Key Combo */}
        <KeyCaptureInput value={keyCombo} onKeyCapture={setKeyCombo} />

        {/* Action */}
        <div>
          <label>Action</label>
          <CustomSelect
            options={keyboardActions}
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
              placeholder: "Select an action",
            }}
          />
        </div>

        {/* Description */}
        <label>
          Description (optional):
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
            rows={2}
            placeholder="Describe the trigger action"
          />
        </label>

        {/* Botões */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default KeyboardTriggerModal;
