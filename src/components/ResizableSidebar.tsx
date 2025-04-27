import React, { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface ResizableSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  children: React.ReactNode;
}

const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  isOpen,
  onClose,
  minWidth = window.innerWidth / 3,
  maxWidth = window.innerWidth - 208,
  initialWidth = window.innerWidth - 208,
  children,
}) => {
  const isResizing = useRef(false);
  const [width, setWidth] = useState(() =>
    Math.min(Math.max(initialWidth, minWidth), maxWidth)
  );

  // Atualiza width automaticamente quando a janela for redimensionada
  const handleResize = useCallback(() => {
    const newMaxWidth = window.innerWidth - 208;
    const newMinWidth = window.innerWidth / 3;

    setWidth((prevWidth) => {
      if (prevWidth < newMinWidth) return newMinWidth;
      if (prevWidth > newMaxWidth) return newMaxWidth;
      return prevWidth;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Resize com mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      requestAnimationFrame(() => {
        const newMaxWidth = window.innerWidth - 208;
        const newMinWidth = window.innerWidth / 3;
        const newWidth = window.innerWidth - e.clientX;

        if (newWidth >= newMinWidth && newWidth <= newMaxWidth) {
          setWidth(newWidth);
        }
      });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed top-0 right-0 h-full bg-white shadow-lg flex flex-col z-50 transition-transform duration-300 ease-out"
      style={{
        width,
        transform: isOpen ? "translateX(0)" : `translateX(${width}px)`,
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={() => (isResizing.current = true)}
        className="absolute left-0 top-0 h-full w-1 cursor-col-resize bg-gray-300"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-4 max-h-full">
        {children}
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-sm text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={16} className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ResizableSidebar;
