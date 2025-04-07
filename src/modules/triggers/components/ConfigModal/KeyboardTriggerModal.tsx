import React from "react";
import TriggerModalBase from "./TriggerModalBase";

interface Props {
  onClose: () => void;
}

const KeyboardTriggerModal: React.FC<Props> = ({ onClose }) => {
  return (
    <TriggerModalBase title="Keyboard Trigger" onClose={onClose}>
      <p className="text-sm text-gray-600">
        Keyboard trigger configuration. You can set up key combinations to
        trigger actions.
      </p>
    </TriggerModalBase>
  );
};

export default KeyboardTriggerModal;
