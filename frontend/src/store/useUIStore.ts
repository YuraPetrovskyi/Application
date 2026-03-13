import { create } from "zustand";

interface UIStore {
  assistantOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  assistantOpen: false,
  openAssistant: () => set({ assistantOpen: true }),
  closeAssistant: () => set({ assistantOpen: false }),
}));
