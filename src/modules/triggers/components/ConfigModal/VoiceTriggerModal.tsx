import React from "react";
import ModalBase from "../../../../components/modals/ModalBase";

interface Props {
  onClose: () => void;
}

const VoiceTriggerModal: React.FC<Props> = ({ onClose }) => {
  return (
    <ModalBase title="Voice Trigger" onClose={onClose}>
      <p className="text-sm text-gray-600">Voice config</p>
    </ModalBase>
  );
};

export default VoiceTriggerModal;
