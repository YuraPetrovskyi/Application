import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  assistantOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  eventsPerPage: number;
  setEventsPerPage: (n: number) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      assistantOpen: false,
      openAssistant: () => set({ assistantOpen: true }),
      closeAssistant: () => set({ assistantOpen: false }),
      eventsPerPage: 12,
      setEventsPerPage: (n) => set({ eventsPerPage: n }),
    }),
    {
      name: "ui-preferences",
      // Only persist the preference, not the drawer state
      partialize: (state) => ({ eventsPerPage: state.eventsPerPage }),
    },
  ),
);
