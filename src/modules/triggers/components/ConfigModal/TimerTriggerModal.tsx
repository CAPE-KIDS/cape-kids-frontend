import React from "react";
import TriggerModalBase from "./TriggerModalBase";

interface Props {
  onClose: () => void;
}

const TimerTriggerModal: React.FC<Props> = ({ onClose }) => {
  return (
    <TriggerModalBase title="Timer Trigger" onClose={onClose}>
      <p className="text-sm text-gray-600">
        Time trigger configuration. You can set up time intervals to trigger
      </p>
    </TriggerModalBase>
  );
};

export default TimerTriggerModal;
