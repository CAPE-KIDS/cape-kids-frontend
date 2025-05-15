import { create } from "zustand";
import { API } from "@/utils/api";
import { AuthContextType } from "@/context/AuthProvider";

interface authStates {
  authState: AuthContextType;
  setAuthState: (authState: AuthContextType) => void;
}

export const useAuthStore = create<authStates>((set, get) => ({
  authState: {} as AuthContextType,
  setAuthState: (authState: AuthContextType) => {
    set({ authState });
  },
}));
