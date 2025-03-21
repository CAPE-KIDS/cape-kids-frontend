"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/User";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: User = {
  id: "1",
  name: "Cientista Capekids",
  email: "teste@capekids.com",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("mock_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 500));

    const mockUser = { ...MOCK_USER, email };

    document.cookie = "auth_token=mock-token; path=/";
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    setUser(mockUser);
    router.push("/dashboard");
  };

  const logout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("mock_user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
