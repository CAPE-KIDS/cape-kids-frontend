import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

export type Option = {
  value: string;
  label: string | React.ReactNode;
  color?: string;
  icon?: React.ReactNode;
};

interface CustomSelectProps {
  value: string | null;
  onChange: (value: string) => void;
  options: Option[];
  config?: {
    wrapperStyle?: string;
    selectorStyle?: string;
    showToggle?: boolean;
    optionsStyle?: string;
    dropdownStyle?: string;
  };
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  config = {
    wrapperStyle: "",
    selectorStyle:
      "w-full bg-[#EBEFFF] rounded-lg p-2 text-left flex items-center justify-between focus:outline-none cursor-pointer",
    optionsStyle:
      "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100",
    dropdownStyle:
      "absolute z-10 bg-white border w-full mt-1 rounded-md shadow-sm max-h-60 overflow-y-auto",
    showToggle: true,
  },
}) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div
      className={`relative ${config?.wrapperStyle}`}
      key={JSON.stringify(options)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${config?.selectorStyle}`}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            {selected.color && (
              <svg width="12" height="12">
                <circle cx="6" cy="6" r="6" fill={selected.color} />
              </svg>
            )}
            {selected.icon && <span>{selected.icon}</span>}
            {typeof selected.label === "string" ? (
              <span className="text-sm">{selected.label}</span>
            ) : (
              selected.label
            )}
          </div>
        ) : (
          <span className="text-gray-400">Select step type</span>
        )}
        {config?.showToggle && (
          <span className="text-gray-400">
            <ChevronDown size={16} />
          </span>
        )}
      </button>

      {open && (
        <ul className={config?.dropdownStyle}>
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={config?.optionsStyle}
            >
              {opt.color && (
                <svg width="12" height="12">
                  <circle cx="6" cy="6" r="6" fill={opt.color} />
                </svg>
              )}
              {opt.label && <span>{opt.label}</span>}
              {opt.icon && <span className="ml-auto">{opt.icon}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
