import React from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

type TimelineHeaderProps = {
  title: string;
  onAddStep: () => void;
};

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  title,
  onAddStep,
}) => {
  const { t: tC } = useTranslation("common");
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <button
        onClick={onAddStep}
        className="flex items-center gap-1 border border-blue-500 text-blue-600 rounded-md px-3 py-1.5 text-sm hover:bg-blue-50 transition cursor-pointer"
      >
        <Plus size={14} strokeWidth={2} />
        {tC("add_new_step")}
      </button>
    </div>
  );
};

export default TimelineHeader;
