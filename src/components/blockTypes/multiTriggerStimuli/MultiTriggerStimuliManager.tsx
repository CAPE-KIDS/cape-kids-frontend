import DataTable from "@/components/DataTable";
import { useMultiTriggerStimuliModal } from "@/stores/timeline/blockTypes/multiTriggerStimuliStore";
import { TimelineStep } from "@shared/timeline";
import { capitalize } from "lodash";
import { PlusIcon } from "lucide-react";
import React, { useMemo } from "react";

export function getBlockTypeAndTrigger(step: TimelineStep) {
  const firstWithTrigger = (step.metadata.blocks || []).find(
    (block) => block.triggers && block.triggers.length > 0
  );

  const triggerType = firstWithTrigger?.triggers?.[0]?.metadata.type;
  let triggerText = triggerType || "—";
  if (triggerType === "keydown") {
    triggerText = `${firstWithTrigger?.triggers?.[0]?.metadata.type} (${firstWithTrigger?.triggers?.[0]?.metadata.key})`;

    if (firstWithTrigger?.triggers.length > 1) {
      triggerText = `${firstWithTrigger?.triggers?.[0]?.metadata.type} (multiple keys)`;
    }
  }

  return {
    type: capitalize(firstWithTrigger?.type) || "—",
    trigger: capitalize(triggerText) || "—",
  };
}

const MultiTriggerStimuliManager = () => {
  const {
    openMultiTriggerStimulusEditorModal,
    config,
    steps,
    setEditingStep,
    removeStimulusStep,
    duplicateStimulusStep,
    updateStimulusOrder,
  } = useMultiTriggerStimuliModal();

  const handleEdit = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      setEditingStep(step);
      openMultiTriggerStimulusEditorModal();
    }
  };

  const rows = useMemo(() => {
    return steps.map((step) => {
      const { type, trigger } = getBlockTypeAndTrigger(step);
      return {
        id: step.id,
        type,
        name: step.metadata.title,
        trigger,
      };
    });
  }, [steps]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Stimulus</h2>
        <button
          className="cursor-pointer"
          onClick={() => {
            setEditingStep(null);
            openMultiTriggerStimulusEditorModal();
          }}
        >
          <PlusIcon />
        </button>
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        {steps.length > 0 ? (
          <DataTable
            headers={[
              { key: "type", label: "TYPE" },
              { key: "name", label: "Name" },
              { key: "trigger", label: "Trigger" },
            ]}
            rows={rows}
            withQuickActions
            actions={[
              { label: "Edit", onClick: (row) => handleEdit(row.id) },
              {
                label: "Duplicate",
                onClick: (row) => duplicateStimulusStep(row.id),
              },
              { label: "Remove", onClick: (row) => removeStimulusStep(row.id) },
            ]}
            onReorder={(newOrder) => updateStimulusOrder(newOrder)}
          />
        ) : (
          <p className="text-sm text-gray-500">No stimuli added yet.</p>
        )}
      </div>
    </div>
  );
};

export default MultiTriggerStimuliManager;
