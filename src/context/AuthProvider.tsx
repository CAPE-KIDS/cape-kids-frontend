"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/utils/api";
import { RestResponseSchemaType } from "@shared/apiResponse";
import { RegisterSchemaType, UserSchemaType } from "@shared/user";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export type AuthContextType = {
  user: UserSchemaType | null;
  token: string | null;
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
  const { setAuthState } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (stored) {
      setUser(JSON.parse(stored));
    }
    if (token) {
      setToken(token);
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
        setUser(response.data.user);
        setToken(response.data.token);

        if (response.data.user.profile.profileType === "participant") {
          router.push("/experiments");
          return response;
        }
        router.push("/dashboard");
      }
      return response;
    } catch (err) {
      console.error("Login fetch failed", err);
      return {
        error: true,
        message: "network_error",
        data: null,
      };
    }
  };

  const logout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
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

  const values = {
    user,
    token,
    login,
    logout,
    register,
  };

  useEffect(() => {
    setAuthState(values);
  }, [user, token]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
