import DataTable from "@/components/DataTable";
import { TimelineStep } from "@/modules/timeline/types";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { capitalize } from "lodash";
import { PlusIcon } from "lucide-react";
import React, { useMemo } from "react";

export function getFirstBlockTypeAndTrigger(step: TimelineStep) {
  const firstWithTrigger = (step.metadata.blocks || []).find(
    (block) => block.triggers && block.triggers.length > 0
  );

  const triggerType = firstWithTrigger?.triggers?.[0]?.metadata.type;
  let triggerText = triggerType || "—";
  if (triggerType === "keydown") {
    triggerText = `${firstWithTrigger?.triggers?.[0]?.metadata.type} (${firstWithTrigger?.triggers?.[0]?.metadata.key})`;
  }

  return {
    type: capitalize(firstWithTrigger?.type) || "—",
    trigger: capitalize(triggerText) || "—",
  };
}

const SequentialStimuliManager = () => {
  const {
    openStimulusEditorModal,
    config,
    setEditingStep,
    removeStimulusStep,
    duplicateStimulusStep,
  } = useStimuliModal();

  const handleEdit = (stepId: string) => {
    const step = config.steps.find((s) => s.id === stepId);
    if (step) {
      setEditingStep(step);
      openStimulusEditorModal();
    }
  };

  const rows = useMemo(() => {
    return config.steps.map((step) => {
      const { type, trigger } = getFirstBlockTypeAndTrigger(step);
      return {
        id: step.id,
        type,
        name: step.metadata.title,
        trigger,
      };
    });
  }, [config.steps]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Stimulus</h2>
        <button
          className="cursor-pointer"
          onClick={() => {
            setEditingStep(null);
            openStimulusEditorModal();
          }}
        >
          <PlusIcon />
        </button>
      </div>

      {config.steps.length > 0 ? (
        <DataTable
          headers={[
            { key: "type", label: "TYPE" },
            { key: "name", label: "Name" },
            { key: "trigger", label: "Trigger" },
          ]}
          rows={rows}
          withQuickActions
          actions={[
            {
              label: "Edit",
              onClick: (row) => handleEdit(row.id),
            },
            {
              label: "Duplicate",
              onClick: (row) => duplicateStimulusStep(row.id),
            },
            {
              label: "Remove",
              onClick: (row) => removeStimulusStep(row.id),
            },
          ]}
        />
      ) : (
        <p className="text-sm text-gray-500">No stimuli added yet.</p>
      )}
    </div>
  );
};

export default SequentialStimuliManager;
