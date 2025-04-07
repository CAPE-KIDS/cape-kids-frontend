import { Clock, Keyboard, Mic, Mouse } from "lucide-react";
import React, { JSX, useState } from "react";
import MouseTriggerModal from "./ConfigModal/MouseTriggerModal";
import KeyboardTriggerModal from "./ConfigModal/KeyboardTriggerModal";
import TimerTriggerModal from "./ConfigModal/TimerTriggerModal";
import VoiceTriggerModal from "./ConfigModal/VoiceTriggerModal";

type TriggerType = "mouse" | "keyboard" | "timer" | "voice";

const triggerOptions: { type: TriggerType; icon: JSX.Element }[] = [
  { type: "mouse", icon: <Mouse size={20} /> },
  { type: "keyboard", icon: <Keyboard size={20} /> },
  { type: "timer", icon: <Clock size={20} /> },
  { type: "voice", icon: <Mic size={20} /> },
];

const modalMap: Record<TriggerType, React.FC<{ onClose: () => void }>> = {
  mouse: MouseTriggerModal,
  keyboard: KeyboardTriggerModal,
  timer: TimerTriggerModal,
  voice: VoiceTriggerModal,
};

const TriggerButtons = () => {
  const [selectedModal, setSelectedModal] = useState<TriggerType | null>(null);

  const handleTriggerClick = (type: TriggerType) => {
    setSelectedModal(type);
  };

  const ModalComponent = selectedModal ? modalMap[selectedModal] : null;

  return (
    <>
      <div className="flex gap-1">
        {triggerOptions.map((trigger) => (
          <button
            key={trigger.type}
            className="w-8 h-8 border flex items-center justify-center bg-[#E8EBFB] cursor-pointer text-xs"
            onClick={() => handleTriggerClick(trigger.type)}
          >
            {trigger.icon}
          </button>
        ))}
      </div>

      {ModalComponent && (
        <ModalComponent onClose={() => setSelectedModal(null)} />
      )}
    </>
  );
};

export default TriggerButtons;
