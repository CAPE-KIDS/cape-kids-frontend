import React, { useEffect } from "react";
import ModalBase from "../../modals/ModalBase";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import MultiTriggerStimuliForm from "./MultiTriggerStimuliConfigForm";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import SequentialStimuliEditorModal from "./MultiTriggerStimuliEditorModal";
import { useMultiTriggerStimuliModal } from "@/stores/timeline/blockTypes/multiTriggerStimuliStore";
import MultiTriggerStimuliManager from "./MultiTriggerStimuliManager";

const MultiTriggerConfigModal = () => {
  const { open, closeModal } = useMultiTriggerStimuliModal();
  const { setEditorContext } = useEditorStore();

  useEffect(() => {
    if (open) {
      setEditorContext("multi_trigger_stimuli");
    }

    return () => {
      setEditorContext("main");
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <ModalBase
        title="Multi Trigger Stimuli Configuration"
        onClose={closeModal}
        styles="w-[900px]"
      >
        <p className="text-xs text-gray-400 -mt-2 mb-2 border-t border-gray-300 pt-1">
          These configurations apply to all stimuli in this block, unless you
          define individual configuration.
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <MultiTriggerStimuliForm />

          <MultiTriggerStimuliManager />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeModal}
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={closeModal}
              className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </ModalBase>

      <SequentialStimuliEditorModal />
    </>
  );
};

export default MultiTriggerConfigModal;
