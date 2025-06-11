"use client";

import { useEffect, useState } from "react";
import {
  researcherMetadataSchema,
  ResearcherMetadataSchemaType,
} from "@shared/user";
import { useTranslation } from "react-i18next";

interface Props {
  value: ResearcherMetadataSchemaType;
  onChange: (data: ResearcherMetadataSchemaType) => void;
  submitted: boolean;
}

const ResearcherProfileForm = ({ value, onChange, submitted }: Props) => {
  const { t } = useTranslation("common");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (!submitted) return;

    const result = researcherMetadataSchema.safeParse(value);
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

  const handleChange = <K extends keyof ResearcherMetadataSchemaType>(
    key: K,
    val: ResearcherMetadataSchemaType[K]
  ) => {
    onChange({ ...value, [key]: val });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleCommaSeparated = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "researchAreas" | "affiliations"
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
        <label className="text-gray-700">{t("institution")}</label>
        <input
          type="text"
          value={value.institution || ""}
          onChange={(e) => handleChange("institution", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.institution && (
          <p className="text-red-500 text-sm">{t("required")}</p>
        )}
      </div>

      <div>
        <label className="text-gray-700">{t("department")}</label>
        <input
          type="text"
          value={value.department || ""}
          onChange={(e) => handleChange("department", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.department && (
          <p className="text-red-500 text-sm">{t("required")}</p>
        )}
      </div>

      <div>
        <label className="text-gray-700">{t("degree")}</label>
        <input
          type="text"
          value={value.degree || ""}
          onChange={(e) => handleChange("degree", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.degree && (
          <p className="text-red-500 text-sm">{t("required")}</p>
        )}
      </div>

      <div>
        <label className="text-gray-700">{t("research_areas")}</label>
        <input
          placeholder="e.g., Neuroscience, Education"
          onChange={(e) => handleCommaSeparated(e, "researchAreas")}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">{t("affiliations")}</label>
        <input
          placeholder="e.g., IEEE, APA"
          onChange={(e) => handleCommaSeparated(e, "affiliations")}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">{t("orcid_id")}</label>
        <input
          type="url"
          value={value.orcidId || ""}
          onChange={(e) => handleChange("orcidId", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">{t("linkedin")}</label>
        <input
          type="url"
          value={value.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">{t("google_scholar")}</label>
        <input
          type="url"
          value={value.googleScholar || ""}
          onChange={(e) => handleChange("googleScholar", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>
    </div>
  );
};

export default ResearcherProfileForm;
