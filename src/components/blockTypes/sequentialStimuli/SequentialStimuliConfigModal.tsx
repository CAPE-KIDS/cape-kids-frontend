import React, { useEffect } from "react";
import ModalBase from "../../ModalBase";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import SequentialStimuliConfigForm from "./SequentialStimuliConfigForm";
import SequentialStimuliManager from "./SequentialStimuliManager";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import SequentialStimuliEditorModal from "./SequentialStimuliEditorModal";

const SequentialStimuliConfigModal = () => {
  const { open, closeModal } = useStimuliModal();
  const { setEditorContext } = useEditorStore();

  useEffect(() => {
    if (open) {
      setEditorContext("stimuli");
    }

    return () => {
      setEditorContext("main");
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <ModalBase
        title="Sequential Stimuli Configuration"
        onClose={closeModal}
        styles="w-[900px]"
      >
        <p className="text-xs text-gray-400 -mt-2 mb-2 border-t border-gray-300 pt-1">
          These configurations apply to all stimuli in this block, unless you
          define individual configuration.
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <SequentialStimuliConfigForm />

          <SequentialStimuliManager />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeModal}
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
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

export default SequentialStimuliConfigModal;
