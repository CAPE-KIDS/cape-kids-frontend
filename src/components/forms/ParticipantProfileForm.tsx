"use client";

import { useEffect, useState } from "react";
import {
  participantMetadataSchema,
  ParticipantMetadataSchemaType,
} from "@shared/user";
import { set } from "lodash";
import { useTranslation } from "react-i18next";

interface Props {
  value: ParticipantMetadataSchemaType;
  onChange: (data: ParticipantMetadataSchemaType) => void;
  submitted: boolean;
}

const ParticipantProfileForm = ({ value, onChange, submitted }: Props) => {
  const { t } = useTranslation("common");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (!submitted) return;
    const result = participantMetadataSchema.safeParse(value);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const formatted = Object.fromEntries(
        Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? "Invalid field"])
      );
      setErrors(formatted);
    } else {
      setErrors({});
    }
  }, [submitted, value]);

  const handleChange = <K extends keyof ParticipantMetadataSchemaType>(
    key: K,
    val: ParticipantMetadataSchemaType[K]
  ) => {
    if (val === "") {
      onChange({ ...value, [key]: undefined });
      return;
    }
    onChange({ ...value, [key]: val });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleCommaSeparated = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "medicalConditions" | "medications"
  ) => {
    const parsed = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    handleChange(field, parsed);
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div>
        <label className="text-gray-700">{t("age")}</label>
        <input
          type="number"
          value={value.age ?? ""}
          onChange={(e) => {
            if (e.target.value === "") {
              handleChange("age", undefined);
              return;
            }
            handleChange("age", e.target.valueAsNumber);
          }}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.age && <p className="text-red-500 text-sm">{t("required")}</p>}
      </div>

      <div>
        <label className="text-gray-700">{t("gender")}</label>
        <select
          value={value.gender ?? ""}
          onChange={(e) => handleChange("gender", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        >
          {!value.gender && <option value="">{t("select")}...</option>}
          <option value="male">{t("male")}</option>
          <option value="female">{t("female")}</option>
          <option value="ratherNotSay">{t("rather_not_say")}</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm">{t("required")}</p>
        )}
      </div>

      <div>
        <label className="text-gray-700">{t("handedness")}</label>
        <input
          value={value.handedness ?? ""}
          onChange={(e) => handleChange("handedness", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">{t("native_language")}</label>
        <input
          value={value.nativeLanguage ?? ""}
          onChange={(e) => handleChange("nativeLanguage", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">{t("medical_conditions")}</label>
        <input
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="e.g., ADHD, Dyslexia"
          onChange={(e) => handleCommaSeparated(e, "medicalConditions")}
        />
      </div>

      <div>
        <label className="text-gray-700">{t("medications")}</label>
        <input
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="e.g., Ritalin, Concerta"
          onChange={(e) => handleCommaSeparated(e, "medications")}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.parentalConsent ?? false}
          onChange={(e) => handleChange("parentalConsent", e.target.checked)}
          id="parentalConsent"
          className="w-4 h-4"
        />
        <label htmlFor="parentalConsent" className="text-gray-700">
          {t("has_parental_consent")}
        </label>
        {errors.parentalConsent && (
          <p className="text-red-500 text-sm">{t("required")}</p>
        )}
      </div>
    </div>
  );
};

export default ParticipantProfileForm;
