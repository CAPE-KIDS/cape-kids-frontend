import React, { useEffect } from "react";
import ModalBase from "../../modals/ModalBase";
import { useStimuliModal } from "@/stores/timeline/blockTypes/stimuliModalStore";
import { MediaTypeBlocks } from "@/modules/media/components/MediaTypeBlocks";
import MultiTriggerStimuliForm from "./MultiTriggerStimuliConfigForm";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import SequentialStimuliEditorModal from "./MultiTriggerStimuliEditorModal";
import { useMultiTriggerStimuliModal } from "@/stores/timeline/blockTypes/multiTriggerStimuliStore";
import MultiTriggerStimuliManager from "./MultiTriggerStimuliManager";
import { useTranslation } from "react-i18next";

const MultiTriggerConfigModal = () => {
  const { t } = useTranslation("common");
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
        title={t("multi_trigger_modal_title")}
        onClose={closeModal}
        styles="w-[900px]"
      >
        <p className="text-xs text-gray-400 -mt-2 mb-2 border-t border-gray-300 pt-1">
          {t("stimuli_modal_description")}
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <MultiTriggerStimuliForm />

          <MultiTriggerStimuliManager />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeModal}
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              {t("close")}
            </button>
            <button
              onClick={closeModal}
              className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      </ModalBase>

      <SequentialStimuliEditorModal />
    </>
  );
};

export default MultiTriggerConfigModal;
