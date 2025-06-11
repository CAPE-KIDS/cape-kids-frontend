"use client";

import { useEffect, useState } from "react";
import {
  psychologistMetadataSchema,
  PsychologistMetadataSchemaType,
} from "@shared/user";
import { useTranslation } from "react-i18next";

interface Props {
  value: PsychologistMetadataSchemaType;
  onChange: (data: PsychologistMetadataSchemaType) => void;
  submitted: boolean;
}

const PsychologistProfileForm = ({ value, onChange, submitted }: Props) => {
  const { t } = useTranslation("common");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (!submitted) return;

    const result = psychologistMetadataSchema.safeParse(value);

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const formatted = Object.fromEntries(
        Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? "Campo inválido"])
      );
      setErrors(formatted);
    } else {
      setErrors({});
    }
  }, [submitted, value]);

  const handleChange = <K extends keyof PsychologistMetadataSchemaType>(
    key: K,
    val: PsychologistMetadataSchemaType[K]
  ) => {
    onChange({ ...value, [key]: val });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleCommaSeparated = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "specialties" | "certifications" | "assessmentTools"
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
        <label className="text-gray-700">License Number</label>
        <input
          type="text"
          value={value.licenseNumber || ""}
          onChange={(e) => handleChange("licenseNumber", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">Specialties (comma-separated)</label>
        <input
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="e.g., Cognitive, Behavioral"
          onChange={(e) => handleCommaSeparated(e, "specialties")}
        />
      </div>

      <div>
        <label className="text-gray-700">
          Certifications (comma-separated)
        </label>
        <input
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="e.g., CBT, EMDR"
          onChange={(e) => handleCommaSeparated(e, "certifications")}
        />
      </div>

      <div>
        <label className="text-gray-700">Years of Experience</label>
        <input
          type="number"
          value={value.yearsExperience ?? ""}
          onChange={(e) =>
            handleChange("yearsExperience", e.target.valueAsNumber)
          }
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">Clinic or Institution</label>
        <input
          type="text"
          value={value.clinicOrInstitution || ""}
          onChange={(e) => handleChange("clinicOrInstitution", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">
          Assessment Tools (comma-separated)
        </label>
        <input
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="e.g., WISC, MMPI"
          onChange={(e) => handleCommaSeparated(e, "assessmentTools")}
        />
      </div>
    </div>
  );
};

export default PsychologistProfileForm;
