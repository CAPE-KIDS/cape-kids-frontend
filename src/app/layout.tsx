"use client";

import "../i18n";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/components/confirm/ConfirmProvider";
import Head from "next/head";
import { I18nGuard } from "@/locales/i18nGuard";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <title>CAPE-KIDS - App</title>
        <meta
          name="description"
          content="CAPE-KIDS permite a criação de experimentos voltados para função executiva, com foco em crianças."
        />
      </Head>
      <html lang="en">
        <AuthProvider>
          <body className={`${inter.className} antialiased`}>
            <Toaster position="top-right" richColors />

            <ConfirmProvider>
              <I18nGuard>
                <div className="flex">
                  <div className="flex flex-1 flex-col h-screen overflow-auto">
                    {children}
                  </div>
                </div>
              </I18nGuard>
            </ConfirmProvider>
            <div id="modal-root" />
          </body>
        </AuthProvider>
      </html>
    </>
  );
}
