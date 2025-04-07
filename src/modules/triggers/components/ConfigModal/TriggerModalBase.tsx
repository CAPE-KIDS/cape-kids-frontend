import React from "react";

interface TriggerModalBaseProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const TriggerModalBase: React.FC<TriggerModalBaseProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] max-w-[90%] relative">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default TriggerModalBase;
