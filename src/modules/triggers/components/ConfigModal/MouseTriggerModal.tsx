import React, { useState } from "react";
import TriggerModalBase from "./TriggerModalBase";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import CustomSelect, { Option } from "@/components/CustomSelect";
import { MediaBlock } from "@/modules/media/types";
import { capitalize, random } from "lodash";
import { Trigger } from "../../types";
import { TriggerActionsRegistry } from "../../TriggerActionsRegistry";

interface Props {
  onClose: () => void;
}

const mouseEvents = [
  { value: "click", label: "Click" },
  { value: "doubleClick", label: "Double click" },
  { value: "hover", label: "Hover" },
  { value: "wheel", label: "Wheel" },
  { value: "rightClick", label: "Right Click" },
  { value: "dragStart", label: "Drag Start" },
  { value: "dragEnd", label: "Drag End" },
];

const mouseActions = Object.values(TriggerActionsRegistry).map((action) => ({
  value: action.type,
  label: action.label,
}));

const MouseTriggerModal: React.FC<Props> = ({ onClose }) => {
  const { blocks, addTriggerToBlock, updateStep } = useEditorStore();
  const [eventType, setEventType] = useState("");
  const [target, setTarget] = useState("");
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    const isBlock = blocks.find((block) => block.id === target);
    const triggerData = {
      id: random(1000, 9999).toString(),
      timeline_step_id: "1234-5678-9101",
      stimullus_id: target,
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
        label: "Screen",
      };
    }
    return {
      value: block.id,
      label: `${capitalize(block.type)} Media: ${block.data.text}`,
    };
  };

  return (
    <TriggerModalBase title="Mouse Trigger" onClose={onClose}>
      <div className="flex flex-col gap-3 text-sm">
        {/* Event type */}
        <div>
          <label>Type:</label>
          <CustomSelect
            options={mouseEvents.map((ev) => ({
              value: ev.value,
              label: ev.label,
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
              placeholder: "Select an event",
            }}
          />
        </div>

        {/* Target */}
        <div>
          <label>Target:</label>
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
              placeholder: "Select a target",
            }}
          />
        </div>

        {/* Actions */}
        <label>Action</label>
        <CustomSelect
          options={mouseActions.map((action) => ({
            value: action.value,
            label: action.label,
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
            placeholder: "Select an action",
          }}
        />

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
    </TriggerModalBase>
  );
};

export default MouseTriggerModal;
