import React from "react";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Pencil, Trash2 } from "lucide-react";
import { Trigger } from "@/modules/triggers/types";
import { capitalize } from "lodash";
import { confirm } from "@/components/confirm/confirm";
import { useTranslation } from "react-i18next";

interface TriggerWithBlock extends Trigger {
  blockId: string;
  blockLabel: string;
  blockData?: string;
}

const TriggerManager: React.FC = () => {
  const { t: tC } = useTranslation("common");
  const { blocks, removeTriggerFromBlock } = useEditorStore();

  const allTriggers: TriggerWithBlock[] = blocks.flatMap((block) => {
    return (block.triggers || []).map((trigger) => {
      const { type, key, action } = trigger.metadata;

      let blockLabel = "";
      let blockData: string | undefined;

      if (type === "keydown") {
        blockLabel = `${tC("screen")} (Keyboard)`;
        blockData = undefined;
      } else {
        const readableType =
          block.type === "screen"
            ? `${tC("screen")}`
            : `${capitalize(block.type)} Media`;
        blockLabel = `${readableType} (${type})`;

        blockData =
          block.type === "text"
            ? block.data?.text
            : block.type === "image"
            ? tC("image")
            : undefined;
      }

      return {
        ...trigger,
        blockId: block.id,
        blockLabel,
        blockData,
      };
    });
  });

  const handleRemove = (trigger: TriggerWithBlock) => {
    removeTriggerFromBlock(trigger.blockId, trigger.id);
  };

  return (
    <div className="flex flex-col gap-2 mt-6">
      <h3 className="text-md font-semibold">Triggers</h3>

      {allTriggers.length === 0 && (
        <p className="text-sm text-gray-500">{tC("no_trigger_added")}</p>
      )}

      <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2">
        {allTriggers.map((trigger) => (
          <div
            key={trigger.id}
            className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2 text-sm"
          >
            <div className="flex flex-col">
              <span>
                <strong>{trigger.blockLabel}</strong>
                {trigger.blockData ? `: "${trigger.blockData}"` : ""}
              </span>
              <span>
                {trigger.metadata.type}{" "}
                <code>{trigger.metadata.key || ""}</code> →{" "}
                <strong>{trigger.metadata.action}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              {/* <button
              title="Edit trigger"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => alert("Editing not yet implemented")}
            >
              <Pencil size={16} />
            </button> */}
              <button
                title={tC("delete_trigger")}
                className="text-red-500 hover:text-red-700 cursor-pointer"
                onClick={async () => {
                  const ok = await confirm({
                    title: tC("confirm_trigger_removal"),
                    message: "",
                  });
                  if (!ok) return;
                  handleRemove(trigger);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TriggerManager;
