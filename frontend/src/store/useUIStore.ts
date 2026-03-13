import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppView } from "../components/calendar/types";

interface UIStore {
  assistantOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  eventsPerPage: number;
  setEventsPerPage: (n: number) => void;
  calendarView: AppView;
  setCalendarView: (v: AppView) => void;
  calendarDate: string; // ISO string — Date is not serializable in localStorage
  setCalendarDate: (d: Date) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      assistantOpen: false,
      openAssistant: () => set({ assistantOpen: true }),
      closeAssistant: () => set({ assistantOpen: false }),
      eventsPerPage: 12,
      setEventsPerPage: (n) => set({ eventsPerPage: n }),
      calendarView: "month",
      setCalendarView: (v) => set({ calendarView: v }),
      calendarDate: new Date().toISOString(),
      setCalendarDate: (d) => set({ calendarDate: d.toISOString() }),
    }),
    {
      name: "ui-preferences",
      partialize: (state) => ({
        eventsPerPage: state.eventsPerPage,
        calendarView: state.calendarView,
        calendarDate: state.calendarDate,
      }),
    },
  ),
);
