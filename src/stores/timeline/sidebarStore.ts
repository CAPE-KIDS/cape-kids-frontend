// stores/timeline/sidebarStore.ts
import { create } from "zustand";
import { TimelineStep } from "@/modules/timeline/types";

interface SidebarState {
  sidebarOpen: boolean;
  currentStep: TimelineStep | null;
  openSidebar: (step: TimelineStep | null) => void;
  closeSidebar: () => void;
}

export const useTimelineSidebar = create<SidebarState>((set) => ({
  sidebarOpen: false,
  currentStep: null,
  openSidebar: (step) => set({ sidebarOpen: true, currentStep: step }),
  closeSidebar: () => set({ sidebarOpen: false, currentStep: null }),
}));
