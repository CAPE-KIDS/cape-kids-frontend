"use client";

import { useEffect, useState } from "react";
import {
  researcherMetadataSchema,
  ResearcherMetadataSchemaType,
} from "@shared/user";

interface Props {
  value: ResearcherMetadataSchemaType;
  onChange: (data: ResearcherMetadataSchemaType) => void;
  submitted: boolean;
}

const ResearcherProfileForm = ({ value, onChange, submitted }: Props) => {
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
        <label className="text-gray-700">Institution</label>
        <input
          type="text"
          value={value.institution || ""}
          onChange={(e) => handleChange("institution", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.institution && (
          <p className="text-red-500 text-sm">{errors.institution}</p>
        )}
      </div>

      <div>
        <label className="text-gray-700">Department</label>
        <input
          type="text"
          value={value.department || ""}
          onChange={(e) => handleChange("department", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.department && (
          <p className="text-red-500 text-sm">{errors.department}</p>
        )}
      </div>

      <div>
        <label className="text-gray-700">Degree</label>
        <input
          type="text"
          value={value.degree || ""}
          onChange={(e) => handleChange("degree", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.degree && (
          <p className="text-red-500 text-sm">{errors.degree}</p>
        )}
      </div>

      <div>
        <label className="text-gray-700">
          Research Areas (comma-separated)
        </label>
        <input
          placeholder="e.g., Neuroscience, Education"
          onChange={(e) => handleCommaSeparated(e, "researchAreas")}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">Affiliations (comma-separated)</label>
        <input
          placeholder="e.g., IEEE, APA"
          onChange={(e) => handleCommaSeparated(e, "affiliations")}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">ORCID ID</label>
        <input
          type="url"
          value={value.orcidId || ""}
          onChange={(e) => handleChange("orcidId", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">LinkedIn</label>
        <input
          type="url"
          value={value.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="text-gray-700">Google Scholar</label>
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
