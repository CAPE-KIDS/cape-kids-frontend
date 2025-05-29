import { useEffect, useState } from "react";

export function useInactivityModal({
  timeoutMinutes = 5,
  onTriggerModal,
}: {
  timeoutMinutes?: number;
  onTriggerModal: () => void;
}) {
  const [wasIdle, setWasIdle] = useState(false);

  useEffect(() => {
    let idle: any;

    const setupIdle = async () => {
      const { default: IdleJs } = await import("idle-js");

      idle = new IdleJs({
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
    };

    setupIdle();

    return () => {
      if (idle) idle.stop();
    };
  }, [timeoutMinutes, onTriggerModal, wasIdle]);
}
