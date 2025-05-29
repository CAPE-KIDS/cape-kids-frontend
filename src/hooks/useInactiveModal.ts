import { useEffect, useState } from "react";
import IdleJs from "idle-js";

export function useInactivityModal({
  timeoutMinutes = 5,
  onTriggerModal,
}: {
  timeoutMinutes?: number;
  onTriggerModal: () => void;
}) {
  const [wasIdle, setWasIdle] = useState(false);
  console.log("timeoutMinutes", timeoutMinutes);
  useEffect(() => {
    const idle = new IdleJs({
      idle: timeoutMinutes * 60 * 1000,
      events: ["mousemove", "keydown", "mousedown", "touchstart", "scroll"],
      keepTracking: true,
      recurIdleCall: false,
      onIdle: () => {
        setWasIdle(true);
        onTriggerModal();
      },
      onShow: () => {
        if (wasIdle) {
          onTriggerModal();
          setWasIdle(false);
        }
      },
    });

    idle.start();
    console.log("iddle", idle);

    return () => {
      idle.stop();
    };
  }, [timeoutMinutes, onTriggerModal, wasIdle]);
}
