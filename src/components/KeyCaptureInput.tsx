"use client";

import { normalizeKeyCombo } from "@/utils/functions";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface KeyCaptureInputProps {
  value: string;
  onKeyCapture: (value: string) => void;
}

const KeyCaptureInput: React.FC<KeyCaptureInputProps> = ({
  value,
  onKeyCapture,
}) => {
  const { t } = useTranslation("common");
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!listening) return;

    function handleKeyDown(e: KeyboardEvent) {
      e.preventDefault();

      const combo = normalizeKeyCombo(e);

      if (combo) {
        onKeyCapture(combo);
        setListening(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [listening, onKeyCapture]);

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm">{t("key")}</label>
      <input
        ref={inputRef}
        type="text"
        className="w-full border rounded px-2 py-1 mt-1"
        value={value}
        onFocus={() => setListening(true)}
        onBlur={() => setListening(false)}
        placeholder={t("press_key_placeholder")}
        readOnly
      />
      {listening && (
        <p className="text-xs text-blue-600 mt-1">{t("press_key_message")}</p>
      )}
    </div>
  );
};

export default KeyCaptureInput;
