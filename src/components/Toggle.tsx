// components/ui/Toggle.tsx
type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 cursor-pointer
          ${checked ? "bg-blue-500" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 
            ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}
