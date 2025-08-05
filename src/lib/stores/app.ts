import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Organisation, ViewMode } from "@/types";

interface AppStore {
  viewMode: ViewMode;
  currentOrganisation: Organisation | null;
  setViewMode: (mode: ViewMode) => void;
  setCurrentOrganisation: (org: Organisation | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      viewMode: "personal",
      currentOrganisation: null,

      setViewMode: (mode: ViewMode) => {
        set({ viewMode: mode });
      },

      setCurrentOrganisation: (org: Organisation | null) => {
        set({
          currentOrganisation: org,
          viewMode: org ? "organisation" : "personal",
        });
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
