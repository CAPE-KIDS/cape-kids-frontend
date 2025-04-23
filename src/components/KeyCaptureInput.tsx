import React, { useEffect, useRef, useState } from "react";

interface KeyCaptureInputProps {
  value: string;
  onKeyCapture: (value: string) => void;
}

const KeyCaptureInput: React.FC<KeyCaptureInputProps> = ({
  value,
  onKeyCapture,
}) => {
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!listening) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      let key = e.key.toLowerCase();
      if (key === "control") key = "ctrl";
      if (key === " ") key = "space";
      if (key === "escape") key = "esc";

      const modifiers = [];
      if (e.ctrlKey) modifiers.push("ctrl");
      if (e.altKey) modifiers.push("alt");
      if (e.shiftKey) modifiers.push("shift");

      const isModifierKey = ["ctrl", "shift", "alt", "meta"].includes(key);
      const combo =
        !isModifierKey || modifiers.length === 0
          ? [...modifiers, key].join("+")
          : null;

      if (combo) {
        onKeyCapture(combo);
        setListening(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [listening, onKeyCapture]);

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm">Key:</label>
      <input
        ref={inputRef}
        type="text"
        className="w-full border rounded px-2 py-1 mt-1"
        value={value}
        onFocus={() => setListening(true)}
        onBlur={() => setListening(false)}
        placeholder="Press a key"
        readOnly
      />
      {listening && (
        <p className="text-xs text-blue-600 mt-1">Listening... press any key</p>
      )}
    </div>
  );
};

export default KeyCaptureInput;
