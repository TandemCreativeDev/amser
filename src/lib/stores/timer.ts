import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TimerState } from "@/types";

interface TimerStore extends TimerState {
  start: (description: string, projectId?: string, clientId?: string) => void;
  stop: () => void;
  reset: () => void;
  updateDescription: (description: string) => void;
  updateProject: (projectId: string, clientId: string) => void;
  tick: () => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startTime: undefined,
      description: "",
      projectId: undefined,
      clientId: undefined,
      elapsedSeconds: 0,

      start: (description: string, projectId?: string, clientId?: string) => {
        const now = new Date();
        set({
          isRunning: true,
          startTime: now,
          description,
          projectId,
          clientId,
          elapsedSeconds: 0,
        });
      },

      stop: () => {
        set({
          isRunning: false,
          startTime: undefined,
        });
      },

      reset: () => {
        set({
          isRunning: false,
          startTime: undefined,
          description: "",
          projectId: undefined,
          clientId: undefined,
          elapsedSeconds: 0,
        });
      },

      updateDescription: (description: string) => {
        set({ description });
      },

      updateProject: (projectId: string, clientId: string) => {
        set({ projectId, clientId });
      },

      tick: () => {
        const { isRunning, startTime } = get();
        if (isRunning && startTime) {
          const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
          set({ elapsedSeconds: elapsed });
        }
      },
    }),
    {
      name: "timer-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        description: state.description,
        projectId: state.projectId,
        clientId: state.clientId,
        elapsedSeconds: state.elapsedSeconds,
        isRunning: state.isRunning,
        startTime: state.startTime,
      }),
    },
  ),
);
