"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function I18nGuard({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "pt";
    i18n.changeLanguage(lang).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
