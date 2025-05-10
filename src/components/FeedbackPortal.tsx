import { useEffect } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  visible: boolean;
  children: React.ReactNode;
}

const Portal = ({ visible, children }: PortalProps) => {
  if (!visible) return null;

  const portalRoot = document.getElementById("portal-root");

  useEffect(() => {
    if (visible) {
      document.body.style.pointerEvents = "none";
    }
  }, [visible]);

  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full z-[501] pointer-events-none">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
        {children}
      </div>
    </div>,
    portalRoot
  );
};

export default FeedbackPortal;
