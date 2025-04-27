import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { PlusIcon } from "lucide-react";
import React from "react";

const SequentialStimuliManager = () => {
  const { openStimulusEditorModal, config } = useStimuliModal();

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Stimulus</h2>
        <button
          className="cursor-pointer"
          onClick={() => openStimulusEditorModal()}
        >
          <PlusIcon />
        </button>
      </div>

      <div>
        {config.steps.length > 0 ? (
          <div className="flex flex-col gap-2">
            {config.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm">{`Step ${index + 1}`}</span>
                {step.metadata.title}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No stimuli added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SequentialStimuliManager;
