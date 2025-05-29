import React from "react";
import { X } from "lucide-react";

interface ResizableSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <div
      className="absolute top-0 right-0 h-full bg-white shadow-lg flex flex-col z-50 transition-transform duration-300 ease-out overflow-y-auto w-full max-w-[1200px]"
      style={{
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <div className="flex-1">{children}</div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-sm text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ResizableSidebar;
