"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/User";
import { API } from "@/utils/api";
import { RestResponseSchemaType } from "@shared/apiResponse";
import { RegisterSchemaType } from "@shared/user";

type AuthContextType = {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<RestResponseSchemaType | null>;
  logout: () => void;
  register: (
    data: RegisterSchemaType
  ) => Promise<RestResponseSchemaType | null>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const request = await fetch(API.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const response = (await request.json()) as RestResponseSchemaType;
      if (!response.error) {
        document.cookie = `auth_token=${response.data?.token}; path=/`;
        localStorage.setItem("user", JSON.stringify(response.data?.user));
        setUser(user);
        router.push("/dashboard");
      }
      return response;
    } catch (err) {
      console.error("Login fetch failed", err);
      return {
        error: true,
        message: "Network error",
        data: null,
      };
    }
  };

  const logout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const register = async (data: RegisterSchemaType) => {
    try {
      const request = await fetch(API.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = (await request.json()) as RestResponseSchemaType;
      return response;
    } catch (err) {
      console.error("Register fetch failed", err);
      return {
        error: true,
        message: "Network error",
        data: null,
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
