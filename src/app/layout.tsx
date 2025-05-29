import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAPE-KIDS",
  description:
    "CAPE-KIDS permite a criação de experimentos voltados para função executiva, com foco em crianças.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} antialiased`}>
          <Toaster position="top-right" richColors />

          <div className="flex">
            <div className="flex flex-1 flex-col h-screen overflow-auto">
              {children}
            </div>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
