"use client";

import PageHeader from "@/components/PageHeader";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t, i18n } = useTranslation("settings");
  const [selectedLang, setSelectedLang] = useState(i18n.language || "pt");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      setSelectedLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setSelectedLang(lang);
  };

  return (
    <>
      <PageHeader
        title={t("settings_title")}
        subtitle={t("settings_subtitle")}
      />

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("language")}</h2>
          <p className="text-gray-600">{t("language_description")}</p>
          <select
            value={selectedLang}
            onChange={handleLanguageChange}
            className="mt-2 p-2 border rounded w-full max-w-96"
          >
            <option value="en">{t("english")}</option>
            <option value="pt">{t("portuguese")}</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Settings;
