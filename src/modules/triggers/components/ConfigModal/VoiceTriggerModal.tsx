import React from "react";
import TriggerModalBase from "./TriggerModalBase";

interface Props {
  onClose: () => void;
}

const VoiceTriggerModal: React.FC<Props> = ({ onClose }) => {
  return (
    <TriggerModalBase title="Voice Trigger" onClose={onClose}>
      <p className="text-sm text-gray-600">Voice config</p>
    </TriggerModalBase>
  );
};

export default VoiceTriggerModal;
