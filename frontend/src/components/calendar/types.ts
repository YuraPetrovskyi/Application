import type { Event } from "../../types";

export type AppView = "month" | "week" | "day" | "agenda" | "year";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Event;
}
