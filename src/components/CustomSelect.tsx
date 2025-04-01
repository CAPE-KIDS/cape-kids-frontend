import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

type Option = {
  value: string;
  label: string;
  color: string;
};

const options: Option[] = [
  { value: "start", label: "Start", color: "#1E1E1E" },
  { value: "task", label: "Task", color: "#3B82F6" },
  { value: "custom_block", label: "Custom block", color: "#F97316" },
  { value: "conditional", label: "Conditional", color: "#34C759" },
  {
    value: "sequential_stimuli",
    label: "Sequential Stimuli",
    color: "#8F1D99",
  },
  {
    value: "simultaneous_stimuli",
    label: "Simultaneous Stimuli",
    color: "#1D8499",
  },
  { value: "end", label: "End", color: "#EF4444" },
];

interface CustomSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-[#EBEFFF] rounded-lg p-2 text-left flex items-center justify-between focus:outline-none cursor-pointer"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <svg width="12" height="12">
              <circle cx="6" cy="6" r="6" fill={selected.color} />
            </svg>
            <span>{selected.label}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select step type</span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded-md shadow-sm max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100"
            >
              <svg width="12" height="12">
                <circle cx="6" cy="6" r="6" fill={opt.color} />
              </svg>
              <span>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
