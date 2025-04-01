import { PlusCircle } from "lucide-react";
import React from "react";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-2xl font-normal text-blue-700">{title}</h3>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-blue-700 hover:text-blue-800 text-sm flex items-center cursor-pointer"
        >
          <PlusCircle size={32} />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
