import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode; // conteúdo customizável do lado direito
}

const PageHeader: React.FC<HeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-b-blue-500">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};

export default PageHeader;
