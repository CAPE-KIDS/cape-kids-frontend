"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Microscope,
  Brain,
  Users,
  FileChartColumn,
  Settings,
  CircleUser,
  LogOut,
  ChevronLeft,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useTranslation } from "react-i18next";

type MenuItemProps = {
  title: string;
  icon: React.ElementType;
  url: string;
  onClick?: () => void;
  collapsed: boolean;
  adminOnly?: boolean;
};

function MenuItem({
  title,
  icon: Icon,
  url,
  onClick,
  collapsed,
  adminOnly = false,
}: MenuItemProps) {
  const { authState } = useAuthStore();
  const pathname = usePathname();
  const isActive = pathname.startsWith(url);

  const baseClass = `h-10 flex items-center gap-3 p-4 rounded-md transition-colors ${
    isActive
      ? "bg-blue-700 text-white font-semibold"
      : "text-white hover:bg-blue-600"
  } ${collapsed && "overflow-hidden w-12"}`;

  if (authState.user?.profile.profileType === "participant" && adminOnly)
    return null;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={baseClass + ` cursor-pointer ${!collapsed && "w-full"}`}
      >
        <div className="flex w-5">
          <Icon size={20} />
        </div>
        <span
          className={`flex-1 transition-all text-left ${
            collapsed ? "w-0" : "w-full"
          }`}
        >
          {title}
        </span>
      </button>
    );
  }

  return (
    <Link href={url} className={baseClass}>
      <div className="flex w-5">
        <Icon size={20} />
      </div>
      <span className={`flex-1 transition-all ${collapsed ? "w-0" : "w-full"}`}>
        {title}
      </span>
    </Link>
  );
}

export default function SidebarMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const { authState } = useAuthStore();
  const { t } = useTranslation("common");

  const menuItems = [
    {
      title: t("navigation.dashboard"),
      icon: LayoutDashboard,
      url: "/dashboard",
      adminOnly: true,
    },
    {
      title: t("navigation.experiments"),
      icon: Microscope,
      url: "/experiments",
    },
    { title: t("navigation.trainings"), icon: Brain, url: "/trainings" },
    {
      title: t("navigation.tasks"),
      icon: ClipboardList,
      url: "/tasks",
      adminOnly: true,
    },
    {
      title: t("navigation.participants"),
      icon: Users,
      url: "/participants",
      adminOnly: true,
    },
    // {
    //   title: t("navigation.reports"),
    //   icon: FileChartColumn,
    //   url: "/reports",
    //   adminOnly: true,
    // },
    { title: t("navigation.settings"), icon: Settings, url: "/settings" },
  ];

  const configItems = [
    { title: t("navigation.account"), icon: CircleUser, url: "/account" },
    {
      title: t("navigation.logout"),
      icon: LogOut,
      url: "/logout",
      onClick: () => {
        authState.logout();
      },
    },
  ];

  return (
    <aside
      className={`h-screen bg-blue-capekids shadow-lg flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-52"
      }`}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-center mb-16">
          {collapsed ? (
            <Image
              src={"/logo-colapsed.svg"}
              alt="Logo"
              width={40}
              height={40}
              className={"relative left-2"}
            />
          ) : (
            <Image
              src={"/logo-white.svg"}
              alt="Logo"
              width={140}
              height={40}
              className="min-w-36"
            />
          )}
        </div>
        <p
          className={`text-xs text-white mb-4 font-light ${
            collapsed ? "px-2" : "px-4"
          }`}
        >
          MENU
        </p>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.visible === false) return null;
            return (
              <li key={item.title}>
                <MenuItem
                  {...item}
                  collapsed={collapsed}
                  adminOnly={item.adminOnly}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-white space-y-2">
        <ul className="space-y-2">
          {configItems.map((item) => (
            <li key={item.title}>
              <MenuItem {...item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex gap-3 w-full px-8 h-10 items-center bg-blue-700 text-white cursor-pointer"
      >
        <div className="flex w-5">
          <ChevronLeft size={24} className={`${collapsed && "rotate-180"} `} />
        </div>
        <span
          className={`transition-all ${collapsed ? "w-0" : "will-change-auto"}`}
        >
          {!collapsed && t("navigation.collapse")}
        </span>
      </button>
    </aside>
  );
}
