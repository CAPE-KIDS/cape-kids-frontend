"use client";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import SidebarMenu from "@/components/SidebarMenu";
import NextTopLoader from "nextjs-toploader";
import InnactivityModal from "@/components/modals/InnactivityModal";

const inter = Inter({ subsets: ["latin"] });

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="flex">
        <SidebarMenu />
        <InnactivityModal />
        <div className="flex flex-1 flex-col h-screen overflow-auto">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
